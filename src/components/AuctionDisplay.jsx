import { formatAuctionBid, getSuitColor, SUIT_SYMBOLS } from '../utils/bridgeUtils.js';

const PLAYERS = ['West', 'North', 'East', 'South'];
const SUITS_RE = /([♠♥♦♣]|NT)/g;

function colorBid(bidStr) {
  if (!bidStr) return null;
  if (bidStr === 'Pass') return <span style={{ color: '#6a9' }}>Pass</span>;
  if (bidStr === 'X') return <span style={{ color: '#e67' }}>X</span>;
  if (bidStr === 'XX') return <span style={{ color: '#e96' }}>XX</span>;

  // Color the suit symbol
  const level = bidStr[0];
  const suitCode = bidStr.slice(1);
  const symbol = SUIT_SYMBOLS[suitCode] || suitCode;
  const isRed = suitCode === 'H' || suitCode === 'D';
  const color = isRed ? '#c0392b' : '#1a2a3a';

  return (
    <span style={{ fontWeight: 'bold' }}>
      {level}<span style={{ color }}>{symbol}</span>
    </span>
  );
}

export default function AuctionDisplay({ auction, yourSeat = 'South', pendingBid = null }) {
  // Build the grid: rows of 4 (W, N, E, S)
  // Determine starting position based on dealer
  const seatIndex = PLAYERS.indexOf(yourSeat);

  // Convert flat auction to grid rows
  // auction: [{player: 'Partner', bid: '1H'}, {player: 'You', bid: '2C'}, ...]
  // We simplify and just show a linear sequence with player labels
  const entries = [
    ...auction,
    ...(pendingBid ? [{ player: 'You', bid: pendingBid, pending: true }] : []),
  ];

  if (entries.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>Auction</div>
        <div style={styles.empty}>No bids yet</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>Auction</div>
      <div style={styles.table}>
        {/* Header row */}
        <div style={styles.colHeader}>Player</div>
        <div style={styles.colHeader}>Bid</div>
        {/* Entries */}
        {entries.map((entry, i) => (
          <>
            <div
              key={`p-${i}`}
              style={{
                ...styles.cell,
                ...styles.playerCell,
                opacity: entry.pending ? 0.6 : 1,
                fontStyle: entry.pending ? 'italic' : 'normal',
              }}
            >
              {entry.player}
            </div>
            <div
              key={`b-${i}`}
              style={{
                ...styles.cell,
                ...styles.bidCell,
                opacity: entry.pending ? 0.6 : 1,
                background: entry.pending ? 'rgba(200,168,75,0.15)' : 'transparent',
              }}
            >
              {entry.bid ? colorBid(entry.bid) : '?'}
            </div>
          </>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 10,
    padding: '14px 18px',
    minWidth: 180,
  },
  header: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: '#c8a84b',
    marginBottom: 10,
    fontFamily: 'Georgia, serif',
  },
  table: {
    display: 'grid',
    gridTemplateColumns: '90px 1fr',
    gap: '4px 0',
  },
  colHeader: {
    fontSize: '0.7rem',
    color: 'rgba(240,234,214,0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    paddingBottom: 4,
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    marginBottom: 4,
  },
  cell: {
    padding: '3px 0',
    fontSize: '1rem',
    fontFamily: 'Georgia, serif',
    color: '#f0ead6',
  },
  playerCell: {
    fontSize: '0.85rem',
    color: 'rgba(240,234,214,0.7)',
  },
  bidCell: {
    fontWeight: 'bold',
    borderRadius: 4,
    paddingLeft: 6,
  },
  empty: {
    color: 'rgba(240,234,214,0.4)',
    fontStyle: 'italic',
    fontSize: '0.9rem',
  },
};
