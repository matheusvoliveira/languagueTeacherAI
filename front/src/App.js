// import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import TeacherBot from "./pages/TeacherBot";
import LoginSignup from "./pages/Login/LoginSignup";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* <Route path="/teste" element={<TeacherBot />} />
          <Route path="/chat" element={<ChatMessage />} /> */}
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/signup" element={<LoginSignup />} />
          <Route path="/chat" element={<TeacherBot />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
