import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import TeacherBotEng from "../src/pages/chats/TeacherBotEng";
import TeacherBotIta from "../src/pages/chats/TeacherBotIta";
import LoginSignup from "./pages/Login/LoginSignup";
import Prices from "./pages/prices/Prices";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import firebase from "./firebase/firebaseConfig"; // Assuming firebase is configured here

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if a user is already logged in when the app loads
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user); // If logged in, set user
      } else {
        setUser(null); // If not logged in, clear user state
      }
      setLoading(false); // Finish loading
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  // if (loading) {
  //   // While checking for user authentication state, show a loading spinner or message
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={user ? <Navigate to="/chat-eng" /> : <LoginSignup />}
          />
           <Route path="/chat-ita" element={<TeacherBotIta />} />
          <Route path="/signup" element={<LoginSignup />} />
          <Route path="/reset" element={<ForgotPassword />} />
          <Route path="/planos" element={<Prices />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />

          {/* Protected routes */}
          <Route
            path="/chat-eng"
            element={user ? <TeacherBotEng /> : <Navigate to="/login" />}
          />

          <Route
            path="/chat-eng"
            element={user ? <TeacherBotIta /> : <Navigate to="/login" />}
          />
          {/* Catch-all route */}
          <Route
            path="*"
            element={
              user ? <Navigate to="/chat-eng" /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
