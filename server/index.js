require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const moment = require("moment/moment");

const app = express();

// Configuração CORS
const allowedOrigins = ["http://localhost:3000", "http://localhost:5173", "http://192.168.10.114:3000"];

app.use(cors())
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

// Outras configurações e middlewares
app.use(bodyParser.json());
app.use(express.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nathan-stripe-default-rtdb.firebaseio.com",
});

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const [monthly, quarterly] = [
  "price_1PoRsmIqJPCcmdCBlSokDS0G", // ID do preço para plano mensal
  "price_1PoUaFIqJPCcmdCBA5fAvZOv", // ID do preço para plano trimestral
];

// Função para criar uma sessão Stripe
const stripeSession = async (plan) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: plan,
          quantity: 1,
        },
      ],
      success_url: "http://147.79.107.2/api/success",
      cancel_url: "http://147.79.107.2/api/cancel",
    });
    return session;
  } catch (e) {
    console.error("Error creating Stripe session:", e);
    throw e; // Re-throws the error to be caught in the route handler
  }
};

// Rota para criar sessão de checkout
app.post("/api/v1/create-subscription-checkout-session", async (req, res) => {
  const { plan, customerId } = req.body;
  let planId = null;

  console.log("Received plan:", plan);

  if (plan === 29.99) planId = monthly;
  else if (plan === 79.99) planId = quarterly;

  if (!planId) {
    return res.status(400).json({ error: "Invalid plan" });
  }

  try {
    const session = await stripeSession(planId);
    const user = await admin.auth().getUser(customerId);

    await admin
      .database()
      .ref("users")
      .child(user.uid)
      .update({
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

// Rota de sucesso de pagamento
app.post("/api/v1/payment-success", async (req, res) => {
  const { sessionId, firebaseId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const subscriptionId = session.subscription;

      try {
        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId
        );
        const user = await admin.auth().getUser(firebaseId);
        const planId = subscription.plan.id;
        let planType = ""; // Correção: Declarando planType com let

        if (subscription.plan.amount === 29.99) {
          planType = "monthly";
        } else if (subscription.plan.amount === 79.99) {
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

        await admin
          .database()
          .ref("users")
          .child(user.uid)
          .update({
            subscription: {
              sessionId: null,
              planId: planId,
              planType: planType,
              planStartDate: startDate,
              planEndDate: endDate,
              planDuration: durationInDays,
            },
          });

        return res.json({ message: "Payment successful" });
      } catch (error) {
        console.error("Error retrieving subscription:", error);
        return res
          .status(500)
          .json({ message: "Error retrieving subscription" });
      }
    } else {
      return res.json({ message: "Payment failed" });
    }
  } catch (error) {
    console.error("Error retrieving session", error);
    return res.status(500).send(error);
  }
});

// Importa e usa o roteador do ChatGPT
const db = require("./models");
const chatGptRouter = require("./routes/chatGpt");

app.use("/api/chatgpt", chatGptRouter);

// // Sincroniza o banco de dados e inicia o servidor
// db.sequelize.sync().then(() => {
//   app.listen(3001, () => {
//     console.log("Server running on port 3001");
//   });
// });

// app.use(express.static('public')); // Serve static files from the 'public' directory


app.listen(8800, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:3001`);
});
