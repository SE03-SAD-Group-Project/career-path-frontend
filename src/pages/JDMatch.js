import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../apiClient";
import theme from "../theme";

export default function JDMatch() {
  const navigate = useNavigate();

  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const scoreColor = useMemo(() => {
    const s = result?.matchScore ?? 0;
    if (s >= 80) return "rgba(34,197,94,0.18)";
    if (s >= 60) return "rgba(245,158,11,0.18)";
    return "rgba(239,68,68,0.18)";
  }, [result]);

  const runMatch = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      setError("Please paste both Resume Text and Job Description.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const res = await apiClient.post("/jd/match", {
        resumeText,
        jobDescription,
      });

      if (res.data?.ok) {
        setResult(res.data.result);
      } else {
        setError(res.data?.message || "Failed to match");
      }
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.h1}>Job Description Match</h1>
          <p style={styles.subtitle}>
            Paste your resume + a job description. AI returns match score, missing keywords, and tailored bullets.
          </p>
        </div>

        <button style={styles.btnGhost} onClick={() => navigate("/dashboard")}>
          ← Dashboard
        </button>
      </div>

      {!!error && <div style={styles.errorBox}>{error}</div>}

      <div style={styles.grid}>
        <div style={styles.card}>
          <h2 style={styles.h2}>Resume Text</h2>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume content here (plain text)."
            rows={12}
            style={styles.textarea}
          />
        </div>

        <div style={styles.card}>
          <h2 style={styles.h2}>Job Description</h2>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here."
            rows={12}
            style={styles.textarea}
          />
        </div>
      </div>

      <div style={styles.actionsRow}>
        <button
          style={styles.btnPrimary}
          onClick={runMatch}
          disabled={loading}
        >
          {loading ? "Matching…" : "Run JD Match"}
        </button>
      </div>

      {result && (
        <div style={styles.resultGrid}>
          <div style={{ ...styles.card, border: "1px solid rgba(255,255,255,0.10)" }}>
            <h2 style={styles.h2}>Match Score</h2>
            <div style={{ ...styles.scoreBox, background: scoreColor }}>
              <div style={styles.scoreNum}>{result.matchScore}%</div>
              <div style={styles.scoreSub}>ATS-style relevance</div>
            </div>
            <p style={styles.p}>{result.notes}</p>
          </div>
            {result?.ats && (
  <div style={styles.card}>
    <h2 style={styles.h2}>ATS Evaluation</h2>

    <div
      style={{
        ...styles.scoreBox,
        background:
          result.ats.verdict === "pass"
            ? "rgba(34,197,94,0.18)"
            : result.ats.verdict === "borderline"
            ? "rgba(245,158,11,0.18)"
            : "rgba(239,68,68,0.18)",
      }}
    >
      <div style={styles.scoreNum}>{result.ats.score}%</div>
      <div style={styles.scoreSub}>
        {result.ats.verdict.toUpperCase()}
      </div>
    </div>

    <p style={styles.p}>{result.ats.explanation}</p>

    <p style={{ marginTop: 10, fontWeight: 700 }}>
      Keyword Coverage: {result.ats.keywordCoverage}%
    </p>

    <h4 style={{ marginTop: 10 }}>Missing Sections</h4>
    <ul style={styles.list}>
      {result.ats.missingSections.length ? (
        result.ats.missingSections.map((s, i) => (
          <li key={i} style={styles.li}>{s}</li>
        ))
      ) : (
        <li style={styles.li}>No critical sections missing 🎉</li>
      )}
    </ul>
  </div>
)}

          <div style={styles.card}>
            <h2 style={styles.h2}>Strengths</h2>
            <ul style={styles.list}>
              {result.strengths.map((x, i) => <li key={i} style={styles.li}>{x}</li>)}
            </ul>
          </div>

          <div style={styles.card}>
            <h2 style={styles.h2}>Gaps</h2>
            <ul style={styles.list}>
              {result.gaps.map((x, i) => <li key={i} style={styles.li}>{x}</li>)}
            </ul>
          </div>

          <div style={styles.card}>
            <h2 style={styles.h2}>Missing Keywords</h2>
            <div style={styles.chipWrap}>
              {result.missingKeywords.map((k, i) => (
                <span key={i} style={styles.chip}>{k}</span>
              ))}
            </div>
          </div>

          <div style={styles.card}>
            <h2 style={styles.h2}>Tailored Bullet Points</h2>
            <ul style={styles.list}>
              {result.tailoredBulletPoints.map((x, i) => <li key={i} style={styles.li}>{x}</li>)}
            </ul>
          </div>

          <div style={styles.card}>
            <h2 style={styles.h2}>Priority Actions</h2>
            <ul style={styles.list}>
              {result.priorityActions.map((x, i) => <li key={i} style={styles.li}>{x}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: 24, maxWidth: 1200, margin: "0 auto" },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "flex-start",
    marginBottom: 18,
  },

  h1: { margin: 0, color: theme.colors.textPrimary, fontSize: 28, fontWeight: 900 },
  subtitle: { marginTop: 6, color: theme.colors.textSecondary, maxWidth: 820 },

  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 },
  resultGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 18 },

  card: { ...theme.glassPanel("24px"), padding: 20 },

  h2: { margin: "0 0 10px 0", color: theme.colors.textPrimary, fontSize: 18, fontWeight: 800 },
  p: { margin: 0, color: theme.colors.textSecondary, lineHeight: 1.6 },

  textarea: {
    width: "100%",
    padding: 14,
    borderRadius: theme.radii.md,
    border: `1px solid ${theme.colors.border}`,
    background: "rgba(255,255,255,0.03)",
    color: theme.colors.textPrimary,
    outline: "none",
    resize: "vertical",
  },

  actionsRow: { display: "flex", justifyContent: "flex-end", marginTop: 14 },

  btnPrimary: { ...theme.button("primary"), width: "fit-content" },
  btnGhost: { ...theme.button("ghost"), width: "fit-content" },

  scoreBox: {
    borderRadius: theme.radii.lg,
    border: "1px solid rgba(255,255,255,0.10)",
    padding: 16,
    marginBottom: 10,
    display: "grid",
    placeItems: "center",
    gap: 4,
  },
  scoreNum: { fontSize: 42, fontWeight: 900, color: theme.colors.textPrimary },
  scoreSub: { fontSize: 12, color: theme.colors.textSecondary },

  list: { margin: 0, paddingLeft: 18, color: theme.colors.textSecondary, display: "grid", gap: 8 },
  li: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: "10px 12px",
    borderRadius: theme.radii.md,
    listStylePosition: "inside",
  },

  chipWrap: { display: "flex", flexWrap: "wrap", gap: 8 },
  chip: {
    padding: "8px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: 700,
  },

  errorBox: {
    ...theme.glassPanel("18px"),
    padding: 14,
    marginBottom: 14,
    border: "1px solid rgba(239,68,68,0.35)",
    background: "rgba(239,68,68,0.08)",
    color: theme.colors.textPrimary,
  },
};
