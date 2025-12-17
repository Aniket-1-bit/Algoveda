import { useState, useEffect, useRef } from 'react';
import '../styles/study-timer.css';

export const StudyTimer = () => {
  const [time, setTime] = useState(0); // in seconds
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('study'); // 'study' or 'break'
  const intervalRef = useRef(null);
  
  // Study durations (in minutes)
  const studyDuration = 25; // 25 minutes
  const breakDuration = 5;  // 5 minutes

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          const maxTime = mode === 'study' ? studyDuration * 60 : breakDuration * 60;
          
          // If timer reaches zero, switch modes
          if (prevTime >= maxTime) {
            const newMode = mode === 'study' ? 'break' : 'study';
            setMode(newMode);
            return 0;
          }
          
          return prevTime + 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, mode]);

  const startTimer = () => {
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(0);
    setMode('study');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getMaxTime = () => {
    return mode === 'study' ? studyDuration * 60 : breakDuration * 60;
  };

  const progress = (time / getMaxTime()) * 100;

  return (
    <div className="study-timer">
      <div className="timer-display">
        <div className={`timer-mode ${mode}`}>
          {mode === 'study' ? '📚 Study Time' : '☕ Break Time'}
        </div>
        <div className="timer-time">{formatTime(time)}</div>
        <div className="timer-progress">
          <div 
            className="timer-progress-bar" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="timer-controls">
          {!isActive ? (
            <button className="btn-primary" onClick={startTimer}>
              Start
            </button>
          ) : (
            <button className="btn-secondary" onClick={pauseTimer}>
              Pause
            </button>
          )}
          <button className="btn-secondary" onClick={resetTimer}>
            Reset
          </button>
        </div>
      </div>
      
      <div className="timer-info">
        <p>
          {mode === 'study' 
            ? `Focus for ${studyDuration} minutes, then take a ${breakDuration}-minute break` 
            : `Take a ${breakDuration}-minute break to recharge`}
        </p>
      </div>
    </div>
  );
};