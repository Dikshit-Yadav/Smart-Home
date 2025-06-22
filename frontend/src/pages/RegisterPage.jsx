
import React, { useState } from 'react';
import { registerUser, verifyOtp } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import '../style/LoginPage.css';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);
  const [otpSent, setOtpSent] = useState(false); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!otpSent) {
        await registerUser(formData);
        setOtpSent(true);
        alert("OTP sent to your email. Please enter it below.");
      } else {
        await verifyOtp({ email: formData.email, otp });
        setSuccess(true);
        setTimeout(() => navigate('/'), 2000);
      }
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
        <h2>Register</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          required
          onChange={handleChange}
          disabled={otpSent}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          onChange={handleChange}
          disabled={otpSent}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
          disabled={otpSent}
        />

        {otpSent && (
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        )}

        <button type="submit" disabled={loading}>
          {loading ? <span className="spinner"></span> : (!otpSent ? 'Register' : 'Verify OTP')}
        </button>

        <div className="register-link">
          Already have an account? <Link to="/">Login</Link>
        </div>

        {success && <div className="success-overlay">Registered Successfully!</div>}
      </form>
    </div>
  );
}

export default RegisterPage;
