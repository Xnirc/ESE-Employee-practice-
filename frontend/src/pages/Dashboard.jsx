import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Trash2 } from 'lucide-react';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async (query = '') => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const url = query 
        ? `${API_URL}/api/employees/search?department=${query}`
        : `${API_URL}/api/employees`;
      
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmployees(search);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.delete(`${API_URL}/api/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEmployees(search);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Employee Directory</h1>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', width: '300px' }}>
          <input 
            type="text" 
            placeholder="Search by Department..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginBottom: 0 }}
          />
          <button type="submit" style={{ padding: '0.75rem' }}><Search size={18} /></button>
        </form>
      </div>

      <div className="card glass">
        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading employees...</p>
        ) : employees.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--border-color)' }}>No employees found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Score</th>
                  <th>Exp (Yrs)</th>
                  <th>Skills</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => (
                  <tr key={emp._id}>
                    <td style={{ fontWeight: 500 }}>{emp.name}</td>
                    <td>{emp.email}</td>
                    <td><span className="badge">{emp.department}</span></td>
                    <td>
                      <span style={{ 
                        color: emp.performanceScore >= 80 ? 'var(--success-color)' : 
                               emp.performanceScore < 50 ? 'var(--danger-color)' : 'inherit'
                      }}>
                        {emp.performanceScore}/100
                      </span>
                    </td>
                    <td>{emp.experience}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                        {emp.skills.map((skill, idx) => (
                          <span key={idx} style={{ fontSize: '0.75rem', padding: '2px 6px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <button onClick={() => handleDelete(emp._id)} style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger-color)' }}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
