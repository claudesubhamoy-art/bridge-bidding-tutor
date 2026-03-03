import { useState } from 'react';

export default function ApiKeyPanel({ apiKey, onSaveKey, onClose }) {
  const [value, setValue] = useState(apiKey || '');
  const [showKey, setShowKey] = useState(false);

  function handleSave() {
    if (value.trim()) {
      onSaveKey(value.trim());
      onClose();
    }
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.title}>Anthropic API Key</div>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={styles.body}>
          <p style={styles.description}>
            This tutor uses Claude AI to evaluate your bids. Provide your Anthropic API key below.
            Your key is stored only in your browser's local storage — never sent anywhere except
            directly to the Anthropic API.
          </p>

          <a
            href="https://console.anthropic.com/account/keys"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.link}
          >
            Get your API key from console.anthropic.com →
          </a>

          <div style={styles.inputGroup}>
            <label style={styles.label}>API Key</label>
            <div style={styles.inputRow}>
              <input
                style={styles.input}
                type={showKey ? 'text' : 'password'}
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder="sk-ant-..."
                autoFocus
              />
              <button
                style={styles.toggleBtn}
                onClick={() => setShowKey(s => !s)}
                type="button"
              >
                {showKey ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div style={styles.note}>
            <strong>Privacy:</strong> Your key is saved in localStorage on this device only.
            Clear browser data to remove it.
          </div>
        </div>

        <div style={styles.footer}>
          <button className="btn-text" onClick={onClose}>Cancel</button>
          <button
            className="btn-gold"
            onClick={handleSave}
            disabled={!value.trim()}
          >
            Save Key
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: 16,
  },
  modal: {
    background: '#1a3a28',
    border: '1px solid rgba(200,168,75,0.3)',
    borderRadius: 14,
    width: '100%',
    maxWidth: 480,
    fontFamily: 'Georgia, serif',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(0,0,0,0.2)',
  },
  title: {
    color: '#c8a84b',
    fontSize: '1.1rem',
    fontWeight: 'bold',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: 'rgba(240,234,214,0.5)',
    fontSize: '1rem',
    cursor: 'pointer',
    padding: '2px 6px',
  },
  body: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  description: {
    color: 'rgba(240,234,214,0.8)',
    fontSize: '0.9rem',
    lineHeight: 1.6,
  },
  link: {
    color: '#c8a84b',
    fontSize: '0.85rem',
    textDecoration: 'none',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    color: 'rgba(240,234,214,0.7)',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  inputRow: {
    display: 'flex',
    gap: 8,
  },
  input: {
    flex: 1,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 8,
    padding: '10px 14px',
    color: '#f0ead6',
    fontSize: '0.9rem',
    fontFamily: 'monospace',
    outline: 'none',
  },
  toggleBtn: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 8,
    padding: '0 12px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  note: {
    background: 'rgba(0,0,0,0.2)',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: '0.8rem',
    color: 'rgba(240,234,214,0.55)',
    lineHeight: 1.5,
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 10,
    padding: '14px 20px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(0,0,0,0.15)',
  },
};
