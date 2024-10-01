const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai");
const getDatabase = require("../firebase/firebaseConfig");

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to retrieve user messages from Firebase
const getUserMessagesFromFirebase = async (userUID) => {
  const db = getDatabase();
  const userMessagesRef = db.ref(`users/${userUID}/messages`);

  const snapshot = await userMessagesRef.once("value");
  const messages = snapshot.val();

  if (!messages) return [];

  return Object.values(messages)
    .filter((msg) => msg.message && typeof msg.message === "string") // Filter out invalid messages
    .map((msg) => ({
      role: msg.sender === "me" ? "user" : "assistant",
      content: msg.message,
    }));
};

let systemMessage = {
  role: "system",
  content: `
    You are Nathan, a personable and attentive English teacher who interacts with students as if you were a real person.
    You have a friendly and approachable demeanor and engage in conversations as if you were speaking face-to-face.
    You are not only here to answer questions but also to correct any mistakes in grammar, vocabulary, or usage.
    When a student makes a mistake, you should gently correct them by explaining the error and providing the correct usage or phrase.
    Ensure that corrections are made in a constructive manner to help the student learn from their mistakes.
    You share your own opinions and preferences on various topics, making the learning experience engaging and personal.
    Always provide clear, detailed, and understandable explanations, and ask thoughtful questions to prompt deeper thinking.
    Your responses should reflect your personality, making students feel like they are conversing with a knowledgeable and relatable individual. 
    If the person writes in other languages than english ask if he wants the answer in the specif language or english. Answer me with maximum 98 tokens.
  `,
};

// Endpoint to send message to OpenAI
router.post("/", async (req, res) => {
  const { userUID, message } = req.body;

  try {
    // Get user messages from Firebase
    const userMessages = await getUserMessagesFromFirebase(userUID);

    // Add new message to the chat history
    userMessages.push({ role: "user", content: message });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [systemMessage, ...userMessages],
      max_tokens: 100,
      temperature: 1.0,
    });

    const assistantMessage = completion.choices[0].message.content;

    // Debugging log
    // console.log("Assistant's message:", assistantMessage);

    // Store assistant's response in Firebase
    const db = getDatabase();
    const userMessagesRef = db.ref(`users/${userUID}/messages`);

    // Debugging log
    // console.log("Saving message to Firebase...");

    // Ensure we're not duplicating messages
    const snapshot = await userMessagesRef.once("value");
    const currentMessages = snapshot.val();
    const currentMessagesArray = currentMessages
      ? Object.values(currentMessages)
      : [];

    if (!currentMessagesArray.some((msg) => msg.message === assistantMessage)) {
      await userMessagesRef.push({
        sender: "assistant",
        message: assistantMessage,
        timestamp: Date.now(),
      });
    } else {
      console.log("Duplicate message detected; skipping save.");
    }

    res.json({ message: assistantMessage });
  } catch (error) {
    console.error("Error during OpenAI API request:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

router.post("/audio", async (req, res) => {
  const { userUID, message } = req.body;

  try {
    // Get user messages from Firebase
    const userMessages = await getUserMessagesFromFirebase(userUID);
  
    // Add the user's message to chat history
    userMessages.push({ role: "user", content: message });
  
    // Generate completion
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [systemMessage, ...userMessages],
      max_tokens: 100,
      temperature: 0.7,
    });
  
    const responseMessage = completion.choices[0].message.content?.trim();
    
    if (!responseMessage) {
      return res.status(500).json({ error: "Empty response message from API" });
    }
  
    // Add response to chat history
    userMessages.push({ role: "assistant", content: responseMessage });
  
    // Generate audio
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "echo",
      input: responseMessage,
    });
    const buffer = Buffer.from(await mp3.arrayBuffer());
    const audioBase64 = buffer.toString("base64");
  
    // Store assistant's response in Firebase
    const db = getDatabase();
    const userMessagesRef = db.ref(`users/${userUID}/messages`);
  
    // Check for duplicates
    const snapshot = await userMessagesRef.once("value");
    const currentMessages = snapshot.val();
    const currentMessagesArray = currentMessages ? Object.values(currentMessages) : [];
  
    if (!currentMessagesArray.some((msg) => msg.message === responseMessage)) {
      await userMessagesRef.push({
        sender: "assistant",
        message: responseMessage,
        timestamp: Date.now(),
      });
    } else {
      console.log("Duplicate message detected; skipping save.");
    }
  
    // Send both text message and audio data
    res.json({
      message: responseMessage,
      audio: `data:audio/mpeg;base64,${audioBase64}`,
    });
  } catch (error) {
    console.error("Error during processing request:", error.message);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
  
  
});

module.exports = router;
