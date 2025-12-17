import React from 'react';
import '../styles/cute-progress-bar.css';

export const CuteProgressBar = ({ percentage, label, color = 'primary' }) => {
  return (
    <div className="cute-progress-container">
      {label && <div className="progress-label">{label}</div>}
      <div className="cute-progress-bar">
        <div 
          className={`progress-fill ${color}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
      <div className="progress-percentage">{Math.round(percentage)}%</div>
    </div>
  );
};