import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "./apiClient";
import theme from "./theme";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient.post("/users/login", formData);

      if (res.data.message === "Login successful") {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/dashboard");
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Error logging in");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card} className="card-animate">
        <div style={styles.cardHeader}>
          <p style={styles.badge}>Welcome back</p>
          <h2 style={styles.title}>Log in to continue</h2>
          <p style={styles.lead}>Access saved preferences and generate fresh guidance.</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Email
            <input
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Password
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
            />
          </label>

          <button type="submit" style={styles.button} className="button-hover">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    padding: "10px 0 40px",
  },
  card: {
    ...theme.glassPanel("28px"),
    width: "400px",
    color: theme.colors.textPrimary,
    position: "relative",
  },
  cardHeader: {
    textAlign: "left",
    marginBottom: theme.spacing.md,
  },
  title: {
    color: theme.colors.textPrimary,
    margin: "6px 0 6px",
    fontSize: "24px",
    letterSpacing: "0.2px",
  },
  lead: {
    margin: 0,
    color: theme.colors.textSecondary,
    fontSize: "14px",
    lineHeight: 1.5,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    borderRadius: theme.radii.md,
    background: theme.gradients.glassEdge,
    border: `1px solid ${theme.colors.border}`,
    color: theme.colors.textSecondary,
    fontSize: "12px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  form: {
    display: "grid",
    gap: theme.spacing.sm,
  },
  label: {
    display: "grid",
    gap: theme.spacing.xs,
    textAlign: "left",
    fontSize: "14px",
    color: theme.colors.textPrimary,
    letterSpacing: theme.typography.letter,
  },
  input: {
    ...theme.input(),
  },
  button: {
    ...theme.button("primary"),
    width: "100%",
    marginTop: theme.spacing.xs,
    color: "#041024",
  },
};

export default Login;