import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./index.less";
import RegisterPage from "./register";
import LoginPage from "./login";

function Login() {
  return (
    <Router basename="/react-ant-admin">
      <div className="login-page">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default Login;
