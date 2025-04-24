import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [employee, setEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '', 
    position: '',
    department: '',
    hireDate: '',
    status: 'Active',
    profilePicture: null
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setEmployee({ ...employee, profilePicture: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, position, department, hireDate, status } = employee;

    if (!firstName || !lastName || !email || !position || !department || !hireDate || !status) {
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
      alert('Employee added ');
    }

    setEmployee({ firstName: '', lastName: '', email: '', position: '', department: '', hireDate: '', status: 'Active', profilePicture: null });
    setIsEditing(false);
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (emp) => {
    setEmployee({
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      position: emp.position,
      department: emp.department,
      hireDate: emp.hireDate,
      status: emp.status,
      profilePicture: emp.profilePicture
    });
    setIsEditing(true);
    setEditId(emp.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this employee?');
    if (!confirmDelete) return;
    setEmployees(employees.filter((emp) => emp.id !== id));
    alert('Employee deleted successfully!');
  };

  const exportToCSV = () => {
    const headers = ['First Name', 'Last Name', 'Email', 'Position', 'Department', 'Hire Date', 'Status'];
    const rows = employees.map(emp => [
      emp.firstName.replace(/,/g, ''),
      emp.lastName.replace(/,/g, ''),
      emp.email.replace(/,/g, ''),
      emp.position.replace(/,/g, ''),
      emp.department.replace(/,/g, ''),
      emp.hireDate,
      emp.status
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `employees_${new Date().toLocaleDateString()}.csv`;
    link.click();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Employee List", 14, 22);

    const headers = [["First Name", "Last Name", "Email", "Position", "Department", "Hire Date", "Status"]];
    const data = employees.map(emp => [emp.firstName, emp.lastName, emp.email, emp.position, emp.department, emp.hireDate, emp.status]);

    autoTable(doc, {
      head: headers,
      body: data,
      startY: 30
    });

    doc.save('employees.pdf');
  };

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
    <div className="dashboard-container">
      <div className="main-content">
        {/* Dashboard Statistics */}
        <div className="stats-container">
          <h2 className="stats-title">📊 Dashboard Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>👥 Total Employees</h3>
              <p className="stat-number">{totalEmployees}</p>
            </div>
            
            <div className="stat-card">
              <h3>🏢 Departments</h3>
              {Object.entries(departmentCounts).map(([dept, count]) => (
                <div key={dept} className="stat-row">
                  <span>{dept}:</span>
                  <span>{count}</span>
                </div>
              ))}
            </div>

            <div className="stat-card">
              <h3>💼 Positions</h3>
              {Object.entries(positionCounts).map(([pos, count]) => (
                <div key={pos} className="stat-row">
                  <span>{pos}:</span>
                  <span>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button onClick={() => setShowForm(true)} className="add-employee-button">
          Add Employee
        </button>

        {showForm && (
          <div className="form-container">
            <h2>{isEditing ? 'Edit Employee' : 'Add Employee'}</h2>

            <form onSubmit={handleSubmit} className="employee-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="firstName">First Name:</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="First Name"
                    value={employee.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name:</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Last Name"
                    value={employee.lastName}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    value={employee.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="position">Position:</label>
                  <input
                    type="text"
                    id="position" 
                    name="position"
                    placeholder="Position"
                    value={employee.position}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="department">Department:</label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    placeholder="Department"
                    value={employee.department}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="hireDate">Hire Date:</label>
                  <input
                    type="date"
                    id="hireDate"
                    name="hireDate"
                    value={employee.hireDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="status">Status:</label>
                  <select
                    id="status"
                    name="status"
                    value={employee.status}
                    onChange={handleChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="profilePicture">Profile Picture:</label>
                  <input
                    type="file"
                    id="profilePicture"
                    name="profilePicture"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <div className="form-buttons">
                <button type="submit" className="submit-button">{isEditing ? 'Update' : 'Add'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="cancel-button">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <h2 className="employee-list-title">Employee List</h2>

        <div className="export-buttons">
          <button onClick={exportToCSV} className="export-button">Export CSV</button>
          <button onClick={exportToPDF} className="export-button">Export PDF</button>
        </div>

        {employees.length === 0 ? (
          <p className="no-employees">No employees found.</p>
        ) : (
          <ul className="employee-list">
            {employees.map((emp) => (
              <li key={emp.id} className="employee-card">
                {emp.profilePictureUrl && (
                  <img 
                    src={emp.profilePictureUrl} 
                    alt={`${emp.firstName}'s profile`} 
                    className="profile-picture"
                  />
                )}
                <div className="employee-info">
                  <div className="employee-details">
                    <strong>{emp.firstName} {emp.lastName}</strong> - {emp.position} ({emp.department})
                    <br />
                    <small>Hire Date: {emp.hireDate} | Status: {emp.status}</small>
                  </div>
                  <div className="employee-actions">
                    <button onClick={() => handleEdit(emp)} className="edit-button">Edit</button>
                    <button onClick={() => handleDelete(emp.id)} className="delete-button">Delete</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <style jsx>{`
        .dashboard-container {
          min-height: 100vh;
          background-color: #f8f9fa;
          position: relative;
        }

        .main-content {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .stats-container {
          margin-bottom: 30px;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .stats-title {
          text-align: center;
          color: #2c3e50;
          margin-bottom: 20px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .stat-card {
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          text-align: center;
        }

        .stat-number {
          font-size: 24px;
          font-weight: bold;
          color: #007bff;
        }

        .stat-row {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
          padding: 0 10px;
        }

        .add-employee-button {
          padding: 12px 24px;
          background-color: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-bottom: 20px;
          transition: background-color 0.3s;
        }

        .add-employee-button:hover {
          background-color: #218838;
        }

        .form-container {
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: 30px;
        }

        .employee-form {
          max-width: 1000px;
          margin: 0 auto;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          margin-bottom: 5px;
          color: #495057;
        }

        .form-group input,
        .form-group select {
          padding: 8px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 14px;
        }

        .form-buttons {
          display: flex;
          gap: 10px;
          justify-content: center;
        }

        .submit-button,
        .cancel-button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .submit-button {
          background-color: #007bff;
          color: white;
        }

        .submit-button:hover {
          background-color: #0056b3;
        }

        .cancel-button {
          background-color: #6c757d;
          color: white;
        }

        .cancel-button:hover {
          background-color: #545b62;
        }

        .employee-list-title {
          color: #2c3e50;
          margin: 30px 0 20px;
        }

        .export-buttons {
          margin: 20px 0;
        }

        .export-button {
          padding: 8px 16px;
          margin-right: 10px;
          background-color: #6c757d;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .export-button:hover {
          background-color: #545b62;
        }

        .employee-list {
          list-style: none;
          padding: 0;
        }

        .employee-card {
          background-color: #ffffff;
          padding: 15px;
          margin-bottom: 15px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .profile-picture {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
        }

        .employee-info {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .employee-details {
          font-size: 14px;
        }

        .employee-actions {
          display: flex;
          gap: 10px;
        }

        .edit-button,
        .delete-button {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .edit-button {
          background-color: #ffc107;
          color: #000;
        }

        .edit-button:hover {
          background-color: #e0a800;
        }

        .delete-button {
          background-color: #dc3545;
          color: white;
        }

        .delete-button:hover {
          background-color: #c82333;
        }

        .no-employees {
          text-align: center;
          color: #6c757d;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
