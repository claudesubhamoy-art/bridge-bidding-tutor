import { useState, useEffect } from 'react';

const STORAGE_KEY = 'bridge_tutor_progress';

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function useProgress() {
  const [progress, setProgress] = useState(() => loadProgress());

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  function recordAttempt(scenarioId, correct) {
    setProgress(prev => {
      const existing = prev[scenarioId] || { attempts: 0, correct: 0, lastSeen: null };
      return {
        ...prev,
        [scenarioId]: {
          attempts: existing.attempts + 1,
          correct: existing.correct + (correct ? 1 : 0),
          lastSeen: new Date().toISOString(),
        },
      };
    });
  }

  function getScenarioStats(scenarioId) {
    return progress[scenarioId] || { attempts: 0, correct: 0, lastSeen: null };
  }

  function getLessonStats(lessonScenarioIds) {
    const stats = lessonScenarioIds.map(id => progress[id] || { attempts: 0, correct: 0 });
    const attempted = stats.filter(s => s.attempts > 0).length;
    const correct = stats.filter(s => s.correct > 0).length;
    return { total: lessonScenarioIds.length, attempted, correct };
  }

  function generateSaveCode() {
    return btoa(JSON.stringify(progress));
  }

  function loadFromSaveCode(code) {
    try {
      const data = JSON.parse(atob(code));
      setProgress(data);
      return true;
    } catch {
      return false;
    }
  }

  function resetProgress() {
    setProgress({});
  }

  return {
    progress,
    recordAttempt,
    getScenarioStats,
    getLessonStats,
    generateSaveCode,
    loadFromSaveCode,
    resetProgress,
  };
}
