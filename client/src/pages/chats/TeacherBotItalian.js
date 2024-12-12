import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import firebase from "../../firebase/firebaseConfig";
import axios from "axios";
import { IoSendSharp } from "react-icons/io5";
import { FaMicrophone } from "react-icons/fa";
import ChatMessage from "../ChatMessage";

const TeacherBotItalian = () => {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([
    {
      user: "gpt",
      message: "Ciao. Io Sono Nathan, il tuo insegnante di italiano. Come posso aiutarti oggi?",
    },
  ]);
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const inputRef = useRef(null);
  const [isCooldown, setIsCooldown] = useState(false);

  // Initialize Web Speech API for speech recognition
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

  // Start and stop listening for audio input
  const startListening = () => {
    if (recognition) recognition.start();
    setListening(true);
  };

  const stopListening = () => {
    if (recognition) recognition.stop();
    setListening(false);
  };

  const handleClick = () => {
    if (isCooldown) return; // Prevent further clicks if in cooldown

    if (listening) {
      stopListening();
      handleAudio();
    } else {
      startListening();
    }

    setListening(!listening);
    setIsCooldown(true); // Start cooldown

    // Set a timeout to reset cooldown after 2 seconds
    setTimeout(() => {
      setIsCooldown(false);
    }, 3500);
  };

  // Load messages from Firebase on component mount
  // useEffect(() => {
  //   const userUID = firebase.auth().currentUser?.uid;

  //   if (userUID) {
  //     const userMessagesRef = firebase
  //       .database()
  //       .ref(`users/${userUID}italian_messages`);
  //     const handleValueChange = (snapshot) => {
  //       const messages = snapshot.val();
  //       const chatHistory = messages ? Object.values(messages) : [];
  //       // Only update chatLog if it is empty, to avoid overwriting or duplicating messages
  //       if (chatLog.length === 0) {
  //         setChatLog(chatHistory);
  //       }
  //     };

  //     userMessagesRef.on("value", handleValueChange);

  //     return () => userMessagesRef.off("value", handleValueChange);
  //   }
  // }, []);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  // Auto-grow textarea to fit content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Send message on Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Scroll to bottom when chatLog updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Save message to Firebase
  const saveMessageToFirebase = (uid, message, sender) => {
    const userMessagesRef = firebase.database().ref(`users/${uid}/messages/italian`);
    const newMessageRef = userMessagesRef.push();
    newMessageRef.set({
      sender: sender,
      message: message,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (input.trim() && !isSubmitting) {
      setIsSubmitting(true);
      const chatLogNew = [...chatLog, { sender: "me", message: input }];
      setInput("");
      setChatLog(chatLogNew);

      const userUID = firebase.auth().currentUser?.uid;

      // if (userUID) saveMessageToFirebase(userUID, input, "me"); // FIRST CALL: User message

      
      try {
        const response = await fetch( "https://www.nathanai.com.br/api/chatgpt/italian", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: input, userUID }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const gptMessage = data.message;

        setChatLog([...chatLogNew, { user: "gpt", message: gptMessage }]);

        if (userUID) saveMessageToFirebase(userUID, gptMessage, "gpt"); // SECOND CALL: AI response
      } catch (error) {
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Handle audio message submission
  const handleAudio = async () => {
    if (transcript.trim()) {
      const chatLogNew = [...chatLog, { sender: "me", message: transcript }];
      setInput("");
      setChatLog(chatLogNew);

      const userUID = firebase.auth().currentUser?.uid;

      if (userUID) saveMessageToFirebase(userUID, transcript, "me");

      try {
        const response = await axios.post(
          "https://www.nathanai.com.br/api/chatgpt/audio/esp",
          {
            message: transcript,
            userUID,
          }
        );

        const { message, audio } = response.data;

        setChatLog([...chatLogNew, { user: "gpt", message }]);

        if (userUID) saveMessageToFirebase(userUID, message, "gpt");

        // Play the audio
        const audioElement = new Audio(audio); // Ensure audio is the base64 string
        audioElement.play();
        setTranscript(""); // Clear the transcript after processing
      } catch (error) {
        console.error("Error during audio processing:", error);
      }
    }
  };

  return (
    <div className="App">
      <section className="chatbox ">
        <div className="chat-log ">
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
              placeholder="Escreva sua mensagem aqui..."
              maxLength="100"
              rows="1"
              style={{ resize: "none", overflow: "hidden" }}
            />{" "}
          </form>
          <div className="chat-send-button-div">
            <button onClick={handleSubmit} className="chat-send-button">
              <IoSendSharp style={{ color: "white" }} />
            </button>
            {/* <button onClick={handleClick} className="chat-send-button">
              <FaMicrophone style={{ color: listening ? "red" : "white" }} />
            </button>
            <div
              className="transcript"
              style={{ position: "absolute", left: "-9999px" }} // Move o conteúdo para fora da tela
              dangerouslySetInnerHTML={{ __html: transcript }}
            /> */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeacherBotItalian;
