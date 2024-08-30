const express = require("express");
const router = express.Router();
require("dotenv").config();
const OpenAI = require("openai");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const upload = multer({ dest: path.join(__dirname, "../uploads") });

const openai = new OpenAI({
  organization: process.env.ORGANIZATION_ID,
  apiKey: process.env.OPENAI_API_KEY,
});


const messageHistory = [];

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
    Answer always in English. Answer me with maximum 98 tokens.
  `,
};

router.post("/", async (req, res) => {
  const { message } = req.body;

  messageHistory.push({ role: "user", content: message });

  if (messageHistory.length > 10) {
    messageHistory.shift();
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [systemMessage, ...messageHistory],
      max_tokens: 100,
      temperature: 0.7,
    });

    if (completion && completion.choices && completion.choices.length > 0) {
      const responseMessage = completion.choices[0].message.content.trim();

      messageHistory.push({ role: "assistant", content: responseMessage });

      res.json({
        message: responseMessage,
      });
    } else {
      res.status(500).json({ error: "Unexpected completion structure." });
    }
  } catch (error) {
    console.error("Error during OpenAI API request:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

router.post("/audio", upload.single("audio"), async (req, res) => {
  const audioFile = req.file;
  if (!audioFile) {
    return res.status(400).json({ error: "No audio file uploaded" });
  }
  const audioPath = path.join(__dirname, "../uploads", audioFile.filename);

  try {
    // const audioPath = path.resolve(audioFile.path);
    const audioPath = path.join(__dirname, "../uploads", audioFile.filename);

    const transcriptionResponse = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        file: fs.createReadStream(audioPath),
        model: "whisper-1", // Modelo da OpenAI para transcrição de áudio
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const transcribedText = transcriptionResponse.data.text;

    messageHistory.push({ role: "user", content: transcribedText });

    if (messageHistory.length > 10) {
      messageHistory.shift();
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [systemMessage, ...messageHistory],
      max_tokens: 100,
      temperature: 0.7,
    });

    if (completion && completion.choices && completion.choices.length > 0) {
      const responseMessage = completion.choices[0].message.content.trim();

      messageHistory.push({ role: "assistant", content: responseMessage });

      res.json({
        message: responseMessage,
      });
    } else {
      res.status(500).json({ error: "Unexpected completion structure." });
    }
  } catch (error) {
    console.error(
      "Error during processing request:",
      error.response ? error.response.data : error.message
    );

    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  } finally {
    fs.unlink(audioPath, (err) => {
      if (err) console.error("Error deleting audio file:", err);
    });
  }
});

router.post("/teste", async (req, res) => {
  let text = req.body.text

  // try {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    // messages: [systemMessage, ...messageHistory],
    messages: [{ role: "system", content: text }],
    max_tokens: 100,
    temperature: 0.7,
  });

  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "echo",
    input: completion.choices[0].message.content,
  });
  const buffer = Buffer.from(await mp3.arrayBuffer());

  res.send(buffer)
});

router.post('/teste2', (req, res) => {
  let text = req.body.text

})

module.exports = router;
