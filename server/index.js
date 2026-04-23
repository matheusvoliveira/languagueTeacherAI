require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const moment = require("moment/moment");
const {
  allowedOrigins,
  clientAppUrl,
  firebaseDatabaseUrl,
  firebaseServiceAccount,
  port,
  stripeMonthlyPriceId,
  stripeQuarterlyPriceId,
} = require("./config/runtime");

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);

app.use(bodyParser.json());
app.use(express.json());

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseServiceAccount),
    databaseURL: firebaseDatabaseUrl,
  });
}

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const [monthly, quarterly] = [
  stripeMonthlyPriceId,
  stripeQuarterlyPriceId,
];

async function stripeSession(plan) {
  try {
    return await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: plan,
          quantity: 1,
        },
      ],
      success_url: `${clientAppUrl}/success`,
      cancel_url: `${clientAppUrl}/cancel`,
    });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    throw error;
  }
}

app.post("/api/v1/create-subscription-checkout-session", async (req, res) => {
  const { plan, customerId } = req.body;
  let planId = null;

  if (plan === 29.99) planId = monthly;
  else if (plan === 79.99) planId = quarterly;

  if (!planId) {
    return res.status(400).json({ error: "Invalid plan" });
  }

  try {
    const session = await stripeSession(planId);
    const user = await admin.auth().getUser(customerId);

    await admin.database().ref("users").child(user.uid).update({
      subscription: {
        sessionId: session.id,
      },
    });

    return res.json({ session });
  } catch (error) {
    console.error("Error in create-subscription-checkout-session:", error);
    return res.status(500).json({ error: error.message });
  }
});

app.get("/api/teste", async (req, res) => {
  res.json({ message: "Está funcionando o teste" });
});

app.post("/api/v1/payment-success", async (req, res) => {
  const { sessionId, firebaseId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.json({ message: "Payment failed" });
    }

    try {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription
      );
      const user = await admin.auth().getUser(firebaseId);
      const planId = subscription.plan.id;
      let planType = "";

      if (planId === monthly) {
        planType = "monthly";
      } else if (planId === quarterly) {
        planType = "quarterly";
      }

      const startDate = moment
        .unix(subscription.current_period_start)
        .format("DD-MM-YYYY");
      const endDate = moment
        .unix(subscription.current_period_end)
        .format("DD-MM-YYYY");
      const durationInSeconds =
        subscription.current_period_end - subscription.current_period_start;
      const durationInDays = moment
        .duration(durationInSeconds, "seconds")
        .asDays();

      await admin.database().ref("users").child(user.uid).update({
        subscription: {
          sessionId: null,
          planId,
          planType,
          planStartDate: startDate,
          planEndDate: endDate,
          planDuration: durationInDays,
        },
      });

      return res.json({ message: "Payment successful" });
    } catch (error) {
      console.error("Error retrieving subscription:", error);
      return res.status(500).json({ message: "Error retrieving subscription" });
    }
  } catch (error) {
    console.error("Error retrieving session", error);
    return res.status(500).send(error);
  }
});

require("./models");
const chatGptRouter = require("./routes/chatGpt");

app.use("/api/chatgpt", chatGptRouter);
app.get("/api/chatgpt", async (req, res) => {
  res.json({ message: "Está funcionando o chatgpt" });
});

app.listen(port, () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});
