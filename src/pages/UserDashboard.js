import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import theme from "../theme"; 
import CareerForm from "../CareerForm"; 
import ResumeEnhancer from "../components/ResumeEnhancer"; 

function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    // 1. Check Login
    const data = localStorage.getItem("user");
    if (!data) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(data);
    setUser(parsedUser);

    // 2. Fetch Data
    fetchDashboardData(parsedUser.id);
  }, [navigate]);

  const fetchDashboardData = async (userId) => {
    try {
      // Fetch Requests
      const reqRes = await axios.get(`http://localhost:5000/api/users/my-requests?userId=${userId}`);
      setRequests(reqRes.data.requests || []);

      // Fetch Saved Careers
      const savedRes = await axios.get(`http://localhost:5000/api/users/saved?userId=${userId}`);
      setSaved(savedRes.data.saved || []);
    } catch (e) {
      console.error("Error loading dashboard data:", e);
    }
  };

  const handleDecision = async (requestId, decision) => {
    try {
      const status = decision === 'accept' ? 'ACCEPTED' : 'DENIED';
      await axios.put(`http://localhost:5000/api/users/requests/${requestId}`, { status });
      fetchDashboardData(user.id);
      alert(`Request ${decision}ed!`);
    } catch (e) {
      alert("Failed to update request.");
    }
  };

  if (!user) return null;

  return (
    <div style={styles.page}>
      {/* 1. PROFILE CARD */}
      <div style={styles.fullWidthCard} className="card-animate">
        <div style={styles.profileHeader}>
          <div style={styles.profileLeft}>
            <div style={styles.avatar}>{user.name?.[0]}</div>
            <div>
              <h2 style={styles.title}>Welcome back, {user.name}</h2>
              <p style={styles.subText}>{user.email}</p>
            </div>
          </div>

          <div style={styles.actionRow}>
            <button onClick={() => navigate("/growth")} style={styles.growthBtn} className="button-hover">
              🚀 Growth Tracker
            </button>
            <button onClick={() => navigate("/jd-match")} style={styles.growthBtn} className="button-hover">
              📑 Job Match
            </button>
          </div>
        </div>

        <div style={styles.pillRow}>
          <span style={styles.pill}>Student Account</span>
          <span style={styles.pillSecondary}>Profile synced</span>
          <span style={styles.pillSuccess}>AI Growth Tracking Active</span>
        </div>
      </div>

      {/* 2. PENDING REQUESTS */}
      {requests.filter(r => r.status === 'PENDING_EMPLOYEE').length > 0 && (
        <div style={styles.wideSection} className="card-animate">
          <h3 style={{...styles.title, color: theme.colors.accent, marginBottom: 20}}>
            🔔 New Job Inquiries
          </h3>
          <div style={{ display: "grid", gap: 15 }}>
            {requests.filter(r => r.status === 'PENDING_EMPLOYEE').map((req) => (
              <div key={req._id} style={styles.requestCard}>
                <div>
                  <h4 style={{ margin: "0 0 5px 0", color: "#fff" }}>
                    {req.employerId?.name || "A Recruiter"}
                  </h4>
                  <p style={{ margin: 0, color: theme.colors.textSecondary, fontSize: 14 }}>
                    from {req.employerId?.email} has invited you to connect.
                  </p>
                </div>
                <div style={styles.btnGroup}>
                  <button onClick={() => handleDecision(req._id, 'accept')} style={styles.acceptBtn}>Accept</button>
                  <button onClick={() => handleDecision(req._id, 'deny')} style={styles.denyBtn}>Decline</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ACTIVE CONNECTIONS (With Email Contact) */}
      {requests.filter(r => r.status === 'ACCEPTED').length > 0 && (
        <div style={styles.wideSection} className="card-animate">
          <h3 style={{...styles.title, color: "#22c55e", marginBottom: 20}}>
            ✅ Active Connections
          </h3>
          <div style={{ display: "grid", gap: 15 }}>
            {requests.filter(r => r.status === 'ACCEPTED').map((req) => (
              <div key={req._id} style={styles.connectedCard}>
                <div>
                  <h4 style={{ margin: "0 0 5px 0", color: "#fff" }}>
                    {req.employerId?.name || "Company"}
                  </h4>
                  <p style={{ margin: "4px 0 0", color: theme.colors.textSecondary, fontSize: 14 }}>
                     Contact:{" "}
                     <a 
                       href={`mailto:${req.employerId?.email}`} 
                       style={{color: theme.colors.accent, textDecoration: "underline"}}
                     >
                        {req.employerId?.email}
                     </a>
                  </p>
                </div>
                <div style={{textAlign: "right"}}>
                   <span style={styles.pillSuccess}>Connected</span>
                   <div style={{fontSize: "11px", color: theme.colors.textSecondary, marginTop: "5px"}}>
                     {new Date(req.createdAt).toLocaleDateString()}
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SAVED CAREERS */}
      {saved.length > 0 && (
        <div style={styles.wideSection} className="card-animate">
          <h3 style={{...styles.title, marginBottom: 20}}>Your Saved Paths</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {saved.map((s, i) => (
              <div key={i} style={styles.savedCard}>
                <strong>{s.careerTitle}</strong>
                <span style={{ fontSize: 12, color: theme.colors.textSecondary }}>
                  {new Date(s.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TOOLS */}
      <div style={styles.wideSection} className="card-animate">
        <CareerForm fullWidth />
      </div>
      <div style={styles.wideSection} className="card-animate">
        <ResumeEnhancer />
      </div>
    </div>
  );
}

// --- STYLES ---
const styles = {
  page: {
    minHeight: "100vh",
    padding: "0 12px 40px",
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.lg,
    maxWidth: "1200px",
    margin: "0 auto"
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
    flexWrap: "wrap"
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
    color: theme.colors.textPrimary
  },
  subText: {
    fontSize: "14px",
    color: theme.colors.textSecondary,
    margin: "4px 0 0",
  },
  pillRow: {
    display: "flex",
    gap: "10px",
    marginTop: theme.spacing.sm,
    flexWrap: "wrap"
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
  requestCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    background: "rgba(255, 255, 255, 0.03)",
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radii.md
  },
  connectedCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    background: "rgba(34, 197, 94, 0.05)",
    border: `1px solid rgba(34, 197, 94, 0.2)`,
    borderRadius: theme.radii.md
  },
  btnGroup: {
    display: "flex",
    gap: 10
  },
  acceptBtn: {
    ...theme.button("success"),
    backgroundColor: "#22c55e", 
    backgroundImage: "none",
  },
  denyBtn: {
    ...theme.button("danger"),
    backgroundColor: "#ef4444", 
    backgroundImage: "none",
  },
  savedCard: {
    padding: "12px",
    background: "rgba(255,255,255,0.03)",
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radii.sm,
    display: "flex",
    justifyContent: "space-between",
    color: theme.colors.textPrimary
  }
};

export default UserDashboard;