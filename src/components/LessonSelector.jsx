import { LESSONS } from '../data/lessons.js';

const DIFFICULTY_COLORS = {
  Beginner: '#5aaa6a',
  Intermediate: '#c8a84b',
  Advanced: '#c06040',
};

const UNIT_ORDER = ['Opening Bids', 'Responses to 1NT', 'Responses to 1-Major', 'Competitive Bidding', 'Slam Bidding', 'Strong Openings'];

export default function LessonSelector({ onSelectLesson, progress, getLessonStats }) {
  const unitGroups = {};
  LESSONS.forEach(lesson => {
    if (!unitGroups[lesson.unit]) unitGroups[lesson.unit] = [];
    unitGroups[lesson.unit].push(lesson);
  });

  const units = UNIT_ORDER.filter(u => unitGroups[u]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>Bridge Bidding Tutor</div>
        <div style={styles.subtitle}>Master the language of bridge, one bid at a time</div>
      </div>

      <div style={styles.units}>
        {units.map(unit => (
          <div key={unit} style={styles.unit}>
            <div style={styles.unitTitle}>{unit}</div>
            <div className="lesson-grid" style={styles.lessons}>
              {unitGroups[unit].map(lesson => {
                const stats = getLessonStats(lesson.scenarios.map(s => s.id));
                const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                const started = stats.attempted > 0;

                return (
                  <button
                    key={lesson.id}
                    style={styles.lessonCard}
                    onClick={() => onSelectLesson(lesson.id)}
                  >
                    <div style={styles.lessonTop}>
                      <div style={styles.lessonTitle}>{lesson.title}</div>
                      <div
                        style={{
                          ...styles.difficulty,
                          color: DIFFICULTY_COLORS[lesson.difficulty] || '#c8a84b',
                        }}
                      >
                        {lesson.difficulty}
                      </div>
                    </div>
                    <div style={styles.lessonDesc}>{lesson.description}</div>
                    <div style={styles.lessonFooter}>
                      <div style={styles.convention}>{lesson.convention}</div>
                      <div style={styles.progress}>
                        {started ? (
                          <>
                            <div style={styles.progressBar}>
                              <div
                                style={{
                                  ...styles.progressFill,
                                  width: `${pct}%`,
                                  background: pct === 100 ? '#5aaa6a' : '#c8a84b',
                                }}
                              />
                            </div>
                            <span style={styles.progressText}>
                              {stats.correct}/{stats.total}
                            </span>
                          </>
                        ) : (
                          <span style={styles.notStarted}>{stats.total} scenarios</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '20px 16px',
    fontFamily: 'Georgia, serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: '2.2rem',
    color: '#c8a84b',
    fontWeight: 'bold',
    letterSpacing: '0.05em',
    marginBottom: 8,
  },
  subtitle: {
    color: 'rgba(240,234,214,0.65)',
    fontSize: '1rem',
    fontStyle: 'italic',
  },
  units: {
    display: 'flex',
    flexDirection: 'column',
    gap: 28,
  },
  unit: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  unitTitle: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: 'rgba(200,168,75,0.7)',
    borderBottom: '1px solid rgba(200,168,75,0.2)',
    paddingBottom: 6,
  },
  lessons: {
    /* grid handled by .lesson-grid CSS class */
    gap: 12,
  },
  lessonCard: {
    background: 'rgba(0,0,0,0.35)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: '16px',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'border-color 0.2s, transform 0.1s, box-shadow 0.2s',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    fontFamily: 'Georgia, serif',
    color: '#f0ead6',
  },
  lessonTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  lessonTitle: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#f0ead6',
    lineHeight: 1.3,
  },
  difficulty: {
    fontSize: '0.7rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    whiteSpace: 'nowrap',
  },
  lessonDesc: {
    fontSize: '0.82rem',
    color: 'rgba(240,234,214,0.65)',
    lineHeight: 1.5,
  },
  lessonFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  convention: {
    fontSize: '0.7rem',
    color: 'rgba(200,168,75,0.6)',
    fontStyle: 'italic',
  },
  progress: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  progressBar: {
    width: 50,
    height: 4,
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    transition: 'width 0.3s',
  },
  progressText: {
    fontSize: '0.7rem',
    color: 'rgba(240,234,214,0.5)',
  },
  notStarted: {
    fontSize: '0.7rem',
    color: 'rgba(240,234,214,0.35)',
    fontStyle: 'italic',
  },
};
