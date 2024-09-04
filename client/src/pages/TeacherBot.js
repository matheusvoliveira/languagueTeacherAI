import "./App.css";
import { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import { IoSendSharp } from "react-icons/io5";
import { FaMicrophone } from "react-icons/fa";
import axios from "axios";

function TeacherBot() {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([
    {
      user: "gpt",
      message: "I'm Nathan, your English teacher. How can I help you today?",
    },
  ]);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const inputRef = useRef(null);
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");

  const handleAudio = async () => {
    const chatLogNew = [...chatLog, { user: "me", message: transcript }];
    setInput("");
    setChatLog(chatLogNew);

    try {
      if (!transcript) {
        throw new Error("No transcript provided");
      }

      // Send a POST request with the transcript text
      const response = await axios.post(
        "http://localhost:3001/chatGpt/audio",
        { message: transcript },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { message, audio } = response.data;

      // Create a URL for the audio blob
      const audioUrl = audio;

      // Update chat log with new message and audio URL
      setChatLog([...chatLogNew, { user: "gpt", message: message }]);

      // Optionally, auto-play the audio
      const audioElement = new Audio(audioUrl);
      audioElement.play();
    } catch (error) {
      console.error("Error during audio processing:", error);
    }
  };

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onresult = (event) => {
        const transcriptArray = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setTranscript(transcriptArray);
      };

      recognitionInstance.onend = () => {
        setListening(false);
      };

      setRecognition(recognitionInstance);
    } else {
      alert("Navegador não suporta Web Speech API");
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setListening(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setListening(false);
    }
  };

  const handleClick = () => {
    if (listening) {
      stopListening();
      handleAudio();
    } else {
      startListening();
    }
    setListening(!listening);
  };

  async function handleSubmit(e) {
    if (input.trim()) {
      e.preventDefault();
      const chatLogNew = [...chatLog, { user: "me", message: input }];
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
    setInput("");
  }

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
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatLog]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="App">
      <section className="chatbox">
        <div className="chat-log">
          {chatLog.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-holder">
          <form onSubmit={handleSubmit}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="chat-input-textarea"
              placeholder="Escreve sua mensagem aqui..."
              maxLength="100"
              rows="1"
              style={{ resize: "none", overflow: "hidden" }}
            />
            <div className="send-mic-buttons"></div>
            <div className="chat-send-button-div">
              <button type="submit" className="chat-send-button">
                <IoSendSharp style={{ color: "white" }} />
              </button>
            </div>
          </form>
          <div>
            <div>
              <button onClick={handleClick} className="chat-send-button">
                <FaMicrophone style={{ color: listening ? "red" : "white" }} />
              </button>
              
              <p>
                {listening}
              </p>
              {/* <p>Transcrição: {transcript}</p> */}
              {audioUrl && <audio src={audioUrl} autoPlay />}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TeacherBot;
