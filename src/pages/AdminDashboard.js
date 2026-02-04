import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [careers, setCareers] = useState([]);
  const [form, setForm] = useState({ 
    title: "", 
    description: "", 
    requiredSkills: "", 
    relatedInterests: ""
  });
  const [editingId, setEditingId] = useState(null);

  async function load() {
    const res = await axios.get("/api/admin/careers");
    setCareers(res.data.careers);
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    const payload = {
      title: form.title,
      description: form.description,
      requiredSkills: form.requiredSkills.split(",").map(s => s.trim()),
      relatedInterests: form.relatedInterests.split(",").map(s => s.trim())
    };

    if (editingId) {
      await axios.put(`/api/admin/careers/${editingId}`, payload);
      setEditingId(null);
    } else {
      await axios.post("/api/admin/careers", payload);
    }

    setForm({ title: "", description: "", requiredSkills: "", relatedInterests: "" });
    load();
  }

  async function edit(career) {
    setEditingId(career._id);
    setForm({
      title: career.title,
      description: career.description,
      requiredSkills: (career.requiredSkills || []).join(", "),
      relatedInterests: (career.relatedInterests || []).join(", ")
    });
  }

  async function remove(id) {
    if (!window.confirm("Are you sure?")) return;
    await axios.delete(`/api/admin/careers/${id}`);
    load();
  }

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", padding: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>Admin Dashboard</h1>

      <div style={{ marginBottom: "30px", padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
        <h2>{editingId ? "Edit Career" : "Add New Career"}</h2>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          style={{ width: "100%", marginBottom: "10px", padding: "10px" }}
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={{ width: "100%", marginBottom: "10px", padding: "10px" }}
        />
        <input
          placeholder="Required skills (comma separated)"
          value={form.requiredSkills}
          onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })}
          style={{ width: "100%", marginBottom: "10px", padding: "10px" }}
        />
        <input
          placeholder="Related interests (comma separated)"
          value={form.relatedInterests}
          onChange={(e) => setForm({ ...form, relatedInterests: e.target.value })}
          style={{ width: "100%", marginBottom: "10px", padding: "10px" }}
        />

        <button onClick={save} style={{ padding: "10px 20px" }}>
          {editingId ? "Save Changes" : "Add Career"}
        </button>

        {editingId && (
          <button
            onClick={() => {
              setEditingId(null);
              setForm({ title: "", description: "", requiredSkills: "", relatedInterests: "" });
            }}
            style={{ padding: "10px 20px", marginLeft: "10px" }}
          >
            Cancel
          </button>
        )}
      </div>

      <h2>All Careers</h2>
      {careers.map((c) => (
        <div key={c._id} style={{ padding: "15px", border: "1px solid #ddd", marginBottom: "10px", borderRadius: "10px" }}>
          <h3>{c.title}</h3>
          <p>{c.description}</p>
          <p><strong>Skills:</strong> {(c.requiredSkills || []).join(", ")}</p>
          <p><strong>Interests:</strong> {(c.relatedInterests || []).join(", ")}</p>

          <button onClick={() => edit(c)} style={{ padding: "6px 12px", marginRight: "10px" }}>
            Edit
          </button>
          <button onClick={() => remove(c._id)} style={{ padding: "6px 12px" }}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
