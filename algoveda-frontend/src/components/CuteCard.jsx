import React from 'react';
import '../styles/cute-card.css';

export const CuteCard = ({ 
  children, 
  title, 
  icon, 
  className = '', 
  hoverEffect = true,
  ...props 
}) => {
  return (
    <div 
      className={`cute-card ${className} ${hoverEffect ? 'hover-effect' : ''}`} 
      {...props}
    >
      {(title || icon) && (
        <div className="card-header">
          {icon && <div className="card-icon">{icon}</div>}
          {title && <h3 className="card-title">{title}</h3>}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};