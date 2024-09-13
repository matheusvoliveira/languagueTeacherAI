// import React, { useState, useEffect } from "react";
// import firebase from "../firebase/firebaseConfig"; // Importe sua configuração do Firebase
// import axios from "axios";

// const ChatComponent = () => {
//   const [input, setInput] = useState("");
//   const [chatLog, setChatLog] = useState([]);
//   const [transcript, setTranscript] = useState(""); // Para mensagens de áudio

//   useEffect(() => {
//     const userUID = firebase.auth().currentUser?.uid;

//     if (userUID) {
//       const userMessagesRef = firebase.database().ref(`users/${userUID}/messages`);
//       userMessagesRef.on("value", (snapshot) => {
//         const messages = snapshot.val();
//         const chatHistory = messages ? Object.values(messages) : [];
//         setChatLog(chatHistory);
//       });
//     }
//   }, []);

//   const saveMessageToFirebase = (uid, message, sender) => {
//     const userMessagesRef = firebase.database().ref(`users/${uid}/messages`);
//     const newMessageRef = userMessagesRef.push();
//     newMessageRef.set({
//       sender: sender,
//       message: message,
//       timestamp: firebase.database.ServerValue.TIMESTAMP,
//     });
//   };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     if (input.trim()) {
//       const chatLogNew = [...chatLog, { sender: "me", message: input }];
//       setInput("");
//       setChatLog(chatLogNew);
  
//       const userUID = firebase.auth().currentUser?.uid;
  
//       // Salvar a mensagem no Firebase
//       if (userUID) {
//         saveMessageToFirebase(userUID, input, "me");
//       }
  
//       try {
//         const response = await fetch("http://localhost:3001/chatGpt", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ message: input, userUID }), // Include the userUID
//         });
  
//         if (!response.ok) {
//           throw new Error("An error occurred while processing the request.");
//         }
  
//         const data = await response.json();
//         const gptMessage = data.message;
//         setChatLog([...chatLogNew, { sender: "gpt", message: gptMessage }]);
  
//         if (userUID) {
//           saveMessageToFirebase(userUID, gptMessage, "gpt");
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     }
//   };
  

//   const handleAudio = async () => {
//     const chatLogNew = [...chatLog, { sender: "me", message: transcript }];
//     setInput("");
//     setChatLog(chatLogNew);

//     const userUID = firebase.auth().currentUser?.uid;

//     // Salvar o áudio transcrito no Firebase
//     if (userUID) {
//       saveMessageToFirebase(userUID, transcript, "me");
//     }

//     try {
//       const response = await axios.post("http://localhost:3001/chatGpt/audio", { message: transcript }, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       const { message, audio } = response.data;

//       setChatLog([...chatLogNew, { sender: "gpt", message: message }]);

//       // Salvar a resposta do GPT no Firebase
//       if (userUID) {
//         saveMessageToFirebase(userUID, message, "gpt");
//       }

//       const audioElement = new Audio(audio);
//       audioElement.play();
//     } catch (error) {
//       console.error("Error during audio processing:", error);
//     }
//   };

//   return (
//     <div>
//       <div className="chat-log">
//         {chatLog.map((entry, index) => (
//           <div key={index} className={`message ${entry.sender}`}>
//             <p>{entry.message}</p>
//           </div>
//         ))}
//       </div>
//       <form onSubmit={handleSubmit}>
//         <textarea
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type your message here"
//         />
//         <button type="submit">Send</button>
//       </form>
//       <button onClick={handleAudio}>Send Audio</button>
//     </div>
//   );
// };

// export default ChatComponent;

// import React, { useState, useEffect } from "react";
// import firebase from "../firebase/firebaseConfig"; // Importe sua configuração do Firebase
// import axios from "axios";

// const ChatComponent = () => {
//   const [input, setInput] = useState("");
//   const [chatLog, setChatLog] = useState([]);
//   const [transcript, setTranscript] = useState(""); // Para mensagens de áudio
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     const userUID = firebase.auth().currentUser?.uid;

//     if (userUID) {
//       const userMessagesRef = firebase.database().ref(`users/${userUID}/messages`);
//       const handleValueChange = (snapshot) => {
//         const messages = snapshot.val();
//         const chatHistory = messages ? Object.values(messages) : [];
//         setChatLog(chatHistory);
//       };
//       userMessagesRef.on("value", handleValueChange);

//       // Cleanup listener on component unmount
//       return () => {
//         userMessagesRef.off("value", handleValueChange);
//       };
//     }
//   }, []);

