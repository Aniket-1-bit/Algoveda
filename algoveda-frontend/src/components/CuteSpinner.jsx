import React from 'react';
import '../styles/cute-spinner.css';

export const CuteSpinner = ({ size = 'md', message = '' }) => {
  return (
    <div className={`cute-spinner-container ${size}`}>
      <div className="cute-spinner"></div>
      {message && <div className="cute-spinner-message">{message}</div>}
    </div>
  );
};