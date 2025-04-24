import React, { useState, useEffect } from "react";
import api from "../api/axios";

const EmployeeForm = ({ onSuccess, editingEmployee }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "", 
    department: "",
    position: "",
  });

  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    api.get("/departments?pagination[pageSize]=100").then((res) =>
      setDepartments(res.data.data)
    );
    api.get("/positions?pagination[pageSize]=100").then((res) =>
      setPositions(res.data.data)
    );
  }, []);

  useEffect(() => {
    if (editingEmployee) {
      setForm({
        name: editingEmployee.attributes.name,
        email: editingEmployee.attributes.email,
        department: editingEmployee.attributes.department.data?.id || "",
        position: editingEmployee.attributes.position.data?.id || "",
      });
      setShowForm(true);
    }
  }, [editingEmployee]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      data: {
        name: form.name,
        email: form.email,
        department: form.department,
        position: form.position,
      },
    };

    if (editingEmployee) {
      await api.put(`/employees/${editingEmployee.id}`, payload);
    } else {
      await api.post("/employees", payload);
    }

    setForm({ name: "", email: "", department: "", position: "" });
    setShowForm(false);
    onSuccess();
  };

  return (
    <div>
      <button 
        onClick={() => setShowForm(true)}
        style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          marginBottom: '20px'
        }}
      >
        Add Employee
      </button>

      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '400px'
          }}>
            <form onSubmit={handleSubmit}>
              <h2>{editingEmployee ? "Edit" : "Add"} Employee</h2>
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              />
              <select
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.attributes.name}
                  </option>
                ))}
              </select>
              <select
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              >
                <option value="">Select Position</option>
                {positions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.attributes.name}
                  </option>
                ))}
              </select>
              <div style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 16px',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  {editingEmployee ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeForm;
