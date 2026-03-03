export const SUIT_SYMBOLS = { S: '♠', H: '♥', D: '♦', C: '♣', N: 'NT' };
export const SUIT_COLORS = { S: '#1a2a3a', H: '#c0392b', D: '#c0392b', C: '#1a2a3a', N: '#c8a84b' };

export function parseBid(bidStr) {
  if (!bidStr) return null;
  const s = bidStr.trim().toUpperCase();
  if (s === 'PASS' || s === 'P') return { type: 'pass', display: 'Pass' };
  if (s === 'X' || s === 'DBL' || s === 'DOUBLE') return { type: 'double', display: 'X' };
  if (s === 'XX' || s === 'RDBL' || s === 'REDOUBLE') return { type: 'redouble', display: 'XX' };

  const match = s.match(/^([1-7])([SHDCN]|NT|SP|HT|DI|CL)$/);
  if (match) {
    const level = match[1];
    let suit = match[2];
    if (suit === 'NT') suit = 'N';
    if (suit === 'SP') suit = 'S';
    if (suit === 'HT') suit = 'H';
    if (suit === 'DI') suit = 'D';
    if (suit === 'CL') suit = 'C';
    return { type: 'bid', level: parseInt(level), suit, display: `${level}${SUIT_SYMBOLS[suit]}` };
  }
  return null;
}

export function normalizeBid(bidStr) {
  // Normalize user input to canonical form (e.g. "1NT" → "1N", "pass" → "Pass")
  if (!bidStr) return null;
  const s = bidStr.trim().toUpperCase();
  if (s === 'PASS' || s === 'P') return 'Pass';
  if (s === 'X' || s === 'DBL') return 'X';
  if (s === 'XX' || s === 'RDBL') return 'XX';
  const match = s.match(/^([1-7])(S|H|D|C|N|NT)$/);
  if (match) {
    const suit = match[2] === 'NT' ? 'N' : match[2];
    return `${match[1]}${suit}`;
  }
  return null;
}

export function bidsMatch(userBid, correctBid) {
  const u = normalizeBid(userBid);
  const c = normalizeBid(correctBid);
  if (!u || !c) return false;
  return u === c;
}

export function formatAuctionBid(bid) {
  if (!bid) return '';
  if (bid === 'Pass') return 'Pass';
  if (bid === 'X') return 'X';
  if (bid === 'XX') return 'XX';
  const level = bid[0];
  const suit = bid.slice(1);
  return `${level}${SUIT_SYMBOLS[suit] || suit}`;
}

export function getSuitColor(suit) {
  return SUIT_COLORS[suit] || '#f0ead6';
}

// Validate that a bid is higher than the previous bid in the auction
export function isValidBid(bidStr, auction) {
  const SUIT_ORDER = { C: 0, D: 1, H: 2, S: 3, N: 4 };
  const bid = parseBid(bidStr);
  if (!bid) return false;
  if (bid.type === 'pass' || bid.type === 'double' || bid.type === 'redouble') return true;

  const lastSuitBid = [...auction].reverse().find(b => {
    const p = parseBid(b.bid);
    return p && p.type === 'bid';
  });

  if (!lastSuitBid) return true;
  const last = parseBid(lastSuitBid.bid);
  if (bid.level > last.level) return true;
  if (bid.level === last.level) return SUIT_ORDER[bid.suit] > SUIT_ORDER[last.suit];
  return false;
}

// Generate a system prompt for the AI bridge judge
export function buildJudgePrompt(scenario, userBid, hand) {
  const handStr = hand.join(' ');
  const auctionStr = scenario.auction.length === 0
    ? 'No bids yet (you are dealer or first to act)'
    : scenario.auction.map(a => `${a.player}: ${formatAuctionBid(a.bid)}`).join(' | ');

  return `You are an expert bridge teacher evaluating a student's bid using Standard American (5-card majors, 15-17 1NT). Be encouraging but precise.

HAND: ${handStr}
AUCTION SO FAR: ${auctionStr}
SITUATION: ${scenario.prompt}
STUDENT'S BID: ${userBid}
CORRECT BID: ${scenario.correctBid}
VULNERABILITY: ${scenario.vulnerability}

Analyze the student's bid. Structure your response EXACTLY as:

VERDICT: [CORRECT or INCORRECT]

WHAT HAPPENED: [1-2 sentences describing what the student did and why it's right/wrong]

KEY PRINCIPLE: [The bridge rule or principle that applies here — be specific: mention point ranges, suit length requirements, convention names, etc.]

CORRECT BID: ${formatAuctionBid(scenario.correctBid)}

WHY ${formatAuctionBid(scenario.correctBid)}: [2-3 sentences explaining the correct bid and what it communicates to partner]

NEXT STEPS: [1 sentence on what happens after this bid — what partner will likely do, what the auction might look like]

Keep the total response under 180 words. Use ♠ ♥ ♦ ♣ symbols for suits. Be warm and educational.`;
}
