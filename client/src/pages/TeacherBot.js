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
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const inputRef = useRef(null);
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");

  // const handleAudio = async () => {
  //   const chatLogNew = [...chatLog, { user: "me", message: transcript }];
  //   setInput("");
  //   setChatLog(chatLogNew);

  //   try {
  //     // Ensure `transcript` is defined and contains the message to send
  //     if (!transcript) {
  //       throw new Error("No transcript provided");
  //     }

  //     // Send a POST request with the transcript text
  //     const response = await axios.post(
  //       "http://localhost:3001/chatGpt/teste",
  //       { message: transcript }, // Correctly passing transcript
  //       {
  //         responseType: "arraybuffer", // Handle binary data
  //       }
  //     );

  //     // Convert response data (binary) to a blob
  //     const audioBlob = new Blob([response.data], { type: "audio/mpeg" });

  //     // Create a URL for the blob to play the audio
  //     const audioUrl = URL.createObjectURL(audioBlob);
  //     const { responseMessage } = response.data;
  //     // Update chat log with new audio message
  //     setChatLog([...chatLogNew, { user: "gpt", message: responseMessage  }]);

  //     // Optionally, auto-play the audio
  //     const audio = new Audio(audioUrl);
  //     audio.play();
  //   } catch (error) {
  //     console.error("Error during audio processing:", error);
  //   }
  // };
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
        "http://localhost:3001/chatGpt/teste",
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
              placeholder="Type your message here"
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
          <div>
            <div>
              {/* <button onClick={startListening} disabled={listening}>
                Iniciar
              </button>
              <button
                onClick={() => {
                  stopListening();
                  handleAudio();
                }}
                disabled={!listening}
              >
                Parar
              </button> */}
              {/* <button onClick={handleClick} className="chat-send-button">
                {listening ? <FaMicrophone/> : <FaMicrophone/>}
      
              </button> */}
              <button onClick={handleClick} className="chat-send-button">
                <FaMicrophone style={{ color: listening ? "red" : "white" }} />
              </button>
              <p>
                {listening
                  ? "Ouvindo..."
                  : "Clique em Iniciar para começar a ouvir"}
              </p>
              <p>Transcrição: {transcript}</p>
              {audioUrl && <audio src={audioUrl} autoPlay />}
            </div>
          </div>
        </div>
      </section>
    
    </div>
  );
}

export default TeacherBot;

// import "./App.css";
// import { useState, useRef, useEffect } from "react";
// import ChatMessage from "./ChatMessage";
// import { IoSendSharp } from "react-icons/io5";
// import { FaMicrophone } from "react-icons/fa";
// import axios from "axios";

// function TeacherBot() {
//   const [input, setInput] = useState("");
//   const [chatLog, setChatLog] = useState([
//     {
//       user: "gpt",
//       message: "I'm Nathan, your English teacher. How can I help you today?",
//     },
//   ]);
//   const [listening, setListening] = useState(false);
//   const [recognition, setRecognition] = useState(null);
//   const [transcript, setTranscript] = useState("");
//   const [audioUrl, setAudioUrl] = useState("");
//   const messagesEndRef = useRef(null);
//   const textareaRef = useRef(null);
//   const inputRef = useRef(null);

//   const handleAudio = async () => {
//     try {
//       const response = await axios.post(
//         "http://localhost:3001/chatGpt/teste",
//         { text: transcript },
//         {
//           responseType: "blob",
//         }
//       );
//       const url = window.URL.createObjectURL(response.data);
//       setAudioUrl(url);
//     } catch (error) {
//       console.error("Error processing audio:", error);
//     }
//   };

//   useEffect(() => {
//     if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
//       const SpeechRecognition =
//         window.SpeechRecognition || window.webkitSpeechRecognition;
//       const recognitionInstance = new SpeechRecognition();

//       recognitionInstance.continuous = true;
//       recognitionInstance.interimResults = false;
//       recognitionInstance.lang = "en-US";

//       recognitionInstance.onresult = (event) => {
//         const transcriptArray = Array.from(event.results)
//           .map((result) => result[0].transcript)
//           .join("");
//         setTranscript(transcriptArray);
//       };

//       recognitionInstance.onend = () => {
//         setListening(false);
//       };

//       recognitionInstance.onerror = (event) => {
//         console.error("Recognition error:", event.error);
//         setListening(false);
//       };

//       setRecognition(recognitionInstance);
//     } else {
//       alert("Navegador não suporta Web Speech API");
//     }
//   }, []);

//   const startListening = () => {
//     if (recognition) {
//       recognition.start();
//       setListening(true);
//     }
//   };

//   const stopListening = () => {
//     if (recognition) {
//       recognition.stop();
//       setListening(false);
//       handleAudio(); // Process audio once stopped
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (input.trim()) {
//       const chatLogNew = [...chatLog, { user: "me", message: input }];
//       setInput("");
//       setChatLog(chatLogNew);

//       try {
//         const response = await fetch("http://localhost:3001/chatGpt", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             message: input,
//           }),
//         });

//         if (!response.ok) {
//           throw new Error("An error occurred while processing the request.");
//         }

//         const data = await response.json();
//         setChatLog([...chatLogNew, { user: "gpt", message: data.message }]);
//       } catch (error) {
//         console.error(error);
//       }
//     }
//   };

//   const handleChange = (e) => {
//     setInput(e.target.value);
//   };

//   useEffect(() => {
//     if (textareaRef.current) {
//       textareaRef.current.style.height = "auto";
//       textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
//     }
//   }, [input]);

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit(e);
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [chatLog]);

//   useEffect(() => {
//     inputRef.current?.focus();
//   }, []);

//   return (
//     <div className="App">
//       <section className="chatbox">
//         <div className="chat-log">
//           {chatLog.map((message, index) => (
//             <ChatMessage key={index} message={message} />
//           ))}
//           <div ref={messagesEndRef} />
//         </div>

//         <div className="chat-input-holder">
//           <form onSubmit={handleSubmit}>
//             <textarea
//               ref={textareaRef}
//               value={input}
//               onChange={handleChange}
//               onKeyDown={handleKeyDown}
//               className="chat-input-textarea"
//               placeholder="Type your message here"
//               maxLength="100"
//               rows="1"
//               style={{ resize: "none", overflow: "hidden" }}
//             />
//             <div className="chat-send-button-div">
//               <button type="submit" className="chat-send-button">
//                 <IoSendSharp style={{ color: "white" }} />
//               </button>
//             </div>
//           </form>
//           {/* <div>
//             {listening ? (
//               <button
//                 onClick={startListening}
//                 className="chat-send-button"
//               >
//                 Stop <FaMicrophone style={{ color: "red" }} />
//               </button>
//             ) : (
//               <button
//                 onClick={stopListening}
//                 className="chat-send-button"
//               >
//                 <FaMicrophone style={{ color: "white" }} />
//               </button>
//             )}
//             <p>Transcrição: {transcript}</p>
//             {audioUrl && <audio src={audioUrl} autoPlay controls />}
//           </div> */}

//         </div>
//       </section>
//     </div>
//   );
// }

// export default TeacherBot;
