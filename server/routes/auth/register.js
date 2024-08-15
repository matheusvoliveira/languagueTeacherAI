// const express = require("express");
// const router = express.Router();
// const bcrypt = require('bcrypt');
// const { Users } = require("../../models/Users");

// router.post("/", async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     // transforms passorwd in a hash randow token kye
//     const hash = await bcrypt.hash(password, 10); 
//     // create an user and save a hash in db 
//     await Users.create({
//       username: username,
//       password: hash,
//     });

//     res.json("USER REGISTERED");
//   } catch (err) {
//     console.error("Error registering user:", err);
//     res.status(400).json({ error: "Failed to register user" });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const { sequelize, Users } = require("../../models"); // Adjust path if necessary

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10); 
    await Users.create({
      username: username,
      password: hash,
    });

    res.json("USER REGISTERED");
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(400).json({ error: "Failed to register user" });
  }
});

module.exports = router;
