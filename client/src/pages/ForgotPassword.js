import React from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../firebase/firebaseConfig'; // Remove 'database' if it's not needed
function ForgotPassword() {
  const handleSubmit = async (e) => {
    e.preventDefault()
    const emailVal = e.target.email.value;
    sendPasswordResetEmail(auth, emailVal)
      .then((data) => alert("check your email"))
      .catch((err) => alert(err.code));
  };
  return (
    <div className="App">
      <h1>Forgot Password</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input name="email" /><br/>
        <button>Reset</button>
      </form>
    </div>
  );
}

export default ForgotPassword;
