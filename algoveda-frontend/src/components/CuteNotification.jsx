import React, { useState, useEffect } from 'react';
import '../styles/cute-notification.css';

export const CuteNotification = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className={`cute-notification ${type} show`}>
      <div className="notification-content">
        {type === 'success' && '✅'}
        {type === 'error' && '❌'}
        {type === 'warning' && '⚠️'}
        {type === 'info' && 'ℹ️'}
        <span className="notification-message">{message}</span>
      </div>
      <button className="close-button" onClick={() => {
        setVisible(false);
        if (onClose) onClose();
      }}>
        ×
      </button>
    </div>
  );
};