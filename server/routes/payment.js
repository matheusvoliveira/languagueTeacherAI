const express = require("express");
const router = express.Router();
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  const plan = req.query.plan;

  if (!plan) {
    return res.send("Subscription plan not found");
  }

  let priceId;
  switch (plan.toLowerCase()) {
    case "monthly":
      priceId = "price_1PoRsmIqJPCcmdCBlSokDS0G";
      break;

    case "quarterly":
      priceId = "price_1PoUaFIqJPCcmdCBA5fAvZOv";
      break;

    default:
      return res.send("Subscription plan not found");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
        {
            price: priceId,
            quantity: 1 
        }
    ],
    success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'http://localhost:3000/cancel'
  });
  console.log(session);
  res.redirect(session.url);
});

const paymentRouter = require("./routes/payment");
app.use("/payment", paymentRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

module.exports = router;
