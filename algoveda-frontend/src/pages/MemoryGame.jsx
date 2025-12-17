import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/memory-game.css';

export const MemoryGame = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // Card pairs with programming icons
  const cardPairs = [
    { id: 1, icon: '💻', name: 'Computer' },
    { id: 2, icon: '📱', name: 'Mobile' },
    { id: 3, icon: '🌐', name: 'Globe' },
    { id: 4, icon: '⌨️', name: 'Keyboard' },
    { id: 5, icon: '🖱️', name: 'Mouse' },
    { id: 6, icon: '🎧', name: 'Headphones' },
    { id: 7, icon: '💾', name: 'Floppy' },
    { id: 8, icon: '🔌', name: 'Plug' }
  ];

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    let interval;
    if (gameStarted && !gameOver) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameOver]);

  const initializeGame = () => {
    // Create pairs of cards
    const gameCards = [...cardPairs, ...cardPairs]
      .map((card, index) => ({
        ...card,
        uniqueId: index,
        flipped: false,
        matched: false
      }))
      .sort(() => Math.random() - 0.5);
    
    setCards(gameCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTimer(0);
    setGameOver(false);
    setGameStarted(false);
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const flipCard = (uniqueId) => {
    // Don't allow flipping if:
    // - Game hasn't started
    // - Two cards are already flipped
    // - Card is already flipped
    // - Card is already matched
    if (!gameStarted || flipped.length === 2 || flipped.includes(uniqueId) || matched.includes(uniqueId)) {
      return;
    }

    const newFlipped = [...flipped, uniqueId];
    setFlipped(newFlipped);

    // Check for match when two cards are flipped
    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      
      const firstCard = cards.find(card => card.uniqueId === newFlipped[0]);
      const secondCard = cards.find(card => card.uniqueId === newFlipped[1]);

      if (firstCard.id === secondCard.id) {
        // Match found
        setMatched([...matched, ...newFlipped]);
        setFlipped([]);
        
        // Check if game is complete
        if (matched.length + 2 === cards.length) {
          setTimeout(() => {
            setGameOver(true);
          }, 500);
        }
      } else {
        // No match, flip cards back after delay
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!gameStarted) {
    return (
      <div className="memory-game">
        <div className="game-intro">
          <h1>🧠 Memory Match</h1>
          <p>Find matching pairs of programming icons!</p>
          <div className="game-rules">
            <h3>How to Play:</h3>
            <ul>
              <li>Click on cards to flip them over</li>
              <li>Find two matching cards to make a pair</li>
              <li>Complete the game with as few moves as possible</li>
              <li>Try to finish as quickly as you can!</li>
            </ul>
          </div>
          <button className="btn-primary btn-large" onClick={startGame}>
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="memory-game">
      <div className="game-header">
        <div className="stats">
          <div className="stat">
            <span className="label">Time</span>
            <span className="value">{formatTime(timer)}</span>
          </div>
          <div className="stat">
            <span className="label">Moves</span>
            <span className="value">{moves}</span>
          </div>
          <div className="stat">
            <span className="label">Pairs</span>
            <span className="value">{matched.length / 2} / {cards.length / 2}</span>
          </div>
        </div>
      </div>

      {gameOver ? (
        <div className="game-over">
          <h2>🎉 Congratulations!</h2>
          <div className="results">
            <p>You completed the game in <strong>{formatTime(timer)}</strong></p>
            <p>With <strong>{moves}</strong> moves</p>
            <div className="rating">
              {moves <= 12 ? '⭐⭐⭐ Perfect!' : 
               moves <= 16 ? '⭐⭐ Great!' : 
               '⭐ Good job!'}
            </div>
          </div>
          <div className="game-actions">
            <button className="btn-primary" onClick={initializeGame}>
              Play Again
            </button>
            <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </button>
          </div>
        </div>
      ) : (
        <div className="game-board">
          <div className="cards-grid">
            {cards.map((card) => (
              <div
                key={card.uniqueId}
                className={`card ${
                  flipped.includes(card.uniqueId) || matched.includes(card.uniqueId) 
                    ? 'flipped' 
                    : ''
                } ${
                  matched.includes(card.uniqueId) 
                    ? 'matched' 
                    : ''
                }`}
                onClick={() => flipCard(card.uniqueId)}
              >
                <div className="card-inner">
                  <div className="card-front">❓</div>
                  <div className="card-back">{card.icon}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};