import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import theme from "../theme";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // 1. Check Admin Login
    const data = localStorage.getItem("user");
    if (!data) {
      navigate("/login");
      return;
    }
    const parsed = JSON.parse(data);
    if (parsed.role !== "admin") {
      alert("Access Denied: Admins only.");
      navigate("/dashboard");
      return;
    }
    setAdmin(parsed);

    // 2. Fetch Pending Requests
    fetchPendingRequests();
  }, [navigate]);

  const fetchPendingRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/admin/pending-requests");
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error("Error fetching admin requests", err);
    }
  };

  const handleDecision = async (requestId, decision) => {
    try {
      // If Approved -> Status becomes 'PENDING_EMPLOYEE' (Sent to Student)
      // If Denied -> Status becomes 'DENIED'
      const newStatus = decision === 'approve' ? 'PENDING_EMPLOYEE' : 'DENIED';
      
      await axios.put(`http://localhost:5000/api/users/requests/${requestId}`, {
        status: newStatus
      });

      alert(`Request ${decision}d successfully!`);
      fetchPendingRequests(); // Refresh list
    } catch (err) {
      alert("Error updating request.");
    }
  };

  if (!admin) return null;

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.fullWidthCard} className="card-animate">
        <h2 style={styles.title}>Admin Control Center</h2>
        <p style={styles.subText}>Logged in as {admin.name}</p>
        <div style={styles.pillRow}>
            <span style={styles.pillDanger}>System Admin</span>
        </div>
      </div>

      {/* PENDING APPROVALS SECTION */}
      <div style={styles.wideSection} className="card-animate">
        <h3 style={{...styles.title, marginBottom: 20}}>
           Connection Approvals ({requests.length})
        </h3>

        {requests.length === 0 ? (
          <p style={{color: theme.colors.textSecondary}}>No pending requests.</p>
        ) : (
          <div style={styles.listContainer}>
            {requests.map((req) => (
              <div key={req._id} style={styles.requestItem}>
                <div style={{ flex: 1 }}>
                  <div style={styles.row}>
                    <strong style={{color: "#fff"}}>Employer:</strong> 
                    <span style={{color: theme.colors.textSecondary}}> {req.employerId?.name} ({req.employerId?.email})</span>
                  </div>
                  <div style={styles.row}>
                    <strong style={{color: "#fff"}}>Candidate:</strong> 
                    <span style={{color: theme.colors.textSecondary}}> {req.employeeId?.name} ({req.employeeId?.email})</span>
                  </div>
                  <div style={{fontSize: "12px", color: theme.colors.textSecondary, marginTop: 5}}>
                    Requested on: {new Date(req.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div style={styles.btnGroup}>
                  <button 
                    onClick={() => handleDecision(req._id, 'approve')}
                    style={styles.approveBtn}
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleDecision(req._id, 'deny')}
                    style={styles.denyBtn}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
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
    maxWidth: "1000px",
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
  pillRow: { display: "flex", marginTop: theme.spacing.sm },
  pillDanger: {
    padding: "8px 12px",
    background: "rgba(239,68,68,0.15)",
    borderRadius: "999px",
    border: "1px solid rgba(239,68,68,0.3)",
    color: "#fca5a5",
    fontSize: "12px",
    fontWeight: 700,
  },
  listContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  requestItem: {
    background: "rgba(255,255,255,0.03)",
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radii.md,
    padding: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 15
  },
  row: { marginBottom: 4 },
  btnGroup: { display: "flex", gap: 10 },
  approveBtn: {
    ...theme.button("success"),
    backgroundColor: "#10b981",
    backgroundImage: "none",
    padding: "8px 16px",
    fontSize: "13px"
  },
  denyBtn: {
    ...theme.button("danger"),
    backgroundColor: "#ef4444",
    backgroundImage: "none",
    padding: "8px 16px",
    fontSize: "13px"
  }
};