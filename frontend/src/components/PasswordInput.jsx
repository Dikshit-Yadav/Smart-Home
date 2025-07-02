import React, { useState, useEffect } from 'react';
import zxcvbn from 'zxcvbn';
import '../style/PasswordInput.css'; 

function PasswordInput({ placeholder = "Enter password", onPasswordChange }) {
  const [password, setPassword] = useState('');
  const [score, setScore] = useState(0);

  const handleChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    setScore(zxcvbn(pwd).score);
    if (onPasswordChange) {
      onPasswordChange(pwd);
    }
  };

  const getStrengthLabel = (score) => {
    return ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][score];
  };

  return (
    <div className="password-strength-container">
      <input
        type="password"
        placeholder={placeholder}
        value={password}
        onChange={handleChange}
      />
      <div className="strength-bar">
        <div className={`bar strength-${score}`} />
      </div>
      <p className={`strength-text score-${score}`}>
        {getStrengthLabel(score)}
      </p>
    </div>
  );
}

export default PasswordInput;
