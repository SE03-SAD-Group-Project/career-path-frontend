const theme = {
  colors: {
    background: "#050915",
    surface: "rgba(255, 255, 255, 0.06)",
    surfaceAlt: "rgba(255, 255, 255, 0.08)",
    border: "rgba(255, 255, 255, 0.12)",
    textPrimary: "#e9ecf5",
    textSecondary: "#b8c2d6",
    accent: "#67e8f9",
    accentStrong: "#7c3aed",
    success: "#34d399",
    danger: "#f87171",
  },
  gradients: {
    background:
      "radial-gradient(circle at 20% 20%, rgba(76, 0, 255, 0.18), transparent 28%),\n       radial-gradient(circle at 80% 0%, rgba(14, 165, 233, 0.16), transparent 30%),\n       radial-gradient(circle at 50% 90%, rgba(16, 185, 129, 0.12), transparent 22%),\n       linear-gradient(140deg, #050915, #070d1d 45%, #041024)",
    glassEdge: "linear-gradient(135deg, rgba(103, 232, 249, 0.16), rgba(124, 58, 237, 0.12))",
    primary: "linear-gradient(135deg, #67e8f9, #7c3aed)",
    secondary: "linear-gradient(135deg, #34d399, #0ea5e9)",
    danger: "linear-gradient(135deg, #f87171, #fb923c)",
  },
  radii: {
    xl: "24px",
    lg: "18px",
    md: "14px",
    sm: "12px",
  },
  shadows: {
    soft: "0 18px 50px rgba(5, 12, 30, 0.45)",
    glow: "0 12px 40px rgba(103, 232, 249, 0.25)",
    inner: "inset 0 1px 0 rgba(255,255,255,0.06)",
  },
  blur: {
    heavy: "18px",
    medium: "12px",
  },
  spacing: {
    xs: "8px",
    sm: "12px",
    md: "16px",
    lg: "20px",
    xl: "28px",
  },
  typography: {
    fontFamily: "'Inter', 'Space Grotesk', system-ui, -apple-system, sans-serif",
    headingWeight: 800,
    bodyWeight: 500,
    letter: "0.2px",
  },
  motion: {
    hover: "all 200ms ease",
    card: "transform 320ms ease, box-shadow 320ms ease",
  },
  glassPanel(padding = "20px") {
    return {
      background: this.colors.surface,
      borderRadius: this.radii.xl,
      padding,
      border: `1px solid ${this.colors.border}`,
      backdropFilter: `blur(${this.blur.heavy})`,
      boxShadow: `${this.shadows.soft}, ${this.shadows.inner}`,
    };
  },
  button(kind = "primary") {
    const palette = {
      primary: this.gradients.primary,
      secondary: this.gradients.secondary,
      danger: this.gradients.danger,
    };
    return {
      backgroundImage: palette[kind] || palette.primary,
      color: "#0b1224",
      border: "none",
      borderRadius: this.radii.md,
      padding: "14px 16px",
      fontWeight: 700,
      letterSpacing: this.typography.letter,
      cursor: "pointer",
      boxShadow: this.shadows.glow,
      transition: this.motion.hover,
    };
  },
  input() {
    return {
      width: "100%",
      padding: "12px 14px",
      borderRadius: this.radii.md,
      border: `1px solid ${this.colors.border}`,
      background: this.colors.surfaceAlt,
      color: this.colors.textPrimary,
      outline: "none",
      transition: this.motion.hover,
    };
  },
};

export default theme;