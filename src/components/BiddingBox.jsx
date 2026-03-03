import { useState } from 'react';
import { normalizeBid } from '../utils/bridgeUtils.js';

const LEVELS = [1, 2, 3, 4, 5, 6, 7];
const SUITS = [
  { code: 'C', symbol: '♣', label: 'Clubs', color: '#1a2a3a', bg: '#d0f0d8' },
  { code: 'D', symbol: '♦', label: 'Diamonds', color: '#c0392b', bg: '#ffddd0' },
  { code: 'H', symbol: '♥', label: 'Hearts', color: '#c0392b', bg: '#ffd0d0' },
  { code: 'S', symbol: '♠', label: 'Spades', color: '#1a2a3a', bg: '#d0e8ff' },
  { code: 'N', symbol: 'NT', label: 'No Trump', color: '#5a3a1a', bg: '#fff0c0' },
];

export default function BiddingBox({ onSubmitBid, disabled = false }) {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [customInput, setCustomInput] = useState('');
  const [inputMode, setInputMode] = useState('box'); // 'box' or 'text'

  function handleSuitClick(suitCode) {
    if (!selectedLevel) return;
    const bid = `${selectedLevel}${suitCode}`;
    onSubmitBid(bid);
    setSelectedLevel(null);
  }

  function handleSpecial(bid) {
    onSubmitBid(bid);
    setSelectedLevel(null);
  }

  function handleTextSubmit(e) {
    e.preventDefault();
    const bid = normalizeBid(customInput);
    if (bid) {
      onSubmitBid(bid);
      setCustomInput('');
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.title}>Bidding Box</span>
        <button
          style={styles.modeToggle}
          onClick={() => setInputMode(m => m === 'box' ? 'text' : 'box')}
        >
          {inputMode === 'box' ? 'Type bid' : 'Use box'}
        </button>
      </div>

      {inputMode === 'text' ? (
        <form onSubmit={handleTextSubmit} style={styles.textForm}>
          <input
            style={styles.textInput}
            value={customInput}
            onChange={e => setCustomInput(e.target.value)}
            placeholder="e.g. 1NT, 2H, Pass, X"
            disabled={disabled}
            autoFocus
          />
          <button
            type="submit"
            className="btn-gold"
            disabled={disabled || !customInput.trim()}
          >
            Bid
          </button>
        </form>
      ) : (
        <div style={styles.boxLayout}>
          {/* Level buttons */}
          <div style={styles.levelsRow}>
            {LEVELS.map(level => (
              <button
                key={level}
                style={{
                  ...styles.levelBtn,
                  background: selectedLevel === level
                    ? 'linear-gradient(135deg, #c8a84b, #e8c86b)'
                    : 'rgba(255,255,255,0.08)',
                  color: selectedLevel === level ? '#1a2a3a' : '#f0ead6',
                  fontWeight: selectedLevel === level ? 'bold' : 'normal',
                  transform: selectedLevel === level ? 'scale(1.1)' : 'scale(1)',
                }}
                onClick={() => setSelectedLevel(level)}
                disabled={disabled}
              >
                {level}
              </button>
            ))}
          </div>

          {/* Suit buttons */}
          <div style={styles.suitsRow}>
            {SUITS.map(suit => (
              <button
                key={suit.code}
                style={{
                  ...styles.suitBtn,
                  background: suit.bg,
                  color: suit.color,
                  opacity: selectedLevel ? 1 : 0.45,
                  cursor: selectedLevel && !disabled ? 'pointer' : 'default',
                }}
                onClick={() => handleSuitClick(suit.code)}
                disabled={!selectedLevel || disabled}
                title={`${selectedLevel || '?'}${suit.label}`}
              >
                <span style={styles.suitSymbol}>{suit.symbol}</span>
              </button>
            ))}
          </div>

          {/* Instruction */}
          {!selectedLevel && (
            <div style={styles.hint}>Select a level, then a suit</div>
          )}
          {selectedLevel && (
            <div style={styles.hintActive}>Now choose a suit for {selectedLevel}...</div>
          )}

          {/* Special bids */}
          <div style={styles.specialRow}>
            <button
              style={{ ...styles.specialBtn, background: '#2d6a44', color: '#d0f0d8' }}
              onClick={() => handleSpecial('Pass')}
              disabled={disabled}
            >
              Pass
            </button>
            <button
              style={{ ...styles.specialBtn, background: '#7a2020', color: '#ffd0d0' }}
              onClick={() => handleSpecial('X')}
              disabled={disabled}
            >
              Dbl
            </button>
            <button
              style={{ ...styles.specialBtn, background: '#7a5520', color: '#ffe0c0' }}
              onClick={() => handleSpecial('XX')}
              disabled={disabled}
            >
              Rdbl
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    background: 'rgba(0,0,0,0.35)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 12,
    padding: '14px 16px',
    minWidth: 260,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: '#c8a84b',
    fontFamily: 'Georgia, serif',
  },
  modeToggle: {
    background: 'transparent',
    border: '1px solid rgba(200,168,75,0.4)',
    color: '#c8a84b',
    borderRadius: 6,
    padding: '3px 8px',
    fontSize: '0.7rem',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
  },
  boxLayout: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  levelsRow: {
    display: 'flex',
    gap: 6,
    justifyContent: 'center',
  },
  levelBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.15)',
    fontFamily: 'Georgia, serif',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'all 0.15s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  suitsRow: {
    display: 'flex',
    gap: 6,
    justifyContent: 'center',
  },
  suitBtn: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    border: '1px solid rgba(0,0,0,0.15)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.1s, box-shadow 0.1s',
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
  },
  suitSymbol: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    lineHeight: 1,
  },
  hint: {
    textAlign: 'center',
    fontSize: '0.75rem',
    color: 'rgba(240,234,214,0.4)',
    fontStyle: 'italic',
  },
  hintActive: {
    textAlign: 'center',
    fontSize: '0.75rem',
    color: '#c8a84b',
    fontStyle: 'italic',
  },
  specialRow: {
    display: 'flex',
    gap: 6,
    marginTop: 4,
  },
  specialBtn: {
    flex: 1,
    padding: '8px 0',
    borderRadius: 8,
    border: 'none',
    fontFamily: 'Georgia, serif',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
    transition: 'transform 0.1s',
  },
  textForm: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 8,
    padding: '8px 12px',
    color: '#f0ead6',
    fontSize: '1rem',
    fontFamily: 'Georgia, serif',
    outline: 'none',
  },
};
