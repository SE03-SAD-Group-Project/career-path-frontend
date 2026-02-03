import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>CareerPath</h2>

      <div>
        {!user ? (
          <>
            <Link to="/register" style={styles.link}>Register</Link>
            <Link to="/login" style={styles.link}>Login</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    padding: "15px 40px",
    backgroundColor: "#1A73E8",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  logo: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "bold",
  },
  link: {
    marginRight: "20px",
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
  },
  logoutBtn: {
    background: "white",
    color: "#1A73E8",
    padding: "6px 14px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  }
};

export default Navbar;
