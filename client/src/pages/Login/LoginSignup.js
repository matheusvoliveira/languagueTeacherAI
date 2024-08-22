import React, { useState } from "react";
import "./Login.css";
import { FaFacebookF, FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import {  useNavigate } from "react-router";
import firebase from "../../firebase/firebaseConfig";

const LoginSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      if (!emailLogin || !passwordLogin) {
        setMessage("Please fill all the fields");
        setShowErrorAlert(true);
        setShowSuccessAlert(false);
      }

      const response = await firebase
        .auth()
        .signInWithEmailAndPassword(emailLogin, passwordLogin);

      if (response.user) {
        setEmail("");
        setPassword("");
        console.log("entrou");
        setMessage("Login right");
        setShowErrorAlert(false);
        setShowSuccessAlert(true);
        await navigate("/");
      }
    } catch (error) {
      setMessage("Login error");
      setShowErrorAlert(true);
      setShowSuccessAlert(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setShowErrorAlert(true);
      setShowSuccessAlert(false);
      return;
    }
    if (password.length < 8) {
      setMessage("Password must be at least 8 characters");
      setShowErrorAlert(true);
      setShowSuccessAlert(false);
      return;
    }
    const validateEmail = (email) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };

    if (!validateEmail(email)) {
      setMessage("Email not valid");
      setShowErrorAlert(true);
      setShowSuccessAlert(false);
      return;
    }

    try {
      const response = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      if (response.user) {
        await response.user.updateProfile({
          displayName: fullName,
        });

        const uid = response.user.uid;
        const userRef = firebase.database().ref("users/" + uid);
        await userRef.set({
          uid: uid,
          email: email,
          username: fullName,
        });

        setFullName("");
        setEmail("");
        setPassword("");

        setMessage("Registration successful! Redirecting...");
        setShowSuccessAlert(true);
        setShowErrorAlert(false);

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error("Error during registration:", error);

      if (error.code === "auth/email-already-in-use") {
        setMessage("Email already in use");
      } else if (error.code === "auth/weak-password") {
        setMessage("Password is too weak");
      } else {
        setMessage("Registration failed: " + error.message);
      }

      setShowErrorAlert(true);
      setShowSuccessAlert(false);
    }
  };

  const toggleForm = () => setShowSignup(!showSignup);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <section className={`container forms ${showSignup ? "show-signup" : ""}`}>
      <div className="form login">
        <div className="form-content">
          <header>Login</header>
          <form action="#">
            <div className="field input-field">
              <input
                type="email"
                placeholder="Email"
                className="input"
                value={emailLogin}
                onChange={(e) => setEmailLogin(e.target.value)}
              />
            </div>

            <div className="field input-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="password"
                value={passwordLogin}
                onChange={(e) => setPasswordLogin(e.target.value)}
              />
              <i onClick={togglePasswordVisibility} className="eye-icon">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </i>
            </div>
            {showSuccessAlert && (
              <span className="alert-success">{message}</span>
            )}
            {showErrorAlert && <span className="alert-error">{message}</span>}
            <div className="form-link">
              <p type="text" className="forgot-pass">
                Forgot password?
              </p>
            </div>

            <div className="field button-field">
              <button
                className="buttonLogin"
                type="button"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
          </form>

          <div className="form-link">
            <span>
              Don't have an account?{" "}
              <button
                type="button"
                className="link signup-link buttons"
                onClick={toggleForm}
              >
                Signup
              </button>
            </span>
          </div>
        </div>
      </div>

      {/* Signup Form */}
      <div className="form signup">
        <div className="form-content">
          <header>Signup</header>
          <form onSubmit={handleRegister}>
            <div className="field input-field">
              <input
                className="inputRegister"
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="field input-field">
              <input
                className="inputRegister"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="field input-field">
              <input
                className="inputPassword"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="field input-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm password"
                className="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <i onClick={togglePasswordVisibility} className="eye-icon">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </i>
            </div>
            {showSuccessAlert && (
              <span className="alert-success">{message}</span>
            )}
            {showErrorAlert && <span className="alert-error">{message}</span>}

            <div className="field button-field">
              <button className="buttonRegister" type="submit">
                Signup
              </button>
            </div>
          </form>

          <div className="form-link">
            <span>
              Already have an account?{" "}
              <button
                type="button"
                className="link login-link buttons"
                onClick={toggleForm}
              >
                Login
              </button>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginSignup;
