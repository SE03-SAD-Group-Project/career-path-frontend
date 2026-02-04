import React, { useEffect, useState } from "react";
import axios from "axios";
import theme from "../theme";

export default function EmployerDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for the filter

  useEffect(() => {
    // 1. Check Login
    const data = localStorage.getItem("user");
    if (data) {
      setUser(JSON.parse(data));
    }
    // 2. Fetch Candidates
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      // ⭐ FIXED: Added 's' to 'users' to match your Backend Route
      const res = await axios.get("http://localhost:5000/api/users/candidates");
      setCandidates(res.data.candidates || []);
    } catch (err) {
      console.error("Error fetching candidates", err);
    }
  };

  const sendRequest = async (employeeId) => {
    if (!user) return alert("Please login first");
    try {
      // ⭐ FIXED: Added 's' here too for consistency
      await axios.post("http://localhost:5000/api/users/request-connection", {
        employerId: user.id,
        employeeId: employeeId
      });
      alert("Request sent! Admin will review it shortly.");
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Could not send request"));
    }
  };

  return (
    <div style={styles.page}>
      {/* Header Card */}
      <div style={styles.fullWidthCard} className="card-animate">
        <h2 style={styles.title}>Employer Portal</h2>
        <p style={styles.subText}>Welcome, {user?.name}. Find and connect with top talent.</p>
        <div style={styles.pillRow}>
            <span style={styles.pillSecondary}>Recruiter Access</span>
        </div>
      </div>

      {/* Candidates Grid */}
      <div style={styles.wideSection} className="card-animate">
        <h3 style={{...styles.title, marginBottom: 20}}>Available Candidates</h3>

        {/* 🔍 NEW: Search / Filter Input */}
        <div style={{marginBottom: 20}}>
            <input 
              type="text" 
              placeholder="🔍 Filter by Role (e.g., UI Engineer, Data Scientist)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
        </div>

        <div style={styles.grid}>
          {candidates
            .filter((c) => {
                // ⭐ FILTER LOGIC:
                // If search is empty, show everyone.
                if (!searchTerm) return true;
                // Otherwise, check if their AI Role or Name matches the search
                const role = c.seekingRole || "";
                return role.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       c.name.toLowerCase().includes(searchTerm.toLowerCase());
            })
            .map((c) => (
            <div key={c._id} style={styles.candidateCard}>
              <div>
                <div style={styles.avatar}>{c.name?.[0]}</div>
                <h4 style={{ margin: "10px 0 5px", color: theme.colors.textPrimary }}>{c.name}</h4>
                
                {/* ⭐ SHOW AI ROLE TAG */}
                {c.seekingRole ? (
                    <span style={styles.roleTag}>
                        {c.seekingRole}
                    </span>
                ) : (
                    <span style={{...styles.roleTag, background: "#333", color: "#888"}}>
                        General Applicant
                    </span>
                )}

                <p style={{ margin: "10px 0 0", color: theme.colors.textSecondary, fontSize: 13 }}>{c.email}</p>
              </div>
              
              <button 
                onClick={() => sendRequest(c._id)}
                style={styles.connectBtn}
                className="button-hover"
              >
                Request Connection
              </button>
            </div>
          ))}
        </div>
        
        {/* Show message if no results found */}
        {candidates.length > 0 && candidates.filter(c => 
             (c.seekingRole || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
             c.name.toLowerCase().includes(searchTerm.toLowerCase())
        ).length === 0 && (
            <p style={{color: "#888", textAlign: "center"}}>No candidates found matching "{searchTerm}"</p>
        )}

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
    marginTop: theme.spacing.sm,
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
  // New Input Style
  searchInput: {
    padding: "12px 16px",
    width: "100%",
    maxWidth: "400px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(0,0,0,0.3)",
    color: "white",
    outline: "none",
    fontSize: "15px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 20
  },
  candidateCard: {
    background: "rgba(255, 255, 255, 0.03)",
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radii.lg,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "200px"
  },
  avatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: theme.gradients.primary || "linear-gradient(to right, #4c00ff, #0ea5e9)",
    display: "grid",
    placeItems: "center",
    fontWeight: 700,
    color: "#0b1224"
  },
  // New Role Tag Style
  roleTag: {
    display: "inline-block",
    fontSize: "11px", 
    background: "#a78bfa", 
    color: "#000", 
    padding: "4px 8px", 
    borderRadius: "4px",
    fontWeight: "bold",
    marginTop: "5px"
  },
  connectBtn: {
    ...theme.button("primary"),
    width: "100%",
    marginTop: 15
  }
};