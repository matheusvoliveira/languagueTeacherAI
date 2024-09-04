// import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import TeacherBot from "./pages/TeacherBot";
import LoginSignup from "./pages/Login/LoginSignup";
import Prices from "./pages/prices/Prices";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import ForgotPassword from "../../client/src/pages/ForgotPassword/ForgotPassword"
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/signup" element={<LoginSignup />} />
          <Route path="/reset" element={<ForgotPassword />} />
          <Route path="/chat" element={<TeacherBot />} />
          <Route path="" element={<Prices />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
