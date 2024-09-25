require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const moment = require("moment/moment");
const https = require('https');
const fs = require('fs');


const app = express();

// Configuração CORS
const allowedOrigins = ["http://nathanai.com.br", "http://www.nathanai.com.br", "http://147.79.107.2","http://localhost:3000"];

app.use(cors({
  origin: '*', // Allow all origins for testing
}));


// app.use(cors())
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//   })
// );

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
      success_url: "https://www.nathanai.com.br/api/success",
      cancel_url: "https://www.nathanai.com.br//cancel",
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

app.get("/api/teste", async (req, res) => {
  res.json({ message: 'Está funcionando o teste' }); 
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
app.get("/api/chatgpt", async (req, res) => {
  res.json({ message: 'Está funcionando o chatgpt' }); 
});

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/www.nathanai.com.br/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/www.nathanai.com.br/fullchain.pem'),
};

app.listen(8800, () => {
  console.log(`Server is running on http://0.0.0.0:3001`);
});



// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const admin = require("firebase-admin");
// const serviceAccount = require("./serviceAccountKey.json");
// const moment = require("moment/moment");
// const https = require('https');
// const fs = require('fs');

// const app = express();

// // SSL Certificates
// const options = {
//   key: fs.readFileSync('/etc/letsencrypt/live/www.nathanai.com.br/privkey.pem'),
//   cert: fs.readFileSync('/etc/letsencrypt/live/www.nathanai.com.br/fullchain.pem'),
// };

// // CORS Configuration
// const allowedOrigins = [
//   "http://nathanai.com.br",
//   "http://www.nathanai.com.br",
//   "http://147.79.107.2",
//   "http://localhost:3000"
// ];

// app.use(cors({
//   origin: allowedOrigins, // Allow specified origins
// }));

// app.use(bodyParser.json());
// app.use(express.json());

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://nathan-stripe-default-rtdb.firebaseio.com",
// });

// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// const [monthly, quarterly] = [
//   "price_1PoRsmIqJPCcmdCBlSokDS0G", // Monthly plan ID
//   "price_1PoUaFIqJPCcmdCBA5fAvZOv", // Quarterly plan ID
// ];

// // Function to create a Stripe session
// const stripeSession = async (plan) => {
//   try {
//     const session = await stripe.checkout.sessions.create({
//       mode: "subscription",
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price: plan,
//           quantity: 1,
//         },
//       ],
//       success_url: "https://www.nathanai.com.br/api/success",
//       cancel_url: "https://www.nathanai.com.br/cancel",
//     });
//     return session;
//   } catch (e) {
//     console.error("Error creating Stripe session:", e);
//     throw e; // Re-throws the error to be caught in the route handler
//   }
// };

// // Route to create a subscription checkout session
// app.post("/api/v1/create-subscription-checkout-session", async (req, res) => {
//   const { plan, customerId } = req.body;
//   let planId = null;

//   console.log("Received plan:", plan);

//   if (plan === 29.99) planId = monthly;
//   else if (plan === 79.99) planId = quarterly;

//   if (!planId) {
//     return res.status(400).json({ error: "Invalid plan" });
//   }

//   try {
//     const session = await stripeSession(planId);
//     const user = await admin.auth().getUser(customerId);

//     await admin.database().ref("users").child(user.uid).update({
//       subscription: {
//         sessionId: session.id,
//       },
//     });
//     return res.json({ session });
//   } catch (error) {
//     console.error("Error in create-subscription-checkout-session:", error);
//     return res.status(500).json({ error: error.message });
//   }
// });

// // Test route
// app.get("/api/teste", async (req, res) => {
//   res.json({ message: 'Está funcionando o teste' }); 
// });

// // Payment success route
// app.post("/api/v1/payment-success", async (req, res) => {
//   const { sessionId, firebaseId } = req.body;

//   try {
//     const session = await stripe.checkout.sessions.retrieve(sessionId);

//     if (session.payment_status === "paid") {
//       const subscriptionId = session.subscription;

//       try {
//         const subscription = await stripe.subscriptions.retrieve(subscriptionId);
//         const user = await admin.auth().getUser(firebaseId);
//         const planId = subscription.plan.id;
//         let planType = "";

//         if (subscription.plan.amount === 29.99) {
//           planType = "monthly";
//         } else if (subscription.plan.amount === 79.99) {
//           planType = "quarterly";
//         }

//         const startDate = moment.unix(subscription.current_period_start).format("DD-MM-YYYY");
//         const endDate = moment.unix(subscription.current_period_end).format("DD-MM-YYYY");
//         const durationInSeconds = subscription.current_period_end - subscription.current_period_start;
//         const durationInDays = moment.duration(durationInSeconds, "seconds").asDays();

//         await admin.database().ref("users").child(user.uid).update({
//           subscription: {
//             sessionId: null,
//             planId: planId,
//             planType: planType,
//             planStartDate: startDate,
//             planEndDate: endDate,
//             planDuration: durationInDays,
//           },
//         });

//         return res.json({ message: "Payment successful" });
//       } catch (error) {
//         console.error("Error retrieving subscription:", error);
//         return res.status(500).json({ message: "Error retrieving subscription" });
//       }
//     } else {
//       return res.json({ message: "Payment failed" });
//     }
//   } catch (error) {
//     console.error("Error retrieving session", error);
//     return res.status(500).send(error);
//   }
// });

// // Import and use the ChatGPT router
// const db = require("./models");
// const chatGptRouter = require("./routes/chatGpt");

// app.use("/api/chatgpt", chatGptRouter);
// app.get("/api/chatgpt", async (req, res) => {
//   res.json({ message: 'Está funcionando o chatgpt' }); 
// });

// // Create HTTPS server
// const server = https.createServer(options, app);

// server.listen(8800, () => {
//   console.log(`Server is running on https://0.0.0.0:8800`);
// });
