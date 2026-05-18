import { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkles, Loader2 } from 'lucide-react';

const AIRecommendation = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch employees for the dropdown
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token');
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${API_URL}/api/employees`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEmployees(res.data);
      } catch (err) {
        console.error("Error fetching employees", err);
      }
    };
    fetchEmployees();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setRecommendation('');
    
    try {
      const token = localStorage.getItem('token');
      const payload = selectedEmployee ? { employeeId: selectedEmployee } : {};
      
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${API_URL}/api/ai/recommend`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setRecommendation(res.data.recommendation);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate recommendation. The OpenRouter API might be unavailable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
          <Sparkles size={32} color="var(--accent-color)" />
          <h1 style={{ marginBottom: 0 }}>AI Performance Analytics</h1>
        </div>
        
        <div className="card glass">
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-color)', opacity: 0.8 }}>
            Select an employee to get personalized AI feedback, or leave blank to rank all employees and get general suggestions.
          </p>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <select 
              value={selectedEmployee} 
              onChange={(e) => setSelectedEmployee(e.target.value)}
              style={{ marginBottom: 0, flex: 1 }}
            >
              <option value="">-- All Employees (Ranking Mode) --</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>
                  {emp.name} ({emp.department}) - Score: {emp.performanceScore}
                </option>
              ))}
            </select>
            
            <button 
              onClick={handleGenerate} 
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
              Generate AI Report
            </button>
          </div>

          {error && <div className="error-message p-4 bg-red-900/20 rounded-lg">{error}</div>}

          {recommendation && (
            <div style={{ 
              background: 'rgba(15, 23, 42, 0.5)', 
              padding: '2rem', 
              borderRadius: '0.75rem',
              border: '1px solid var(--accent-color)'
            }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-color)', marginBottom: '1rem' }}>
                <Sparkles size={20} /> AI Recommendation Result
              </h3>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
                {recommendation}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIRecommendation;
