import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import TeacherBot from "./pages/TeacherBot";
import LoginSignup from "./pages/Login/LoginSignup";
import Prices from "./pages/prices/Prices";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import firebase from "./firebase/firebaseConfig"; // Firebase import

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
    // While checking for user authentication state, show a loading spinner or message
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={user ? <Navigate to="/chat" /> : <LoginSignup />} />
          <Route path="/signup" element={<LoginSignup />} />
          <Route path="/reset" element={<ForgotPassword />} />

          {/* Protected routes */}
          <Route path="/chat" element={user ? <TeacherBot /> : <Navigate to="/login" />} />
          <Route path="/success" element={user ? <Success /> : <Navigate to="/login" />} />
          <Route path="/cancel" element={user ? <Cancel /> : <Navigate to="/login" />} />
          <Route path="/planos" element={user ? <Prices /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/chat" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
