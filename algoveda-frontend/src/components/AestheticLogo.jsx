import React from 'react';
import '../styles/aesthetic-logo.css';

export const AestheticLogo = ({ size = 'large' }) => {
  return (
    <div className={`aesthetic-logo-container ${size}`}>
      <div className="logo-wrapper">
        {/* Books stack representation */}
        <div className="books-stack">
          <div className="book book-1">
            <div className="book-spine"></div>
            <div className="book-pages"></div>
          </div>
          <div className="book book-2">
            <div className="book-spine"></div>
            <div className="book-pages"></div>
          </div>
          <div className="book book-3">
            <div className="book-spine"></div>
            <div className="book-pages"></div>
          </div>
        </div>
        
        {/* ALGOVEDA text with effects */}
        <div className="logo-text">
          <span className="logo-letter a">A</span>
          <span className="logo-letter l">L</span>
          <span className="logo-letter g">G</span>
          <span className="logo-letter o">O</span>
          <span className="logo-letter v">V</span>
          <span className="logo-letter e">E</span>
          <span className="logo-letter d">D</span>
          <span className="logo-letter a2">A</span>
        </div>
      </div>
      
      <div className="logo-tagline">Learning Through Innovation</div>
    </div>
  );
};