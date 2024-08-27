import "./App.css";
import { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import { IoSendSharp } from "react-icons/io5";

function TeacherBot() {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([
    {
      user: "gpt",
      message: "I'm Nathan, your English teacher. How can I help you today?",
    },
  ]);
  const messagesEndRef = useRef();
  const textareaRef = useRef(null);
  async function handleSubmit(e) {
    if (input.trim()) {
      e.preventDefault();
      let chatLogNew = [...chatLog, { user: "me", message: input }];
      setInput("");
      setChatLog(chatLogNew);

      try {
        const response = await fetch("http://localhost:3001/chatGpt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: input,
          }),
        });

        if (!response.ok) {
          throw new Error("An error occurred while processing the request.");
        }

        const data = await response.json();
        setChatLog([...chatLogNew, { user: "gpt", message: data.message }]);
      } catch (error) {
        console.error(error);
      }
    }
    console.log("Message sent:", input);
    setInput("");
  }
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const handleChange = (e) => {
    setInput(e.target.value);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e); // Submit form on Enter key press
    }
  };

  // useEffect(() => {
  //   scrollToBottom();
  // }, [chatLog]);

  return (
    <div className="App">
      <section className="chatbox">
        <div className="chat-log">
          {chatLog.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>

        <div className="chat-input-holder">
          <form onSubmit={handleSubmit}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="chat-input-textarea"
              placeholder="Type your message here"
              maxlength='100'
              rows="1"
              style={{ resize: "none", overflow: "hidden" }}
            />
            <div className="chat-send-button-div">
              <button type="submit" className="chat-send-button">
                <IoSendSharp style={{ color: "white" }} />
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default TeacherBot;
