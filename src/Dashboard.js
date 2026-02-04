import ResumeEnhancer from "./components/ResumeEnhancer";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CareerForm from "./CareerForm";
import theme from "./theme";

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
      {/* ⭐ FULL-WIDTH PROFILE CARD */}
      <div style={styles.fullWidthCard} className="card-animate">
        <div style={styles.profileHeader}>
          <div style={styles.profileLeft}>
            <div style={styles.avatar}>{user.name?.[0]}</div>
            <div>
              <h2 style={styles.title}>Welcome back, {user.name}</h2>
              <p style={styles.subText}>{user.email}</p>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div style={styles.actionRow}>
            <button
              onClick={() => navigate("/growth")}
              style={styles.growthBtn}
              className="button-hover"
            >
              📈 Growth Tracker
            </button>

            <button
              onClick={() => navigate("/jd-match")}
              style={styles.growthBtn}
              className="button-hover"
            >
              🎯 Job Des Match
            </button>

          </div>
        </div>

        <div style={styles.pillRow}>
          <span style={styles.pill}>Profile synced</span>
          <span style={styles.pillSecondary}>Personalized journey</span>
          <span style={styles.pillSuccess}>AI Growth Tracking Active</span>
        </div>
      </div>

      {/* ⭐ FULL-WIDTH CAREER RECOMMENDATION */}
      <div style={styles.wideSection} className="card-animate">
        <CareerForm fullWidth />
      </div>

      {/* ⭐ FULL-WIDTH RESUME ENHANCER */}
      <div style={styles.wideSection} className="card-animate">
        <ResumeEnhancer />
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "0 12px 40px",
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.lg,
  },

  fullWidthCard: {
    ...theme.glassPanel("24px"),
    width: "100%",
    padding: "32px",
  },

  wideSection: {
    ...theme.glassPanel("24px"),
    width: "100%",
    padding: "40px",
  },

  profileHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
    gap: 16,
  },

  profileLeft: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.sm,
  },

  actionRow: {
    display: "flex",
    gap: 10,
    alignItems: "center",
  },

  avatar: {
    width: "58px",
    height: "58px",
    borderRadius: theme.radii.lg,
    background: theme.gradients.secondary,
    display: "grid",
    placeItems: "center",
    fontSize: "24px",
    fontWeight: 800,
    color: "#041024",
    boxShadow: theme.shadows.glow,
  },

  title: {
    fontSize: "22px",
    margin: 0,
    fontWeight: 700,
  },

  subText: {
    fontSize: "14px",
    color: theme.colors.textSecondary,
    margin: "4px 0 0",
  },

  pillRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: theme.spacing.sm,
  },

  pill: {
    padding: "8px 12px",
    background: "rgba(99,102,241,0.16)",
    borderRadius: "999px",
    border: "1px solid rgba(99,102,241,0.3)",
    color: "#c7d2fe",
    fontSize: "12px",
    fontWeight: 700,
  },

  pillSecondary: {
    padding: "8px 12px",
    background: "rgba(14,165,233,0.14)",
    borderRadius: "999px",
    border: "1px solid rgba(14,165,233,0.3)",
    color: "#bae6fd",
    fontSize: "12px",
    fontWeight: 700,
  },

  pillSuccess: {
    padding: "8px 12px",
    background: "rgba(34,197,94,0.16)",
    borderRadius: "999px",
    border: "1px solid rgba(34,197,94,0.35)",
    color: "#bbf7d0",
    fontSize: "12px",
    fontWeight: 700,
  },

  growthBtn: {
    ...theme.button("primary"),
    whiteSpace: "nowrap",
  },

  logoutBtn: {
    ...theme.button("danger"),
    color: "#0b1224",
    whiteSpace: "nowrap",
  },
};

export default Dashboard;
