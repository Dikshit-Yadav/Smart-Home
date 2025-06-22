import React, { useState } from 'react';
import { loginUser } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import '../style/LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error(err);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className={`login-form ${shake ? 'shake' : ''}`} onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
        <button type="submit" disabled={loading}>
          {loading ? <span className="spinner"></span> : 'Login'}
        </button>
        <div className="register-link">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
        {success && <div className="success-overlay">Success!</div>}
      </form>
    </div>
  );
}

export default LoginPage;
