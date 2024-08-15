const express = require("express");
const router = express.Router();
const { validateToken } = require("../../JWT"); // Adjust the path if needed

// Protected route to get user profile
router.get("/", validateToken, (req, res) => {
  // This assumes validateToken sets req.user
  res.json({ message: 'Profile data', user: req.user });
});

module.exports = router;
