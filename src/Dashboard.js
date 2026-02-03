import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CareerForm from "./CareerForm";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (!data) {
      navigate("/login");
    } else {
      setUser(JSON.parse(data));
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <div style={styles.page}>
      {/* USER CARD */}
      <div style={styles.card} className="fade-in">
        <h2 style={styles.title}>👋Hey, {user.name}</h2>
        <p style={styles.subText}>{user.email}</p>

        <button
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/login");
          }}
          style={styles.logoutBtn}
        >
          Logout
        </button>
      </div>

      {/* CAREER FORM */}
      <div style={styles.card} className="slide-up">
        <CareerForm />
      </div>
    </div>
  );
}

// 🔥 Modern Glass UI + Animation styles
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    padding: "40px",
    textAlign: "center",
  },

  card: {
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "20px",
    padding: "25px",
    maxWidth: "500px",
    margin: "20px auto",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    color: "white",
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
  },

  title: {
    fontSize: "28px",
    marginBottom: "10px",
    fontWeight: "600",
  },

  subText: {
    fontSize: "16px",
    opacity: "0.8",
    marginBottom: "20px",
  },

  logoutBtn: {
    padding: "12px 20px",
    backgroundColor: "#d9534f",
    border: "none",
    borderRadius: "10px",
    color: "white",
    cursor: "pointer",
    fontSize: "16px",
    transition: "0.3s",
  },
};

// 🔥 Smooth animations injected into the DOM
const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
  .fade-in {
    animation: fadeIn 1s ease forwards;
    opacity: 0;
  }

  .slide-up {
    animation: slideUp 1s ease forwards;
    opacity: 0;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(styleSheet);

export default Dashboard;
