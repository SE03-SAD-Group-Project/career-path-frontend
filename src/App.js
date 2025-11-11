import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Dashboard from "./Dashboard";

function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}

function MainApp() {
  const location = useLocation();

  // ✅ Hide navigation buttons on dashboard
  const hideNav = location.pathname === "/dashboard";

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Career Path Recommendation System</h1>

      {!hideNav && (
        <div style={{ marginBottom: "20px" }}>
          <Link to="/register">
            <button style={styles.registerBtn}>Register</button>
          </Link>
          <Link to="/login">
            <button style={styles.loginBtn}>Login</button>
          </Link>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

const styles = {
  registerBtn: {
    backgroundColor: "#27ae60",
    color: "white",
    border: "none",
    padding: "8px 16px",
    marginRight: "8px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  loginBtn: {
    backgroundColor: "#2980b9",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default App;
