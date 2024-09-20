

import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import firebase from "../firebase/firebaseConfig";
import axios from "axios";
import { IoSendSharp } from "react-icons/io5";
import { FaMicrophone } from "react-icons/fa";
import ChatMessage from "./ChatMessage";

const TeacherBot = () => {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([
    {
      user: "gpt",
      message: "I'm Nathan, your English teacher. How can I help you today?",
    },
  ]);
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const inputRef = useRef(null);

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
    if (listening) {
      stopListening();
      handleAudio();
    } else {
      startListening();
    }
    setListening(!listening);
  };

  // Load messages from Firebase on component mount
  useEffect(() => {
    const userUID = firebase.auth().currentUser?.uid;
  
    if (userUID) {
      const userMessagesRef = firebase.database().ref(`users/${userUID}/messages`);
      const handleValueChange = (snapshot) => {
        const messages = snapshot.val();
        const chatHistory = messages ? Object.values(messages) : [];
        // Only update chatLog if it is empty, to avoid overwriting or duplicating messages
        if (chatLog.length === 0) {
          setChatLog(chatHistory);
        }
      };
  
      userMessagesRef.on("value", handleValueChange);
  
      return () => userMessagesRef.off("value", handleValueChange);
    }
  }, []);
  
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
    const userMessagesRef = firebase.database().ref(`users/${uid}/messages`);
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
  
      if (userUID) saveMessageToFirebase(userUID, input, "me");  // FIRST CALL: User message
  
      try {
        const response = await fetch("http://localhost/api/chatgpt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: input, userUID }),
        });
  
        if (!response.ok) throw new Error("Error processing request.");
  
        const data = await response.json();
        const gptMessage = data.message;
  
        setChatLog([...chatLogNew, { user: "gpt", message: gptMessage }]);
  
        if (userUID) saveMessageToFirebase(userUID, gptMessage, "gpt");  // SECOND CALL: AI response
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
        const response = await axios.post("https://www.nathanai.com.br/api/chatgpt/audio", {
          message: transcript,
          userUID,
        });
  
        const { message, audio } = response.data;
  
        setChatLog([...chatLogNew, { user: "gpt", message }]);
  
        if (userUID) saveMessageToFirebase(userUID, message, "gpt");
  
        // Play the audio
        const audioElement = new Audio(audio);  // Ensure audio is the base64 string
        audioElement.play();
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
            />
            <div className="chat-send-button-div">
              <button type="submit" className="chat-send-button">
                <IoSendSharp style={{ color: "white" }} />
              </button>
            </div>
          </form>
          <button onClick={handleClick} className="chat-send-button">
            <FaMicrophone style={{ color: listening ? "red" : "white" }} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default TeacherBot;
