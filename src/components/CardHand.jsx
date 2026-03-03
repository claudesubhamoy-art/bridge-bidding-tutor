import { groupBySuit, calcHCP } from '../data/lessons.js';

const SUIT_ORDER = ['S', 'H', 'D', 'C'];
const SUIT_META = {
  S: { symbol: '♠', label: 'Spades', color: '#d0e8ff' },
  H: { symbol: '♥', label: 'Hearts', color: '#ffd0d0' },
  D: { symbol: '♦', label: 'Diamonds', color: '#ffd0d0' },
  C: { symbol: '♣', label: 'Clubs', color: '#d0f0d8' },
};

export default function CardHand({ hand }) {
  const groups = groupBySuit(hand);
  const hcp = calcHCP(hand);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.title}>Your Hand</span>
        <span style={styles.hcp}>{hcp} HCP</span>
      </div>
      <div style={styles.suitGrid}>
        {SUIT_ORDER.map(suit => {
          const meta = SUIT_META[suit];
          const cards = groups[suit] || [];
          const isRed = suit === 'H' || suit === 'D';
          return (
            <div key={suit} style={styles.suitRow}>
              <span style={{ ...styles.suitSymbol, color: isRed ? '#c0392b' : '#1a2a3a' }}>
                {meta.symbol}
              </span>
              <div style={styles.cardsInSuit}>
                {cards.length === 0 ? (
                  <span style={styles.void}>—</span>
                ) : (
                  cards.map(rank => (
                    <span
                      key={`${rank}${suit}`}
                      style={{ ...styles.card, color: isRed ? '#c0392b' : '#1a2a3a' }}
                    >
                      {rank === 'T' ? '10' : rank}
                    </span>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: 'linear-gradient(145deg, #fffef8, #f5f0e0)',
    border: '2px solid #d0c8b0',
    borderRadius: 12,
    padding: '16px 20px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.8)',
    minWidth: 220,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottom: '1px solid #d0c8b0',
    paddingBottom: 8,
  },
  title: {
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#7a6a50',
    fontFamily: 'Georgia, serif',
  },
  hcp: {
    background: '#1a5c2e',
    color: '#e8c86b',
    borderRadius: 20,
    padding: '2px 10px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    fontFamily: 'Georgia, serif',
  },
  suitGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  suitRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  suitSymbol: {
    fontSize: '1.3rem',
    width: 24,
    textAlign: 'center',
    lineHeight: 1,
  },
  cardsInSuit: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 3,
  },
  card: {
    fontFamily: 'Georgia, serif',
    fontSize: '1.05rem',
    fontWeight: 'bold',
    background: 'rgba(255,255,255,0.6)',
    borderRadius: 4,
    padding: '1px 5px',
    border: '1px solid rgba(0,0,0,0.1)',
    lineHeight: 1.4,
  },
  void: {
    color: '#b0a080',
    fontStyle: 'italic',
    fontSize: '1rem',
  },
};
