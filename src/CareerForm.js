import React, { useState } from "react";
import axios from "axios";

function CareerForm() {
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [workStyle, setWorkStyle] = useState("analytical");
  const [result, setResult] = useState(null);

  const submitCareerForm = async () => {
    try {
      const res = await axios.post(
        "https://career-path-backend-production.up.railway.app/api/careers/recommend",
        {
          skills: skills.toLowerCase().split(","),
          interests: interests.toLowerCase().split(","),
          workStyle,
        }
      );

      setResult(res.data.recommendedCareer);
    } catch (err) {
      alert("Error generating recommendation");
    }
  };

  return (
    <div style={{ marginTop: "40px", textAlign: "center" }}>
      <h2>Career Recommendation</h2>

      <input
        placeholder="Enter your skills (comma separated)"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
        style={{ padding: "10px", width: "300px", marginBottom: "10px" }}
      />

      <br />

      <input
        placeholder="Enter your interests (comma separated)"
        value={interests}
        onChange={(e) => setInterests(e.target.value)}
        style={{ padding: "10px", width: "300px", marginBottom: "10px" }}
      />

      <br />

      <select
        value={workStyle}
        onChange={(e) => setWorkStyle(e.target.value)}
        style={{ padding: "10px", width: "320px", marginBottom: "20px" }}
      >
        <option value="analytical">Analytical</option>
        <option value="creative">Creative</option>
        <option value="social">Social</option>
        <option value="technical">Technical</option>
      </select>

      <br />

      <button
        onClick={submitCareerForm}
        style={{
          padding: "12px 20px",
          background: "#3498db",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Get Recommendation
      </button>

      {result && (
        <h3 style={{ marginTop: "20px", color: "green" }}>
          Recommended Career: <strong>{result}</strong>
        </h3>
      )}
    </div>
  );
}

export default CareerForm;
