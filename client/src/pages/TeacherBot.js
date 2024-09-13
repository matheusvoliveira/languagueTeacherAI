import React, { useState, useEffect } from "react";
import firebase from "../firebase/firebaseConfig"; // Importe sua configuração do Firebase
import axios from "axios";

const ChatComponent = () => {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [transcript, setTranscript] = useState(""); // Para mensagens de áudio

  useEffect(() => {
    const userUID = firebase.auth().currentUser?.uid;

    if (userUID) {
      const userMessagesRef = firebase.database().ref(`users/${userUID}/messages`);
      userMessagesRef.on("value", (snapshot) => {
        const messages = snapshot.val();
        const chatHistory = messages ? Object.values(messages) : [];
        setChatLog(chatHistory);
      });
    }
  }, []);

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
  
    if (input.trim()) {
      const chatLogNew = [...chatLog, { sender: "me", message: input }];
      setInput("");
      setChatLog(chatLogNew);
  
      const userUID = firebase.auth().currentUser?.uid;
  
      // Salvar a mensagem no Firebase
      if (userUID) {
        saveMessageToFirebase(userUID, input, "me");
      }
  
      try {
        const response = await fetch("http://localhost:3001/chatGpt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: input, userUID }), // Include the userUID
        });
  
        if (!response.ok) {
          throw new Error("An error occurred while processing the request.");
        }
  
        const data = await response.json();
        const gptMessage = data.message;
        setChatLog([...chatLogNew, { sender: "gpt", message: gptMessage }]);
  
        if (userUID) {
          saveMessageToFirebase(userUID, gptMessage, "gpt");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  

  const handleAudio = async () => {
    const chatLogNew = [...chatLog, { sender: "me", message: transcript }];
    setInput("");
    setChatLog(chatLogNew);

    const userUID = firebase.auth().currentUser?.uid;

    // Salvar o áudio transcrito no Firebase
    if (userUID) {
      saveMessageToFirebase(userUID, transcript, "me");
    }

    try {
      const response = await axios.post("http://localhost:3001/chatGpt/audio", { message: transcript }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { message, audio } = response.data;

      setChatLog([...chatLogNew, { sender: "gpt", message: message }]);

      // Salvar a resposta do GPT no Firebase
      if (userUID) {
        saveMessageToFirebase(userUID, message, "gpt");
      }

      const audioElement = new Audio(audio);
      audioElement.play();
    } catch (error) {
      console.error("Error during audio processing:", error);
    }
  };

  return (
    <div>
      <div className="chat-log">
        {chatLog.map((entry, index) => (
          <div key={index} className={`message ${entry.sender}`}>
            <p>{entry.message}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here"
        />
        <button type="submit">Send</button>
      </form>
      <button onClick={handleAudio}>Send Audio</button>
    </div>
  );
};

export default ChatComponent;
