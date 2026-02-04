import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  // Existing State
  const [careers, setCareers] = useState([]);
  const [form, setForm] = useState({ 
    title: "", 
    description: "", 
    requiredSkills: "", 
    relatedInterests: ""
  });
  const [editingId, setEditingId] = useState(null);

  // NEW: State for Requests
  const [requests, setRequests] = useState([]);

  // Load all data (Careers + Requests)
  async function load() {
    try {
      const careersRes = await axios.get("/api/admin/careers");
      setCareers(careersRes.data.careers || []);

      const requestsRes = await axios.get("/api/admin/connection-requests");
      setRequests(requestsRes.data.requests || []);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // NEW: Handle Request Approval/Rejection
  async function updateRequestStatus(id, newStatus) {
    try {
      await axios.put(`/api/admin/connection-requests/${id}`, { status: newStatus });
      load(); // Refresh list
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Error updating request status");
    }
  }

  // Existing: Save (Create or Update)
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

  // Existing: Edit Mode Setup
  async function edit(career) {
    setEditingId(career._id);
    setForm({
      title: career.title,
      description: career.description,
      requiredSkills: (career.requiredSkills || []).join(", "),
      relatedInterests: (career.relatedInterests || []).join(", ")
    });
  }

  // Existing: Remove Career
  async function remove(id) {
    if (!window.confirm("Are you sure?")) return;
    await axios.delete(`/api/admin/careers/${id}`);
    load();
  }

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", padding: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>Admin Dashboard</h1>

      {/* NEW SECTION: Recruitment Requests */}
      <section style={{ marginBottom: "40px", padding: "20px", border: "2px solid #007bff", borderRadius: "10px", backgroundColor: "#f8faff" }}>
        <h2 style={{ marginTop: 0 }}>Pending Recruitment Requests</h2>
        {requests.filter(r => r.status === 'PENDING_ADMIN').length === 0 ? (
          <p>No pending requests.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", background: "white" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
                <th style={{ padding: "10px" }}>Employer</th>
                <th style={{ padding: "10px" }}>Target Employee</th>
                <th style={{ padding: "10px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.filter(r => r.status === 'PENDING_ADMIN').map(req => (
                <tr key={req._id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "10px" }}>{req.employerId?.companyName || req.employerId?.name || "Unknown"}</td>
                  <td style={{ padding: "10px" }}>{req.employeeId?.name || "Unknown"}</td>
                  <td style={{ padding: "10px" }}>
                    <button 
                      onClick={() => updateRequestStatus(req._id, 'PENDING_EMPLOYEE')}
                      style={{ marginRight: "10px", padding: "5px 10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => updateRequestStatus(req._id, 'REJECTED_BY_ADMIN')}
                      style={{ padding: "5px 10px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Existing Section: Add/Edit Career Form */}
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

        <button onClick={save} style={{ padding: "10px 20px", cursor: "pointer" }}>
          {editingId ? "Save Changes" : "Add Career"}
        </button>

        {editingId && (
          <button
            onClick={() => {
              setEditingId(null);
              setForm({ title: "", description: "", requiredSkills: "", relatedInterests: "" });
            }}
            style={{ padding: "10px 20px", marginLeft: "10px", cursor: "pointer" }}
          >
            Cancel
          </button>
        )}
      </div>

      {/* Existing Section: List Careers */}
      <h2>All Careers</h2>
      {careers.map((c) => (
        <div key={c._id} style={{ padding: "15px", border: "1px solid #ddd", marginBottom: "10px", borderRadius: "10px" }}>
          <h3>{c.title}</h3>
          <p>{c.description}</p>
          <p><strong>Skills:</strong> {(c.requiredSkills || []).join(", ")}</p>
          <p><strong>Interests:</strong> {(c.relatedInterests || []).join(", ")}</p>

          <button onClick={() => edit(c)} style={{ padding: "6px 12px", marginRight: "10px", cursor: "pointer" }}>
            Edit
          </button>
          <button onClick={() => remove(c._id)} style={{ padding: "6px 12px", cursor: "pointer" }}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}