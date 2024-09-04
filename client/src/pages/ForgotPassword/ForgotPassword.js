import React from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../../firebase/firebaseConfig';
import "./ForgotPassword.css";  

function ForgotPassword() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailVal = e.target.email.value;
    sendPasswordResetEmail(auth, emailVal)
      .then(() => alert("Verifique seu email"))
      .catch((err) => alert(err.code));
  };

  return (
    <div className="forgot-pass-bc">
      <form onSubmit={handleSubmit} className="forgot-pass-form">
        <h1>Redefinir senha</h1>
        <input name="email" placeholder="Email" className="forgot-pass-input" /><br />
        <button className="forgot-pass-button">Reset</button>
      </form>
    </div>
  );
}

export default ForgotPassword;
