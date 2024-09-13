const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai'); // Updated import for the latest SDK
const getDatabase = require("../firebase/firebaseConfig");

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your OpenAI API key is in the .env file
});

// Function to retrieve user messages from Firebase
const getUserMessagesFromFirebase = async (userUID) => {
  const db = getDatabase(); 
  const userMessagesRef = db.ref(`users/${userUID}/messages`);
  
  const snapshot = await userMessagesRef.once("value");
  const messages = snapshot.val();
  
  if (!messages) return [];
  
  return Object.values(messages).map((msg) => ({
    role: msg.sender === "me" ? "user" : "assistant",
    content: msg.message,
  }));
};

// Endpoint to send message to OpenAI
router.post('/', async (req, res) => {
  const { userUID, message } = req.body;

  try {
    // Get user messages from Firebase
    const userMessages = await getUserMessagesFromFirebase(userUID);

    // Add new message to the chat history
    userMessages.push({ role: "user", content: message });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: userMessages,
      max_tokens: 100,
      temperature: 0.7,
    });

    const assistantMessage = completion.choices[0].message.content;

    // Store assistant's response in Firebase
    const db = getDatabase();
    const userMessagesRef = db.ref(`users/${userUID}/messages`);
    await userMessagesRef.push({
      sender: "assistant",
      message: assistantMessage,
      timestamp: Date.now(),
    });

    res.json({ message: assistantMessage });
  } catch (error) {
    console.error("Error during OpenAI API request:", error);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
});

module.exports = router;
