import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import TeacherBotEnglish from "./pages/chats/TeacherBotEnglish";
import TeacherBotFrench from "./pages/chats/TeacherBotFrench";
import TeacherBotGerman from "./pages/chats/TeacherBotGerman";
import TeacherBotItalian from "./pages/chats/TeacherBotItalian";
import TeacherBotJapanese from "./pages/chats/TeacherBotJapanese";
import TeacherBotKorean from "./pages/chats/TeacherBotKorean";
import TeacherBotMandarin from "./pages/chats/TeacherBotMandarin";
import TeacherBotPortuguese from "./pages/chats/TeacherBotPortuguese";
import TeacherBotSpanish from "./pages/chats/TeacherBotSpanish";
import TeacherBotArabic from "./pages/chats/TeacherBotArabic";

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

  if (loading) {
    // Show a loading spinner or message while checking authentication
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={user ? <Navigate to="/chat-english" /> : <LoginSignup />}
          />
          <Route path="/signup" element={<LoginSignup />} />
          <Route path="/reset" element={<ForgotPassword />} />
          <Route path="/planos" element={<Prices />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />

          {/* Protected chat routes */}
          <Route
            path="/chat-english"
            element={user ? <TeacherBotEnglish /> : <Navigate to="/login" />}
          />
          <Route
            path="/chat-french"
            element={user ? <TeacherBotFrench /> : <Navigate to="/login" />}
          />
          <Route
            path="/chat-german"
            element={user ? <TeacherBotGerman /> : <Navigate to="/login" />}
          />
          <Route
            path="/chat-italian"
            element={user ? <TeacherBotItalian /> : <Navigate to="/login" />}
          />
          <Route
            path="/chat-japanese"
            element={user ? <TeacherBotJapanese /> : <Navigate to="/login" />}
          />
          <Route
            path="/chat-korean"
            element={user ? <TeacherBotKorean /> : <Navigate to="/login" />}
          />
          <Route
            path="/chat-portuguese"
            element={user ? <TeacherBotPortuguese /> : <Navigate to="/login" />}
          />
          <Route
            path="/chat-spanish"
            element={user ? <TeacherBotSpanish /> : <Navigate to="/login" />}
          />
          <Route
            path="/chat-arabic"
            element={user ? <TeacherBotArabic /> : <Navigate to="/login" />}
          />
            <Route
            path="/chat-mandarin"
            element={user ? <TeacherBotMandarin /> : <Navigate to="/login" />}
          />

          {/* Catch-all route */}
          <Route
            path="*"
            element={
              user ? <Navigate to="/chat-english" /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
