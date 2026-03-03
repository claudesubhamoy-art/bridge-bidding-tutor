import { useState, useCallback } from 'react';
import Anthropic from '@anthropic-ai/sdk';
import { LESSONS, ALL_SCENARIOS, getLesson } from './data/lessons.js';
import { useProgress } from './hooks/useProgress.js';
import { bidsMatch, buildJudgePrompt, formatAuctionBid } from './utils/bridgeUtils.js';
import CardHand from './components/CardHand.jsx';
import AuctionDisplay from './components/AuctionDisplay.jsx';
import BiddingBox from './components/BiddingBox.jsx';
import FeedbackPanel from './components/FeedbackPanel.jsx';
import LessonSelector from './components/LessonSelector.jsx';
import ApiKeyPanel from './components/ApiKeyPanel.jsx';

// ── State helpers ─────────────────────────────────────────────────────────────
function getApiKey() {
  return localStorage.getItem('bridge_api_key') || '';
}
function saveApiKey(key) {
  localStorage.setItem('bridge_api_key', key);
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState('home'); // 'home' | 'lesson' | 'scenario'
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [apiKey, setApiKey] = useState(getApiKey);
  const [showApiPanel, setShowApiPanel] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [userBid, setUserBid] = useState(null);
  const [streamText, setStreamText] = useState('');
  const { recordAttempt, getLessonStats } = useProgress();

  const lesson = selectedLessonId ? getLesson(selectedLessonId) : null;
  const scenario = lesson ? lesson.scenarios[scenarioIndex] : null;

  // ── Navigation ──────────────────────────────────────────────────────────────
  function handleSelectLesson(lessonId) {
    setSelectedLessonId(lessonId);
    setScenarioIndex(0);
    setFeedback(null);
    setUserBid(null);
    setStreamText('');
    setView('lesson');
  }

  function handleNextScenario() {
    if (!lesson) return;
    const next = scenarioIndex + 1;
    if (next < lesson.scenarios.length) {
      setScenarioIndex(next);
      setFeedback(null);
      setUserBid(null);
      setStreamText('');
    } else {
      // Lesson complete
      setView('lesson-complete');
    }
  }

  function handleBackHome() {
    setView('home');
    setSelectedLessonId(null);
    setFeedback(null);
    setUserBid(null);
  }

  // ── Bid submission ──────────────────────────────────────────────────────────
  const handleSubmitBid = useCallback(async (bid) => {
    if (!scenario || isLoading) return;
    setUserBid(bid);
    setFeedback(null);
    setStreamText('');

    const correct = bidsMatch(bid, scenario.correctBid);
    setIsCorrect(correct);
    recordAttempt(scenario.id, correct);

    // If no API key, fall back to static explanation
    if (!apiKey) {
      setFeedback(correct
        ? `CORRECT!\n\nWHAT HAPPENED: Well done — ${formatAuctionBid(bid)} is exactly right.\n\nKEY PRINCIPLE: ${scenario.correctExplanation}`
        : `INCORRECT.\n\nWHAT HAPPENED: ${formatAuctionBid(bid)} is not the best bid here.\n\nKEY PRINCIPLE: ${scenario.correctExplanation}\n\nCORRECT BID: ${formatAuctionBid(scenario.correctBid)}\n\nWHY ${formatAuctionBid(scenario.correctBid)}: ${scenario.correctExplanation}`
      );
      return;
    }

    // AI evaluation
    setIsLoading(true);
    try {
      const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
      const prompt = buildJudgePrompt(scenario, formatAuctionBid(bid), scenario.hand);

      let fullText = '';
      const stream = await client.messages.stream({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        messages: [{ role: 'user', content: prompt }],
      });

      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          fullText += chunk.delta.text;
          setStreamText(fullText);
        }
      }
      setFeedback(fullText);
    } catch (err) {
      console.error('API error:', err);
      // Graceful fallback
      const fallback = correct
        ? `CORRECT!\n\nWHAT HAPPENED: ${formatAuctionBid(bid)} is exactly right.\n\nKEY PRINCIPLE: ${scenario.correctExplanation}`
        : `INCORRECT.\n\nWHAT HAPPENED: ${formatAuctionBid(bid)} is not the best bid here.\n\nCORRECT BID: ${formatAuctionBid(scenario.correctBid)}\n\nWHY ${formatAuctionBid(scenario.correctBid)}: ${scenario.correctExplanation}`;
      setFeedback(fallback);

      if (err.message?.includes('401') || err.message?.includes('api_key')) {
        setFeedback(fallback + '\n\n[API key error — check your key in Settings]');
      }
    } finally {
      setIsLoading(false);
    }
  }, [scenario, apiKey, isLoading, recordAttempt]);

  // ── Render helpers ──────────────────────────────────────────────────────────
  function renderNavBar() {
    return (
      <nav style={navStyles.bar}>
        <div style={navStyles.left}>
          <button style={navStyles.logo} onClick={handleBackHome}>
            ♠ Bridge Tutor
          </button>
          {view !== 'home' && lesson && (
            <>
              <span style={navStyles.sep}>›</span>
              <span style={navStyles.crumb}>{lesson.unit}</span>
              <span style={navStyles.sep}>›</span>
              <span style={navStyles.crumb}>{lesson.title}</span>
            </>
          )}
        </div>
        <div style={navStyles.right}>
          {view !== 'home' && lesson && (
            <span style={navStyles.progress}>
              {scenarioIndex + 1} / {lesson.scenarios.length}
            </span>
          )}
          <button
            style={{
              ...navStyles.settingsBtn,
              borderColor: apiKey ? 'rgba(90,170,110,0.5)' : 'rgba(200,80,80,0.5)',
              color: apiKey ? '#5aaa6a' : '#c06060',
            }}
            onClick={() => setShowApiPanel(true)}
          >
            {apiKey ? '✓ API Key' : '⚠ Set API Key'}
          </button>
        </div>
      </nav>
    );
  }

  // ── Views ───────────────────────────────────────────────────────────────────
  return (
    <div style={appStyles.root}>
      {renderNavBar()}

      <main style={appStyles.main}>
        {/* Home — lesson selector */}
        {view === 'home' && (
          <LessonSelector
            onSelectLesson={handleSelectLesson}
            getLessonStats={getLessonStats}
          />
        )}

        {/* Active lesson scenario */}
        {(view === 'lesson') && scenario && (
          <div className="scenario-layout">
            {/* Left column */}
            <div style={appStyles.leftCol}>
              {/* Scenario header */}
              <div style={appStyles.scenarioHeader} className="panel">
                <div style={appStyles.scenarioMeta}>
                  <span style={appStyles.convention}>{lesson.convention}</span>
                  <span style={appStyles.difficulty}>{lesson.difficulty}</span>
                </div>
                <div style={appStyles.prompt}>{scenario.prompt}</div>
                {scenario.vulnerability && (
                  <div style={appStyles.vuln}>
                    Vulnerability: <strong>{scenario.vulnerability}</strong>
                  </div>
                )}
              </div>

              {/* Card hand */}
              <CardHand hand={scenario.hand} />

              {/* Auction history */}
              {scenario.auction.length > 0 && (
                <AuctionDisplay
                  auction={scenario.auction}
                  pendingBid={userBid}
                />
              )}
            </div>

            {/* Right column */}
            <div style={appStyles.rightCol}>
              {/* Bidding box — only when no feedback yet */}
              {!feedback && !isLoading && (
                <BiddingBox
                  onSubmitBid={handleSubmitBid}
                  disabled={!!feedback || isLoading}
                />
              )}

              {/* Hint */}
              {!feedback && !isLoading && scenario.hint && (
                <details style={appStyles.hintDetails}>
                  <summary style={appStyles.hintSummary}>Show hint</summary>
                  <div style={appStyles.hintBody}>{scenario.hint}</div>
                </details>
              )}

              {/* Streaming feedback in progress */}
              {isLoading && streamText && (
                <div style={appStyles.streamingPanel} className="panel">
                  <div style={appStyles.streamingLabel}>Analysing...</div>
                  <div style={appStyles.streamingText}>{streamText}</div>
                </div>
              )}

              {/* Final feedback */}
              {(feedback || isLoading) && (
                <FeedbackPanel
                  feedback={feedback || streamText}
                  isLoading={isLoading && !streamText}
                  isCorrect={isCorrect}
                  correctBid={scenario.correctBid}
                  onNext={handleNextScenario}
                />
              )}
            </div>
          </div>
        )}

        {/* Lesson complete */}
        {view === 'lesson-complete' && lesson && (
          <div style={completeStyles.container}>
            <div style={completeStyles.emoji}>♠</div>
            <div style={completeStyles.title}>Lesson Complete!</div>
            <div style={completeStyles.subtitle}>{lesson.title}</div>
            <div style={completeStyles.message}>
              You have worked through all {lesson.scenarios.length} scenarios in this lesson.
              Great practice!
            </div>
            <div style={completeStyles.actions}>
              <button
                className="btn-text"
                onClick={() => {
                  setScenarioIndex(0);
                  setFeedback(null);
                  setUserBid(null);
                  setView('lesson');
                }}
              >
                Practice Again
              </button>
              <button className="btn-gold" onClick={handleBackHome}>
                Back to Lessons
              </button>
            </div>
          </div>
        )}
      </main>

      {/* API key modal */}
      {showApiPanel && (
        <ApiKeyPanel
          apiKey={apiKey}
          onSaveKey={key => { saveApiKey(key); setApiKey(key); }}
          onClose={() => setShowApiPanel(false)}
        />
      )}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const navStyles = {
  bar: {
    background: 'rgba(0,0,0,0.45)',
    borderBottom: '1px solid rgba(200,168,75,0.2)',
    padding: '0 20px',
    height: 52,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backdropFilter: 'blur(8px)',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    overflow: 'hidden',
  },
  logo: {
    background: 'transparent',
    border: 'none',
    color: '#c8a84b',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    fontFamily: 'Georgia, serif',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  sep: {
    color: 'rgba(200,168,75,0.4)',
    fontSize: '0.9rem',
  },
  crumb: {
    color: 'rgba(240,234,214,0.6)',
    fontSize: '0.85rem',
    fontFamily: 'Georgia, serif',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 200,
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  progress: {
    color: 'rgba(240,234,214,0.55)',
    fontSize: '0.85rem',
    fontFamily: 'Georgia, serif',
  },
  settingsBtn: {
    background: 'transparent',
    border: '1px solid',
    borderRadius: 8,
    padding: '5px 12px',
    fontSize: '0.78rem',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
    whiteSpace: 'nowrap',
    transition: 'background 0.15s',
  },
};

const appStyles = {
  root: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Georgia, serif',
  },
  main: {
    flex: 1,
    padding: '20px 16px',
    maxWidth: 1100,
    margin: '0 auto',
    width: '100%',
  },
  scenarioLayout: {
    /* layout handled by .scenario-layout CSS class */
    gap: 20,
    alignItems: 'start',
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  scenarioHeader: {
    padding: '16px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  scenarioMeta: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
  },
  convention: {
    fontSize: '0.7rem',
    background: 'rgba(200,168,75,0.15)',
    color: '#c8a84b',
    borderRadius: 6,
    padding: '2px 8px',
    border: '1px solid rgba(200,168,75,0.25)',
  },
  difficulty: {
    fontSize: '0.7rem',
    background: 'rgba(255,255,255,0.06)',
    color: 'rgba(240,234,214,0.6)',
    borderRadius: 6,
    padding: '2px 8px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  prompt: {
    fontSize: '1.05rem',
    color: '#f0ead6',
    lineHeight: 1.5,
    fontWeight: 'bold',
  },
  vuln: {
    fontSize: '0.8rem',
    color: 'rgba(240,234,214,0.55)',
  },
  hintDetails: {
    background: 'rgba(0,0,0,0.2)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: '10px 14px',
    cursor: 'pointer',
  },
  hintSummary: {
    color: 'rgba(200,168,75,0.8)',
    fontSize: '0.85rem',
    fontFamily: 'Georgia, serif',
    userSelect: 'none',
  },
  hintBody: {
    marginTop: 8,
    color: 'rgba(240,234,214,0.7)',
    fontSize: '0.88rem',
    lineHeight: 1.5,
    fontStyle: 'italic',
  },
  streamingPanel: {
    padding: '16px 20px',
  },
  streamingLabel: {
    fontSize: '0.7rem',
    color: '#c8a84b',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: 8,
    animation: 'pulse 1.5s infinite',
  },
  streamingText: {
    fontSize: '0.9rem',
    lineHeight: 1.6,
    color: '#f0ead6',
    whiteSpace: 'pre-wrap',
  },
};

const completeStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
    padding: '60px 20px',
    textAlign: 'center',
    fontFamily: 'Georgia, serif',
  },
  emoji: {
    fontSize: '4rem',
    color: '#c8a84b',
  },
  title: {
    fontSize: '2rem',
    color: '#c8a84b',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: 'rgba(240,234,214,0.8)',
  },
  message: {
    fontSize: '1rem',
    color: 'rgba(240,234,214,0.65)',
    maxWidth: 400,
    lineHeight: 1.6,
  },
  actions: {
    display: 'flex',
    gap: 14,
    marginTop: 10,
  },
};
