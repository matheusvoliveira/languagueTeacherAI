// import React, { useState } from "react";
// import "./Login.css";
// import { FaFacebookF, FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
// import axios from "axios";
// import { useNavigate } from "react-router";
// import Cookies from "js-cookie";

// const LoginSignup = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   const [usernameLogin, setUsernameLogin] = useState("");
//   const [passwordLogin, setPasswordLogin] = useState("");

//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showSuccessAlert, setShowSuccessAlert] = useState(false);
//   const [showErrorAlert, setShowErrorAlert] = useState(false);
//   const [message, setMessage] = useState("");
//   const [showSignup, setShowSignup] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     try {
//       const response = await axios.post("http://localhost:3001/login", {
//         username,
//         password,
//       });

//       const { accessToken } = response.data;

//       if (accessToken) {
//         // Armazene o token JWT em um cookie
//         Cookies.set("access-token", accessToken, {
//           expires: 30, // Define o cookie para expirar em 30 dias
//           secure: process.env.NODE_ENV === "production", // Use secure apenas em produção
//           sameSite: "Strict", // Protege contra ataques CSRF
//         });

//         // Mostra uma mensagem genérica de sucesso
//         setMessage("Login successful!");
//         setShowSuccessAlert(true);
//         setShowErrorAlert(false);

//         // Redireciona o usuário para a página principal após o login bem-sucedido
//         setTimeout(() => {
//           navigate("/chat");
//         }, 2000); // Aguarda 2 segundos antes de redirecionar
//       }
//     } catch (error) {
//       console.error("Erro durante o processo de login:", error);

//       setMessage("User or password are wrong!");
//       setShowErrorAlert(true);
//       setShowSuccessAlert(false);
//     }
//   };

//   const handleRegister = async (event) => {
//     event.preventDefault();

//     if (password !== confirmPassword) {
//       setMessage("Passwords do not match");
//       setShowErrorAlert(true);
//       setShowSuccessAlert(false);
//       return;
//     }
//     if (password.length < 7) {
//       setMessage("Password most be at least 8 characters");
//       setShowErrorAlert(true);
//       setShowSuccessAlert(false);
//       return;
//     }
//     const validateEmail = (email) => {
//       const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       return regex.test(email);
//     };

//     if (!validateEmail(username)) {
//       setMessage("Email not valid");
//       setShowErrorAlert(true);
//       setShowSuccessAlert(false);
//       return;
//     }

//     try {
//       await axios.post("http://localhost:3001/register", {
//         username,
//         password,
//       });

//       setMessage("Registration successful! Redirecting...");
//       setShowSuccessAlert(true);
//       setShowErrorAlert(false);

//       setTimeout(() => {
//         window.location.reload();
//       }, 2000);
//     } catch (error) {
//       console.error("Error during registration:", error);
//       setMessage("User already exists");
//       setShowErrorAlert(true);
//       setShowSuccessAlert(false);
//     }
//   };

//   const toggleForm = () => setShowSignup(!showSignup);
//   const togglePasswordVisibility = () => setShowPassword(!showPassword);

//   return (
//     <section className={`container forms ${showSignup ? "show-signup" : ""}`}>
//       <div className="form login">
//         <div className="form-content">
//           <header>Login</header>
//           <form action="#">
//             <div className="field input-field">
//               <input
//                 type="email"
//                 placeholder="Email"
//                 className="input"
//                 value={usernameLogin}
//                 onChange={(e) => setUsernameLogin(e.target.value)}
//               />
//             </div>

//             <div className="field input-field">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Password"
//                 className="password"
//                 alue={passwordLogin}
//                 onChange={(e) => setPasswordLogin(e.target.value)}
//               />
//               <i onClick={togglePasswordVisibility} className="eye-icon">
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </i>
//             </div>

//             <div className="form-link">
//               <button type="button" className="forgot-pass">
//                 Forgot password?
//               </button>
//             </div>

//             <div className="field button-field">
//               <button className="buttonLogin" onClick={handleLogin}>
//                 Login
//               </button>
//             </div>
//           </form>

//           <div className="form-link">
//             <span>
//               Don't have an account?{" "}
//               <button
//                 type="button"
//                 className="link signup-link"
//                 onClick={toggleForm}
//               >
//                 Signup
//               </button>
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Signup Form */}
//       <div className="form signup">
//         <div className="form-content">
//           <header>Signup</header>
//           <form onSubmit={handleRegister}>
//             <div className="field input-field">
//               <input
//                 className="inputRegister"
//                 type="text"
//                 placeholder="Email"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//               />
//             </div>

//             <div className="field input-field">
//               <input
//                 className="inputPassword"
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>

//             <div className="field input-field">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Confirm password"
//                 className="password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//               />
//               <i onClick={togglePasswordVisibility} className="eye-icon">
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </i>
//             </div>
//             {showSuccessAlert && (
//               <span className="alert-success">{message}</span>
//             )}
//             {showErrorAlert && <span className="alert-error">{message}</span>}

//             <div className="field button-field">
//               <button className="buttonRegister" type="submit">
//                 Signup
//               </button>
//             </div>
//           </form>

//           <div className="form-link">
//             <span>
//               Already have an account?{" "}
//               <button
//                 type="button"
//                 className="link login-link"
//                 onClick={toggleForm}
//               >
//                 Login
//               </button>
//             </span>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default LoginSignup;

import React, { useState } from "react";
import "./Login.css";
import { FaFacebookF, FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";

const LoginSignup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameLogin, setUsernameLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3001/login", {
        username: usernameLogin,
        password: passwordLogin,
      });

      const { accessToken } = response.data;

      if (accessToken) {
        // Store JWT token in a cookie
        Cookies.set("access-token", accessToken, {
          expires: 30, // Cookie expires in 30 days
          secure: process.env.NODE_ENV === "production", // Use secure flag in production
          sameSite: "Strict", // CSRF protection
        });

        // Show generic success message
        setMessage("Login successful!");
        setShowSuccessAlert(true);
        setShowErrorAlert(false);

        // Redirect to the main page after successful login
        setTimeout(() => {
          navigate("/chat");
        }, 1000); // Wait 2 seconds before redirecting
      }
    } catch (error) {
      console.error("Error during login process:", error);

      setMessage("User or password is incorrect!");
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

    if (!validateEmail(username)) {
      setMessage("Email not valid");
      setShowErrorAlert(true);
      setShowSuccessAlert(false);
      return;
    }

    try {
      await axios.post("http://localhost:3001/register", {
        username,
        password,
      });

      setMessage("Registration successful! Redirecting...");
      setShowSuccessAlert(true);
      setShowErrorAlert(false);

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error during registration:", error);
      setMessage("User already exists");
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
                value={usernameLogin}
                onChange={(e) => setUsernameLogin(e.target.value)}
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
              <button type="button" className="forgot-pass">
                Forgot password?
              </button>
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
                className="link signup-link"
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
                placeholder="Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                className="link login-link"
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