//   const saveMessageToFirebase = (uid, message, sender) => {
//     const userMessagesRef = firebase.database().ref(`users/${uid}/messages`);
//     const newMessageRef = userMessagesRef.push();
//     newMessageRef.set({
//       sender: sender,
//       message: message,
//       timestamp: firebase.database.ServerValue.TIMESTAMP,
//     });
//   };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (input.trim() && !isSubmitting) {
  //     setIsSubmitting(true); // Prevent multiple submissions
  //     const chatLogNew = [...chatLog, { sender: "me", message: input }];
  //     setInput("");
  //     setChatLog(chatLogNew);

  //     const userUID = firebase.auth().currentUser?.uid;

  //     // Save the message to Firebase
  //     if (userUID) {
  //       saveMessageToFirebase(userUID, input, "me");
  //     }

  //     try {
  //       const response = await fetch("http://localhost:3001/chatGpt", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ message: input, userUID }), // Include the userUID
  //       });

  //       if (!response.ok) {
  //         throw new Error("An error occurred while processing the request.");
  //       }

  //       const data = await response.json();
  //       const gptMessage = data.message;

  //       // Update chat log with GPT message
  //       setChatLog([...chatLogNew, { sender: "gpt", message: gptMessage }]);

  //       // Save GPT's response to Firebase
  //       if (userUID) {
  //         saveMessageToFirebase(userUID, gptMessage, "gpt");
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     } finally {
  //       setIsSubmitting(false); // Reset the submitting state
  //     }
  //   }
  // };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     if (input.trim()) {
//       const chatLogNew = [...chatLog, { sender: "me", message: input }];
//       setInput("");
//       setChatLog(chatLogNew);
  
//       const userUID = firebase.auth().currentUser?.uid;
  
//       // Save the user's message to Firebase
//       if (userUID) {
//         saveMessageToFirebase(userUID, input, "me");
//       }
  
//       try {
//         const response = await fetch("http://localhost:3001/chatGpt", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ message: input, userUID }), // Include the userUID
//         });
  
//         if (!response.ok) {
//           throw new Error("An error occurred while processing the request.");
//         }
  
//         const data = await response.json();
//         const gptMessage = data.message;
  
//         // Update chat log with GPT message
//         setChatLog([...chatLogNew, { sender: "gpt", message: gptMessage }]);
  
//         console.log("Saving GPT message to Firebase:", gptMessage); // Log the message being saved
  
//         // Save GPT's response to Firebase
//         if (userUID) {
//           saveMessageToFirebase(userUID, gptMessage, "gpt");
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     }
//   };
  

//   const handleAudio = async () => {
//     if (transcript.trim()) {
//       const chatLogNew = [...chatLog, { sender: "me", message: transcript }];
//       setInput("");
//       setChatLog(chatLogNew);

//       const userUID = firebase.auth().currentUser?.uid;

//       // Save transcribed audio message to Firebase
//       if (userUID) {
//         saveMessageToFirebase(userUID, transcript, "me");
//       }

//       try {
//         const response = await axios.post("http://localhost:3001/chatGpt/audio", { message: transcript }, {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         const { message, audio } = response.data;

//         setChatLog([...chatLogNew, { sender: "gpt", message: message }]);

//         // Save GPT's response to Firebase
//         if (userUID) {
//           saveMessageToFirebase(userUID, message, "gpt");
//         }

//         const audioElement = new Audio(audio);
//         audioElement.play();
//       } catch (error) {
//         console.error("Error during audio processing:", error);
//       }
//     }
//   };

//   return (
//     <div>
//       <div className="chat-log">
//         {chatLog.map((entry, index) => (
//           <div key={index} className={`message ${entry.sender}`}>
//             <p>{entry.message}</p>
//           </div>
//         ))}
//       </div>
//       <form onSubmit={handleSubmit}>
//         <textarea
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type your message here"
//         />
//         <button type="submit">Send</button>
//       </form>
//       <button onClick={handleAudio}>Send Audio</button>
//     </div>
//   );
// };

// export default ChatComponent;



import "./App.css"
import React, { useState, useEffect } from "react";
import firebase from "../firebase/firebaseConfig"; // Import your Firebase configuration
import axios from "axios";

const ChatComponent = () => {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [transcript, setTranscript] = useState(""); // For audio messages
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const userUID = firebase.auth().currentUser?.uid;

    if (userUID) {
      const userMessagesRef = firebase.database().ref(`users/${userUID}/messages`);
      const handleValueChange = (snapshot) => {
        const messages = snapshot.val();
        const chatHistory = messages ? Object.values(messages) : [];
        setChatLog(chatHistory);
      };
      userMessagesRef.on("value", handleValueChange);

      // Cleanup listener on component unmount
      return () => {
        userMessagesRef.off("value", handleValueChange);
      };
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

    if (input.trim() && !isSubmitting) {
      setIsSubmitting(true); // Prevent multiple submissions
      const chatLogNew = [...chatLog, { sender: "me", message: input }];
      setInput("");
      setChatLog(chatLogNew);

      const userUID = firebase.auth().currentUser?.uid;

      // Save the user's message to Firebase
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

        // Update chat log with GPT message
        setChatLog([...chatLogNew, { sender: "gpt", message: gptMessage }]);

        console.log("Saving GPT message to Firebase:", gptMessage); // Log the message being saved

        // Save GPT's response to Firebase
        if (userUID) {
          saveMessageToFirebase(userUID, gptMessage, "gpt");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsSubmitting(false); // Reset the submitting state
      }
    }
  };

  const handleAudio = async () => {
    if (transcript.trim()) {
      const chatLogNew = [...chatLog, { sender: "me", message: transcript }];
      setInput("");
      setChatLog(chatLogNew);

      const userUID = firebase.auth().currentUser?.uid;

      // Save transcribed audio message to Firebase
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

        // Save GPT's response to Firebase
        if (userUID) {
          saveMessageToFirebase(userUID, message, "gpt");
        }

        const audioElement = new Audio(audio);
        audioElement.play();
      } catch (error) {
        console.error("Error during audio processing:", error);
      }
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
      <form onSubmit={handleSubmit} className="message-form">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here"
          className="message-input"
        />
        <button type="submit" className="send-button">Send</button>
      </form>
      <button onClick={handleAudio} className="send-audio-button">Send Audio</button>
    </div>
  );
};

export default ChatComponent;
