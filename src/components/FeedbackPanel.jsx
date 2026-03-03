import { formatAuctionBid } from '../utils/bridgeUtils.js';

export default function FeedbackPanel({ feedback, isLoading, isCorrect, correctBid, onNext }) {
  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.spinner} />
          <span>Analysing your bid...</span>
        </div>
      </div>
    );
  }

  if (!feedback) return null;

  // Parse structured feedback sections
  const sections = parseFeedback(feedback);

  return (
    <div
      style={{
        ...styles.container,
        borderColor: isCorrect ? 'rgba(80,200,120,0.4)' : 'rgba(200,80,80,0.4)',
      }}
      className="animate-slide-up"
    >
      {/* Verdict banner */}
      <div
        style={{
          ...styles.verdict,
          background: isCorrect
            ? 'linear-gradient(135deg, #1a5c2e, #226b38)'
            : 'linear-gradient(135deg, #5c1a1a, #6b2222)',
          borderBottom: isCorrect
            ? '1px solid rgba(80,200,120,0.3)'
            : '1px solid rgba(200,80,80,0.3)',
        }}
      >
        <span style={styles.verdictIcon}>{isCorrect ? '✓' : '✗'}</span>
        <span style={styles.verdictText}>
          {isCorrect ? 'Correct!' : `Not quite — the bid is ${formatAuctionBid(correctBid)}`}
        </span>
      </div>

      {/* Feedback content */}
      <div style={styles.content}>
        {sections.map((section, i) => (
          <div key={i} style={styles.section}>
            {section.title && (
              <div style={styles.sectionTitle}>{section.title}</div>
            )}
            <div style={styles.sectionText}>{section.text}</div>
          </div>
        ))}
      </div>

      {/* Next button */}
      <div style={styles.footer}>
        <button className="btn-gold" onClick={onNext} style={styles.nextBtn}>
          Next Hand →
        </button>
      </div>
    </div>
  );
}

function parseFeedback(text) {
  if (!text) return [];

  // Split on labelled sections
  const sectionLabels = [
    'VERDICT:', 'WHAT HAPPENED:', 'KEY PRINCIPLE:', 'CORRECT BID:', 'WHY', 'NEXT STEPS:',
  ];

  const lines = text.split('\n').filter(l => l.trim());
  const sections = [];
  let currentSection = null;

  for (const line of lines) {
    const trimmed = line.trim();
    const matchedLabel = sectionLabels.find(label => trimmed.toUpperCase().startsWith(label));

    if (matchedLabel) {
      if (currentSection) sections.push(currentSection);
      const titleEnd = trimmed.indexOf(':') + 1;
      const title = trimmed.slice(0, titleEnd).replace(':', '').trim();
      const rest = trimmed.slice(titleEnd).trim();
      currentSection = { title: title === 'VERDICT' ? null : title, text: rest };
    } else if (currentSection) {
      currentSection.text += (currentSection.text ? ' ' : '') + trimmed;
    } else {
      sections.push({ title: null, text: trimmed });
    }
  }
  if (currentSection) sections.push(currentSection);

  // Filter out the VERDICT section (shown in banner)
  return sections.filter(s => s.title !== null || !s.text.match(/^(CORRECT|INCORRECT)$/i));
}

const styles = {
  container: {
    background: 'rgba(0,0,0,0.4)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '20px 24px',
    color: 'rgba(240,234,214,0.7)',
    fontStyle: 'italic',
    fontFamily: 'Georgia, serif',
  },
  spinner: {
    width: 20,
    height: 20,
    border: '2px solid rgba(200,168,75,0.3)',
    borderTopColor: '#c8a84b',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  verdict: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 20px',
  },
  verdictIcon: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
  },
  verdictText: {
    fontFamily: 'Georgia, serif',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#f0ead6',
  },
  content: {
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  sectionTitle: {
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#c8a84b',
    fontFamily: 'Georgia, serif',
  },
  sectionText: {
    fontSize: '0.95rem',
    lineHeight: 1.6,
    color: '#f0ead6',
    fontFamily: 'Georgia, serif',
  },
  footer: {
    padding: '0 20px 16px',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  nextBtn: {
    minWidth: 130,
  },
};
