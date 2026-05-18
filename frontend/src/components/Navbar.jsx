import { Link } from 'react-router-dom';
import { LogOut, Home, UserPlus, Sparkles } from 'lucide-react';

const Navbar = ({ isAuthenticated, onLogout }) => {
  return (
    <nav className="navbar glass">
      <div className="logo">
        <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={24} color="var(--primary-color)" />
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>AI Nexus</h2>
        </Link>
      </div>
      <div className="nav-links">
        {isAuthenticated ? (
          <>
            <Link to="/"><Home size={18} /> Dashboard</Link>
            <Link to="/add-employee"><UserPlus size={18} /> Add Employee</Link>
            <Link to="/ai-recommendation"><Sparkles size={18} /> AI Analytics</Link>
            <button onClick={onLogout} style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: '1px solid var(--border-color)' }}>
              <LogOut size={18} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
