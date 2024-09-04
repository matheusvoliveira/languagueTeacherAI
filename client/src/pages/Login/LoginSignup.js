import React, { useState } from "react";
import "./Login.css";
import { FaFacebookF, FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router";
import firebase from "../../firebase/firebaseConfig";
import InputMask from "react-input-mask";

const LoginSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [tel, setTel] = useState("");

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
        setMessage("Login realizado com sucesso!");
        setShowErrorAlert(false);
        setShowSuccessAlert(true);
        await navigate("/");
      }
    } catch (error) {
      setMessage("Erro login!");
      setShowErrorAlert(true);
      setShowSuccessAlert(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Senhas não coincidem!");
      setShowErrorAlert(true);
      setShowSuccessAlert(false);
      return;
    }
    if (password.length < 8) {
      setMessage("Senha deve ter ao menos 8 caracteres!");
      setShowErrorAlert(true);
      setShowSuccessAlert(false);
      return;
    }
    const validateEmail = (email) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };

    if (!validateEmail(email)) {
      setMessage("Email não é valido!");
      setShowErrorAlert(true);
      setShowSuccessAlert(false);
      return;
    }

    const telDb = (tel) => {
      return tel.replace(/[()-\s]/g, '');
    }
    if (tel.length < 10) {
      setMessage("Telefone deve ter ao menos 8 digitos!");
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
          tel: telDb(tel),
          username: fullName,
        });

        setFullName("");
        setEmail("");
        setPassword("");

        setMessage("Cadastro realizado com sucesso!");
        setShowSuccessAlert(true);
        setShowErrorAlert(false);

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error("Erro de registro!:", error);

      if (error.code === "auth/email-already-in-use") {
        setMessage("Email já foi utilizado");
      } else if (error.code === "auth/weak-password") {
        setMessage("Senha muito fraca!");
      } else {
        setMessage("Cadastro falhou: " + error.message);
      }

      setShowErrorAlert(true);
      setShowSuccessAlert(false);
    }
  };

  const toggleForm = () => setShowSignup(!showSignup);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleReset = () => {
    navigate("/reset");
  };

  return (
    <section className={`container forms ${showSignup ? "show-signup" : ""}`}>
      <div className="form login">
        <div className="form-content">
          <header>Login</header>
          <form onSubmit={handleRegister} className="login-signup-form" >
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
                placeholder="Senha"
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
              <p type="text" className="forgot-pass" onClick={handleReset}>
                Esqueceu a senha?
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
              Não tem uma contat?{" "}
              <button
                type="button"
                className="link signup-link buttons"
                onClick={toggleForm}
              >
                Cadastrar
              </button>
            </span>
          </div>
        </div>
      </div>

      {/* Signup Form */}
      <div className="form signup">
        <div className="form-content">
          <header>Cadastro</header>
          <form onSubmit={handleRegister} className="login-signup-form">
            <div className="field input-field">
              <input
                className="inputRegister"
                type="text"
                placeholder="Nome Completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="field input-field">
              <InputMask
                type="tel"
                id="phone"
                name="phone"
                placeholder="Telefone"
                mask="(99) 99999-9999"
                required
                className="inputRegister"
                value={tel}
                onChange={(e) => setTel(e.target.value)}
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
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="field input-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirmar Senha"
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
              <button className="buttonRegister" type="Cadastro">
                Cadastrar
              </button>
            </div>
          </form>

          <div className="form-link">
            <span>
              Já tem conta?{" "}
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
