import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import LoginForm from "./components/Login";
import Register from "./components/Register";
import Forgot from "./components/Forgot";
import ForgotOTP from "./components/ForgotOTP";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot" element={<Forgot />} />
        <Route path="forgot-otp" element={<ForgotOTP />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
