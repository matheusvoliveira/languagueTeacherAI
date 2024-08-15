const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { Users } = require("../../models");
const { createToken } = require("../../JWT");

// Login
router.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Verify if the user exist in db
    const user = await Users.findOne({ where: { username } });

    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    // Compare the password you type with the one storage in the db 
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ error: "Combinantion between user and password does not exist" });
    }

    // If the password match create a token 
    const accessToken = createToken(user);

    // Configura e envia o cookie de acesso
    res.cookie("access-token", accessToken, {
      httpOnly: true, // Evita acesso via JavaScript no cliente
      secure: process.env.NODE_ENV === "production", // Use secure somente em produção (HTTPS)
      sameSite: "Strict", // Protege contra CSRF
      maxAge: 2592000000 // Expira em 30 dias
    });

    // Send the sucess answer and the token together
    res.json({ message: "Login successful", accessToken }); // Includes the accessToken in the answer
  } catch (err) {
    console.error("Erro durante a autenticação do usuário:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

module.exports = router;
