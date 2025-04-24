import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmployeeCRUD = () => {
  const [employees, setEmployees] = useState([]);
  const [employee, setEmployee] = useState({
    name: '',
    email: '',
    position: '',
    department: '',
    profilePicture: null
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setEmployee({ ...employee, profilePicture: e.target.files[0] });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, position, department } = employee;

    if (!name || !email || !position || !department) {
      alert('Please fill in all fields!');
      return;
    }

    if (isEditing) {
      const updated = employees.map((emp) =>
        emp.id === editId ? { ...emp, ...employee } : emp
      );
      setEmployees(updated);
      alert('Employee updated successfully!');
    } else {
      const newEmployee = {
        id: Date.now(),
        ...employee,
        profilePictureUrl: employee.profilePicture ? URL.createObjectURL(employee.profilePicture) : null
      };
      setEmployees([...employees, newEmployee]);
      
      try {
        await axios.post('/api/notifications/email', {
          to: newEmployee.email,
          subject: 'Welcome to Our Company!',
          text: `Hi ${newEmployee.name},\n\nWelcome to our company! Your employee profile has been created successfully.\n\nPosition: ${newEmployee.position}\nDepartment: ${newEmployee.department}\n\nBest regards,\nHR Team`
        });
        alert('Employee added successfully! Welcome email has been sent.');
      } catch (error) {
        console.error('Failed to send email notification:', error);
        alert('Employee added but failed to send welcome email.');
      }
    }

    setEmployee({ name: '', email: '', position: '', department: '', profilePicture: null });
    setIsEditing(false);
    setEditId(null);
  };

  const handleEdit = (emp) => {
    setEmployee({
      name: emp.name,
      email: emp.email,
      position: emp.position,
      department: emp.department,
      profilePicture: emp.profilePicture
    });
    setIsEditing(true);
    setEditId(emp.id);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this employee?');
    if (!confirmDelete) return;

    setEmployees(employees.filter((emp) => emp.id !== id));
    alert('Employee deleted successfully!');
  };

  // Calculate statistics
  const totalEmployees = employees.length;
  const departmentCounts = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {});
  const positionCounts = employees.reduce((acc, emp) => {
    acc[emp.position] = (acc[emp.position] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button 
          onClick={handleLogout}
          style={{
            padding: '6px 12px',
            backgroundColor: '#ff4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Logout
        </button>
      </div>

      {/* Dashboard Statistics */}
      <div style={{ marginBottom: '30px', backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
        <h2>
          <span style={{ marginRight: '10px' }}>📊</span>
          Dashboard Statistics
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3>
              <span style={{ marginRight: '8px' }}>👥</span>
              Total Employees
            </h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>{totalEmployees}</p>
          </div>
          
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3>
              <span style={{ marginRight: '8px' }}>🏢</span>
              Departments
            </h3>
            {Object.entries(departmentCounts).map(([dept, count]) => (
              <div key={dept} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                <span>{dept}:</span>
                <span>{count}</span>
              </div>
            ))}
          </div>

          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3>
              <span style={{ marginRight: '8px' }}>💼</span>
              Positions
            </h3>
            {Object.entries(positionCounts).map(([pos, count]) => (
              <div key={pos} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                <span>{pos}:</span>
                <span>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h2>{isEditing ? 'Edit Employee' : 'Add Employee'}</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="profilePicture">Profile Picture:</label>
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              accept="image/*"
              onChange={handleFileChange}
              style={{ marginLeft: '10px' }}
            />
          </div>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={employee.name}
            onChange={handleChange}
            style={{ flex: 1 }}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={employee.email}
            onChange={handleChange}
            style={{ flex: 1 }}
          />
          <input
            type="text"
            name="position"
            placeholder="Position"
            value={employee.position}
            onChange={handleChange}
            style={{ flex: 1 }}
          />
          <input
            type="text"
            name="department"
            placeholder="Department"
            value={employee.department}
            onChange={handleChange}
            style={{ flex: 1 }}
          />
          <button type="submit" style={{ flex: 0.5 }}>{isEditing ? 'Update' : 'Add'}</button>
        </div>
      </form>

      <h2 style={{ marginTop: '30px' }}>Employee List</h2>
      {employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {employees.map((emp) => (
            <li key={emp.id} style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
              {emp.profilePictureUrl && (
                <img 
                  src={emp.profilePictureUrl} 
                  alt={`${emp.name}'s profile`} 
                  style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                />
              )}
              <div>
                <strong>{emp.name}</strong> - {emp.position} ({emp.department})
                <br />
                <button onClick={() => handleEdit(emp)} style={{ marginRight: '10px' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(emp.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmployeeCRUD;
