import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Dashboard from "./Dashboard";

function App() {
  return (
    <Router>
      <div style={{ textAlign: "center" }}>
        <h1>Career Path Recommendation System</h1>
        <div style={{ marginBottom: "20px" }}>
          <Link to="/register"><button>Register</button></Link>
          <Link to="/login" style={{ marginLeft: "10px" }}><button>Login</button></Link>
        </div>

        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
