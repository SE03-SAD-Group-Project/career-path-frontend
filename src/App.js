import GrowthTracker from "./pages/GrowthTracker";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCareers from "./pages/AdminCareers";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Navbar from "./components/Navbar";
import theme from "./theme";


function App() {
  return (
    <Router>
      <div style={styles.viewport}>
        <div className="neon-grid" aria-hidden />
        <div className="float-orb one" aria-hidden />
        <div className="float-orb two" aria-hidden />

        <div className="glow-shell">
          <Navbar />

          <header style={styles.header}>
            <div style={styles.badge}>Career navigation</div>
            <h1 style={styles.title}>Design your next move</h1>
            <p style={styles.subtitle}>
              A futuristic, calm space to create an account, log in, and uncover tailored
              career recommendations crafted around your strengths.
            </p>
          </header>

          <main style={styles.content}>
            <Routes>
              {/* User-facing routes */}
              <Route path="/" element={<Register />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/growth" element={<GrowthTracker />} />


              {/* Admin routes (no auth yet – optional later) */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/careers" element={<AdminCareers />} />
            </Routes>

          </main>
        </div>
      </div>
    </Router>
  );
}

const styles = {
  viewport: {
    minHeight: "100vh",
    background: theme.gradients.background,
  },
  header: {
    ...theme.glassPanel("26px"),
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    textAlign: "center",
    position: "relative",
    zIndex: 1,
    overflow: "hidden",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 14px",
    borderRadius: theme.radii.md,
    background: theme.gradients.glassEdge,
    border: `1px solid ${theme.colors.border}`,
    color: theme.colors.textSecondary,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    fontSize: "11px",
    fontWeight: 700,
  },
  title: {
    margin: "14px 0 8px",
    fontSize: "32px",
    letterSpacing: "0.2px",
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.headingWeight,
  },
  subtitle: {
    margin: 0,
    color: theme.colors.textSecondary,
    fontSize: "16px",
    maxWidth: "760px",
    marginLeft: "auto",
    marginRight: "auto",
    lineHeight: 1.6,
  },
  pills: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: theme.spacing.md,
  },
  pill: {
    padding: "8px 12px",
    borderRadius: theme.radii.md,
    background: "rgba(103, 232, 249, 0.1)",
    border: `1px solid ${theme.colors.border}`,
    color: theme.colors.textPrimary,
    fontSize: "13px",
    backdropFilter: `blur(${theme.blur.medium})`,
  },
  content: {
    position: "relative",
    zIndex: 1,
  },
};

export default App;