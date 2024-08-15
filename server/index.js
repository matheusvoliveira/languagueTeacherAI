require("dotenv").config();
const express = require("express");
const OpenAI = require("openai");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // Uncomment if you use cookieParser
const { validateToken } = require("./JWT"); // Uncomment if you use validateToken

const app = express(); // Declare app here

app.use(cookieParser());
app.use(express.json());
app.use(cors());

const db = require("./models");

const openai = new OpenAI({
  organization: process.env.ORGANIZATION_ID,
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/", async (req, res) => {
  const { message } = req.body;

  const systemMessage = {
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

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [systemMessage, { role: "user", content: message }],
      max_tokens: 100,
      temperature: 0.7,
    });

    if (completion && completion.choices && completion.choices.length > 0) {
      res.json({
        message: completion.choices[0].message.content.trim(),
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

// Auth routes
const registerRouter = require("./routes/auth/register");
app.use("/register", registerRouter);
const loginRouter = require("./routes/auth/login");
app.use("/login", loginRouter);
const profileRouter = require("./routes/auth/profile");
app.use("/profile", validateToken, profileRouter); // Protected

db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log("Server running on port 3001");
  });
});
