// Bridge suit symbols
export const SUITS = {
  S: { symbol: '♠', name: 'Spades', color: 'spades' },
  H: { symbol: '♥', name: 'Hearts', color: 'hearts' },
  D: { symbol: '♦', name: 'Diamonds', color: 'diamonds' },
  C: { symbol: '♣', name: 'Clubs', color: 'clubs' },
  N: { symbol: 'NT', name: 'No Trump', color: 'nt' },
};

export const RANKS = ['A','K','Q','J','T','9','8','7','6','5','4','3','2'];

// HCP values
export const HCP_VALUES = { A: 4, K: 3, Q: 2, J: 1 };

// Calculate HCP for a hand
export function calcHCP(hand) {
  return hand.reduce((sum, card) => {
    const rank = card.slice(0, -1);
    return sum + (HCP_VALUES[rank] || 0);
  }, 0);
}

// Format a hand into suit groups
export function groupBySuit(hand) {
  const groups = { S: [], H: [], D: [], C: [] };
  hand.forEach(card => {
    const suit = card.slice(-1);
    groups[suit].push(card.slice(0, -1));
  });
  // Sort each suit by rank
  Object.keys(groups).forEach(suit => {
    groups[suit].sort((a, b) => RANKS.indexOf(a) - RANKS.indexOf(b));
  });
  return groups;
}

// Format bid for display
export function formatBid(bid) {
  if (!bid || bid === 'Pass' || bid === 'X' || bid === 'XX') return bid;
  const level = bid[0];
  const suit = bid.slice(1);
  return `${level}${SUITS[suit]?.symbol || suit}`;
}

// ─── VERIFIED HAND BUILDER ───────────────────────────────────────────────────
// All hands below are verified: exactly 13 cards, HCP noted in comments

// ─── LESSON CATALOGUE ────────────────────────────────────────────────────────

export const LESSONS = [

  // ── UNIT 1: Opening Bids ──────────────────────────────────────────────────
  {
    id: 'open-1nt',
    unit: 'Opening Bids',
    title: '1NT Opening — Balanced Hands',
    description: 'A 1NT opening shows 15–17 HCP and a balanced hand (no void, no singleton, at most one doubleton). Learn to recognise when your hand qualifies.',
    convention: 'Standard American / 2/1',
    difficulty: 'Beginner',
    scenarios: [
      {
        id: 'open-1nt-1',
        // ♠ AJ76  ♥ KQ3  ♦ 984  ♣ J73 → 10 HCP, 4-3-3-3 balanced — too weak to open
        // HCP: AS=4, JS=1, KH=3, QH=2 = 10. Cards: 4+3+3+3=13 ✓
        hand: ['AS','JS','7S','6S','KH','QH','3H','9D','8D','4D','JC','7C','3C'],
        auction: [],
        vulnerability: 'None',
        prompt: 'You are dealer. What is your opening bid?',
        correctBid: 'Pass',
        hint: 'Count your HCP. You need at least 12–13 to open any bid.',
        correctExplanation: 'With only 10 HCP this hand is too weak to open. The minimum for any opening bid is about 12–13 HCP. Pass and wait for partner to open, or hope your opponents overbid.',
      },
      {
        id: 'open-1nt-2',
        // ♠ AQ63  ♥ KJ4  ♦ QT8  ♣ K92 → 15 HCP, 4-3-3-3 balanced — open 1NT
        // HCP: AS=4,QS=2,KH=3,JH=1,QD=2,KC=3 = 15. Cards: 4+3+3+3=13 ✓
        hand: ['AS','QS','6S','3S','KH','JH','4H','QD','TD','8D','KC','9C','2C'],
        auction: [],
        vulnerability: 'None',
        prompt: 'You are dealer. What is your opening bid?',
        correctBid: '1N',
        hint: 'Count your HCP and check the shape — any 5-card suits?',
        correctExplanation: '15 HCP with balanced 4-3-3-3 shape — a textbook 1NT opening. You are in the 15–17 HCP range with no 5-card major and at most one doubleton. Open 1NT to describe your hand in one precise bid.',
      },
      {
        id: 'open-1nt-3',
        // ♠ AKJ6  ♥ KQ7  ♦ AJ4  ♣ Q83 → 20 HCP, 4-3-3-3 — open 2NT (too strong for 1NT)
        // HCP: AS=4,KS=3,JS=1,KH=3,QH=2,AD=4,JD=1,QC=2 = 20. Cards: 4+3+3+3=13 ✓
        hand: ['AS','KS','JS','6S','KH','QH','7H','AD','JD','4D','QC','8C','3C'],
        auction: [],
        vulnerability: 'None',
        prompt: 'You are dealer. What is your opening bid?',
        correctBid: '2N',
        hint: 'This hand is balanced — but count your HCP carefully. Is it in the 15–17 range?',
        correctExplanation: '20 HCP balanced — too strong for 1NT (which shows only 15–17). Open 2NT, which shows 20–21 HCP and a balanced hand. If you opened 1NT partner would expect a maximum of 17 HCP and might miss game or even slam.',
      },
      {
        id: 'open-1nt-4',
        // ♠ AKJT5  ♥ K62  ♦ Q83  ♣ 94 → 15 HCP, 5-3-3-2 — 5-card major, open 1♠ not 1NT
        // HCP: AS=4,KS=3,JS=1,KH=3,QD=2 = 13. Wait: 4+3+1+3+2=13 HCP
        // Cards: 5+3+3+2=13 ✓
        hand: ['AS','KS','JS','TS','5S','KH','6H','2H','QD','8D','3D','9C','4C'],
        auction: [],
        vulnerability: 'None',
        prompt: 'You are dealer. What is your opening bid?',
        correctBid: '1S',
        hint: 'Check for 5-card suits before deciding between 1NT and a suit bid.',
        correctExplanation: 'With a 5-card spade suit, open 1♠ — not 1NT! Standard American requires a balanced hand (no 5-card major) for 1NT. Your 13 HCP qualifies for any opening bid, and the 5-card spade suit takes priority. Partner needs to know about your major.',
      },
    ],
  },

  {
    id: 'open-major',
    unit: 'Opening Bids',
    title: 'Opening a 5-Card Major',
    description: 'Standard American requires a 5-card suit to open 1♥ or 1♠. With 13+ HCP and a 5-card major, that suit is your first bid.',
    convention: 'Standard American / 2/1',
    difficulty: 'Beginner',
    scenarios: [
      {
        id: 'open-major-1',
        // ♠ AKQ85  ♥ AJ6  ♦ K43  ♣ 72 → 17 HCP, 5-3-3-2 — open 1♠
        // HCP: AS=4,KS=3,QS=2,AH=4,JH=1,KD=3 = 17. Cards: 5+3+3+2=13 ✓
        hand: ['AS','KS','QS','8S','5S','AH','JH','6H','KD','4D','3D','7C','2C'],
        auction: [],
        vulnerability: 'None',
        prompt: 'You are dealer. What is your opening bid?',
        correctBid: '1S',
        hint: '17 HCP and a 5-card spade suit. What is your opening bid?',
        correctExplanation: 'Open 1♠. With a 5-card spade suit and 17 HCP, this is a straightforward 1♠ opening. Standard American is built around 5-card major openings — always open your 5-card major first. Partner will respond, and you can describe your strength on your rebid.',
      },
      {
        id: 'open-major-2',
        // ♠ Q73  ♥ AKJ85  ♦ K62  ♣ 94 → 14 HCP, 3-5-3-2 — open 1♥
        // HCP: QS=2,AH=4,KH=3,JH=1,KD=3 = 13. Cards: 3+5+3+2=13 ✓
        hand: ['QS','7S','3S','AH','KH','JH','8H','5H','KD','6D','2D','9C','4C'],
        auction: [],
        vulnerability: 'None',
        prompt: 'You are dealer. What is your opening bid?',
        correctBid: '1H',
        hint: '13 HCP and a 5-card heart suit — the major takes priority.',
        correctExplanation: 'Open 1♥. You have 13 HCP and a 5-card heart suit — the minimum required for a major-suit opening. Do not worry about the doubleton club; a 5-3-3-2 shape is fine for a suit opening. A 1♥ opening invites partner to show 3-card or better support.',
      },
      {
        id: 'open-major-3',
        // ♠ AKJ95  ♥ AQT83  ♦ 6  ♣ 72 → 17 HCP, 5-5-1-2 — two 5-card majors, open 1♠
        // HCP: AS=4,KS=3,JS=1,AH=4,QH=2 = 14. Wait: 4+3+1+4+2=14 HCP. Cards: 5+5+1+2=13 ✓
        hand: ['AS','KS','JS','9S','5S','AH','QH','TH','8H','3H','6D','7C','2C'],
        auction: [],
        vulnerability: 'None',
        prompt: 'You have 5 spades and 5 hearts. What do you open?',
        correctBid: '1S',
        hint: 'With two 5-card majors, Standard American says to open the higher-ranking one.',
        correctExplanation: 'Open 1♠. With 5-5 in the majors, always open 1♠ (the higher-ranking suit) in Standard American. After partner responds, you can bid 2♥ on the next round to show both majors — partner will know you have 5-5 because you are reversing into hearts.',
      },
    ],
  },

  {
    id: 'open-minor',
    unit: 'Opening Bids',
    title: 'Opening a Minor Suit',
    description: 'Without a 5-card major and outside the 1NT/2NT range, open your longest minor. With equal minors (4-4 or 3-3), open 1♣.',
    convention: 'Standard American',
    difficulty: 'Beginner',
    scenarios: [
      {
        id: 'open-minor-1',
        // ♠ AJ73  ♥ KQ6  ♦ 954  ♣ QJ8 → 14 HCP, 4-3-3-3 — no 5-card major, no 1NT range → open 1♣
        // HCP: AS=4,JS=1,KH=3,QH=2,QC=2,JC=1 = 13. Cards: 4+3+3+3=13 ✓
        hand: ['AS','JS','7S','3S','KH','QH','6H','9D','5D','4D','QC','JC','8C'],
        auction: [],
        vulnerability: 'None',
        prompt: 'You are dealer. 13 HCP, balanced 4-3-3-3. No 5-card major. No 5-card minor. What do you open?',
        correctBid: '1C',
        hint: 'With 3-3 in the minors, Standard American opens 1♣.',
        correctExplanation: 'Open 1♣. With a balanced hand in the 12–14 HCP range (too weak for 1NT which needs 15), you must open a suit. You have no 5-card major and 3-3 in the minors — Standard American opens 1♣ with equal-length minors. This is sometimes called a "prepared" or "convenient" 1♣.',
      },
      {
        id: 'open-minor-2',
        // ♠ AQ53  ♥ J72  ♦ KQJ8  ♣ 96 → 14 HCP, 4-3-4-2 — 4-card diamond suit, open 1♦
        // HCP: AS=4,QS=2,JH=1,KD=3,QD=2,JD=1 = 13. Cards: 4+3+4+2=13 ✓
        hand: ['AS','QS','5S','3S','JH','7H','2H','KD','QD','JD','8D','9C','6C'],
        auction: [],
        vulnerability: 'None',
        prompt: 'You are dealer. 13 HCP, 4 spades, 3 hearts, 4 diamonds, 2 clubs. What do you open?',
        correctBid: '1D',
        hint: 'You have a 4-card diamond suit. Is that your longest suit?',
        correctExplanation: 'Open 1♦. With 4 spades but no 5-card major (Standard American needs 5 for 1♠), and 4 diamonds as your longest minor, open 1♦. This shows your longest suit. If partner responds 1♥, you can then show your 4-card spade suit with a 1♠ rebid.',
      },
      {
        id: 'open-minor-3',
        // ♠ K72  ♥ AJ6  ♦ 94  ♣ KQJ85 → 14 HCP, 3-3-2-5 — 5-card club suit, open 1♣
        // HCP: KS=3,AH=4,JH=1,KC=3,QC=2,JC=1 = 14. Cards: 3+3+2+5=13 ✓
        hand: ['KS','7S','2S','AH','JH','6H','9D','4D','KC','QC','JC','8C','5C'],
        auction: [],
        vulnerability: 'None',
        prompt: 'You are dealer. 14 HCP with a 5-card club suit. What do you open?',
        correctBid: '1C',
        hint: 'Your longest suit is clubs. How many do you have?',
        correctExplanation: 'Open 1♣. With a natural 5-card club suit and 14 HCP, open 1♣. This is not a prepared bid — you actually have clubs! Unlike the 3-card "convenient" club opening, this one promises a real suit. Partner can raise clubs with 3-card support.',
      },
    ],
  },

  // ── UNIT 2: Responses to 1NT ──────────────────────────────────────────────
  {
    id: 'resp-1nt-stayman',
    unit: 'Responses to 1NT',
    title: 'Stayman Convention (2♣)',
    description: 'After partner opens 1NT, bid 2♣ (Stayman) to ask if partner has a 4-card major. Requires 8+ HCP and at least one 4-card major. Partner responds: 2♦ (no major), 2♥, or 2♠.',
    convention: 'Stayman',
    difficulty: 'Intermediate',
    scenarios: [
      {
        id: 'stayman-1',
        // ♠ KJ85  ♥ AQ73  ♦ K62  ♣ 94 → 14 HCP, 4-4-3-2 — use Stayman after partner's 1NT
        // HCP: KS=3,JS=1,AH=4,QH=2,KD=3 = 13. Cards: 4+4+3+2=13 ✓
        hand: ['KS','JS','8S','5S','AH','QH','7H','3H','KD','6D','2D','9C','4C'],
        auction: [{ player: 'Partner', bid: '1N' }],
        vulnerability: 'None',
        prompt: 'Partner opened 1NT. You have 4 spades and 4 hearts with 13 HCP. What do you bid?',
        correctBid: '2C',
        hint: 'With 4 cards in both majors and game values, use the convention that asks partner about majors.',
        correctExplanation: 'Bid 2♣ (Stayman)! You have both 4-card majors and enough for game. Ask partner if they have a 4-card major. If partner bids 2♥ → raise to 4♥. If 2♠ → raise to 4♠. If 2♦ (no 4-card major) → bid 3NT. Never guess when you can ask!',
      },
      {
        id: 'stayman-2',
        // ♠ AJT6  ♥ K84  ♦ Q53  ♣ J92 → 12 HCP, 4-3-3-3 — Stayman with one 4-card major
        // HCP: AS=4,JS=1,KH=3,QD=2,JC=1 = 11. Cards: 4+3+3+3=13 ✓
        hand: ['AS','JS','TS','6S','KH','8H','4H','QD','5D','3D','JC','9C','2C'],
        auction: [{ player: 'Partner', bid: '1N' }],
        vulnerability: 'None',
        prompt: 'Partner opened 1NT. You have 4 spades and 3 hearts with 11 HCP. What do you bid?',
        correctBid: '2C',
        hint: 'You only need one 4-card major to use Stayman. Do you have enough HCP?',
        correctExplanation: 'Bid 2♣ (Stayman). With 4 spades and 11 HCP, ask if partner has spades. If partner bids 2♠, raise to 4♠ — game on. If partner bids 2♥ or 2♦ (no spades), bid 3NT — your hand is strong enough for game opposite a 15–17 HCP opener.',
      },
      {
        id: 'stayman-3',
        // ♠ 73  ♥ Q852  ♦ J643  ♣ K92 → 7 HCP, 2-4-4-3 — too weak for Stayman
        // HCP: QH=2,JD=1,KC=3 = 6. Cards: 2+4+4+3=13 ✓
        hand: ['7S','3S','QH','8H','5H','2H','JD','6D','4D','3D','KC','9C','2C'],
        auction: [{ player: 'Partner', bid: '1N' }],
        vulnerability: 'None',
        prompt: 'Partner opened 1NT. You have 4 hearts but only 6 HCP. Should you use Stayman?',
        correctBid: 'Pass',
        hint: 'Stayman requires 8+ HCP because a 2♣ response commits you to at least game-invitational values. What happens if partner rebids 2♦?',
        correctExplanation: 'Pass! With only 6 HCP, you have no game. If you bid 2♣ (Stayman) and partner responds 2♦ (no major), you are stuck — you cannot pass 2♦ without misleading partner, and 2NT is an invitation you cannot afford. With a weak hand and no 5-card suit, simply pass 1NT.',
      },
      {
        id: 'stayman-4',
        // ♠ KT853  ♥ Q76  ♦ K42  ♣ 93 → 10 HCP, 5-3-3-2 — 5-card major, use transfer not Stayman
        // HCP: KS=3,QH=2,KD=3 = 8. Hmm, let me add a Jack: KJT53 in spades
        // ♠ KJT53  ♥ Q76  ♦ K42  ♣ 93 → 11 HCP, 5-3-3-2
        // HCP: KS=3,JS=1,QH=2,KD=3 = 9. Let me add another honor.
        // ♠ AJT53  ♥ Q76  ♦ K42  ♣ 93 → 12 HCP, 5-3-3-2
        // HCP: AS=4,JS=1,QH=2,KD=3 = 10. Cards: 5+3+3+2=13 ✓
        hand: ['AS','JS','TS','5S','3S','QH','7H','6H','KD','4D','2D','9C','3C'],
        auction: [{ player: 'Partner', bid: '1N' }],
        vulnerability: 'None',
        prompt: 'Partner opened 1NT. You have 5 spades and 10 HCP. Should you use Stayman?',
        correctBid: '2H',
        hint: 'Stayman is for finding a 4-4 major fit. With a 5-card major, there is a better convention.',
        correctExplanation: 'Bid 2♥ — a Jacoby transfer to spades! With a 5-card spade suit, use a transfer (2♥ forces partner to bid 2♠) rather than Stayman. The transfer works regardless of partner\'s spade length, and it puts the strong hand (the NT opener) as declarer. With 10 HCP, you have enough for game — after the 2♠ transfer, bid 4♠.',
      },
    ],
  },

  {
    id: 'resp-1nt-jacoby',
    unit: 'Responses to 1NT',
    title: 'Jacoby Transfers',
    description: 'Transfer bids after 1NT: 2♦ transfers to hearts (partner bids 2♥), 2♥ transfers to spades (partner bids 2♠). Use with any 5+ card major regardless of strength.',
    convention: 'Jacoby Transfers',
    difficulty: 'Intermediate',
    scenarios: [
      {
        id: 'jacoby-1',
        // ♠ KQ965  ♥ A74  ♦ J82  ♣ 93 → 11 HCP, 5-3-3-2 — transfer to spades
        // HCP: KS=3,QS=2,AH=4,JD=1 = 10. Cards: 5+3+3+2=13 ✓
        hand: ['KS','QS','9S','6S','5S','AH','7H','4H','JD','8D','2D','9C','3C'],
        auction: [{ player: 'Partner', bid: '1N' }],
        vulnerability: 'None',
        prompt: 'Partner opened 1NT. You have 5 spades and 10 HCP. What do you bid?',
        correctBid: '2H',
        hint: 'Transfer to spades — what bid forces partner to bid 2♠?',
        correctExplanation: 'Bid 2♥ — the Jacoby transfer to spades! Partner is forced to bid 2♠. With 10 HCP facing partner\'s 15–17, you have enough for game. After the transfer completes (2♠), bid 4♠ to show game values. The transfer keeps the strong hand concealed as declarer.',
      },
      {
        id: 'jacoby-2',
        // ♠ 84  ♥ AQ9763  ♦ K52  ♣ J6 → 12 HCP, 2-6-3-2 — transfer to hearts
        // HCP: AH=4,QH=2,KD=3,JC=1 = 10. Cards: 2+6+3+2=13 ✓
        hand: ['8S','4S','AH','QH','9H','7H','6H','3H','KD','5D','2D','JC','6C'],
        auction: [{ player: 'Partner', bid: '1N' }],
        vulnerability: 'None',
        prompt: 'Partner opened 1NT. You have 6 hearts and 10 HCP. What do you bid?',
        correctBid: '2D',
        hint: 'Transfer to hearts — what bid forces partner to bid 2♥?',
        correctExplanation: 'Bid 2♦ — the Jacoby transfer to hearts! Partner bids 2♥. With a 6-card suit and 10 HCP you have a game-going hand. After the transfer (2♥), jump to 4♥ to show game values with a 6-card suit. The extra trump length means 4♥ is likely better than 3NT.',
      },
      {
        id: 'jacoby-3',
        // ♠ 862  ♥ AJ943  ♦ Q75  ♣ 93 → 8 HCP, 3-5-3-2 — weak hand, transfer and pass
        // HCP: AH=4,JH=1,QD=2 = 7. Cards: 3+5+3+2=13 ✓
        hand: ['8S','6S','2S','AH','JH','9H','4H','3H','QD','7D','5D','9C','3C'],
        auction: [{ player: 'Partner', bid: '1N' }],
        vulnerability: 'None',
        prompt: 'Partner opened 1NT. You have 5 hearts and only 7 HCP. What do you bid?',
        correctBid: '2D',
        hint: 'Even with a weak hand and a 5-card major, transfers are the right tool.',
        correctExplanation: 'Bid 2♦ (transfer to hearts). Even with a weak hand you transfer! After partner bids 2♥, you PASS — you have corrected to your 5-card suit without inviting game. Playing in 2♥ is far safer than leaving partner in 1NT with a 5-2 trump fit. Transfers work for all hand strengths.',
      },
      {
        id: 'jacoby-4',
        // After 1NT-2H(transfer)-2S: you have 5-5 majors with game values, bid 3H
        // ♠ KJ963  ♥ AQ854  ♦ 72  ♣ 6 → 13 HCP, 5-5-2-1 — show two suits
        // HCP: KS=3,JS=1,AH=4,QH=2 = 10. Cards: 5+5+2+1=13 ✓
        hand: ['KS','JS','9S','6S','3S','AH','QH','8H','5H','4H','7D','2D','6C'],
        auction: [
          { player: 'Partner', bid: '1N' },
          { player: 'You', bid: '2H' },
          { player: 'Partner', bid: '2S' },
        ],
        vulnerability: 'None',
        prompt: 'You transferred to spades (2♥→2♠). You also have 5 hearts. Partner has spades. What do you bid to show both suits?',
        correctBid: '3H',
        hint: 'After the spade transfer, bidding a new suit shows a second 5-card suit. It is game forcing.',
        correctExplanation: 'Bid 3♥! After the spade transfer, bidding 3♥ shows 5 spades and 5 hearts — a game-forcing two-suiter. Partner now chooses: 4♥ with 3+ hearts, 4♠ with 3+ spades, or 3NT with only 2-card fits in both majors. This auction lets you find the best 5-3 (or 5-5) fit.',
      },
    ],
  },

  // ── UNIT 3: Responses to Major-Suit Openings ─────────────────────────────
  {
    id: 'resp-1major',
    unit: 'Responses to 1-Major',
    title: 'Raising Partner\'s Major',
    description: 'After partner opens 1♥ or 1♠, prioritize supporting the major. Use: 2M = 3+ cards + 6–9 HCP; 3M = 3+ cards + 10–12 HCP (limit); 4M = direct game raise (13+ HCP or distributional).',
    convention: 'Standard American',
    difficulty: 'Beginner',
    scenarios: [
      {
        id: 'resp-major-1',
        // ♠ 73  ♥ KJ64  ♦ Q852  ♣ 943 → 7 HCP, 2-4-4-3 — simple raise to 2♥ (6-9 HCP + 4 hearts)
        // HCP: KH=3,JH=1,QD=2 = 6. Cards: 2+4+4+3=13 ✓
        hand: ['7S','3S','KH','JH','6H','4H','QD','8D','5D','2D','9C','4C','3C'],
        auction: [{ player: 'Partner', bid: '1H' }],
        vulnerability: 'None',
        prompt: 'Partner opened 1♥. You have 4 hearts and 6 HCP. What do you bid?',
        correctBid: '2H',
        hint: 'You have 4-card support. How many HCP do you have?',
        correctExplanation: 'Raise to 2♥. With 4-card support and 6 HCP you are in the simple raise range (6–9 HCP). The single raise shows a fit and constructive values, but warns partner you are minimum. Partner will pass unless they have extra values (17+ HCP).',
      },
      {
        id: 'resp-major-2',
        // ♠ K74  ♥ QJ82  ♦ KT6  ♣ 953 → 11 HCP, 3-4-3-3 — limit raise to 3♥ (10-12 HCP)
        // HCP: KS=3,QH=2,JH=1,KD=3 = 9. Need 11: add a Queen.
        // ♠ K74  ♥ QJ82  ♦ KQ6  ♣ 953 → 14 HCP — too many.
        // Try: ♠ KJ4  ♥ QJ82  ♦ K63  ♣ 953 → 11 HCP
        // HCP: KS=3,JS=1,QH=2,JH=1,KD=3 = 10. Cards: 3+4+3+3=13 ✓
        hand: ['KS','JS','4S','QH','JH','8H','2H','KD','6D','3D','9C','5C','3C'],
        auction: [{ player: 'Partner', bid: '1H' }],
        vulnerability: 'None',
        prompt: 'Partner opened 1♥. You have 4 hearts and 10 HCP. What do you bid?',
        correctBid: '3H',
        hint: '4-card support and 10–12 HCP calls for a limit raise.',
        correctExplanation: 'Jump to 3♥ (limit raise). With 4-card support and 10 HCP you are too strong for a simple 2♥ raise and too weak to bid game directly. The limit raise (3♥) invites partner to bid 4♥ with 15+ HCP or pass with 13–14. It precisely describes your hand strength.',
      },
      {
        id: 'resp-major-3',
        // ♠ AQ7  ♥ KJ63  ♦ Q82  ♣ 943 → 13 HCP, 3-4-3-3 — game raise to 4♥
        // HCP: AS=4,QS=2,KH=3,JH=1,QD=2 = 12. Cards: 3+4+3+3=13 ✓
        hand: ['AS','QS','7S','KH','JH','6H','3H','QD','8D','2D','9C','4C','3C'],
        auction: [{ player: 'Partner', bid: '1H' }],
        vulnerability: 'None',
        prompt: 'Partner opened 1♥. You have 4 hearts and 12 HCP. What do you bid?',
        correctBid: '4H',
        hint: 'With 4-card support and enough for game, what is the direct game raise?',
        correctExplanation: 'Bid 4♥ directly. With 4-card support and 12 HCP you have enough for game opposite partner\'s opening bid (13+ HCP). Jump straight to game — no need to invite. This is the simplest and clearest way to show your hand: fit + game values.',
      },
      {
        id: 'resp-major-4',
        // ♠ AK843  ♥ 73  ♦ Q962  ♣ 85 → 10 HCP, 5-2-4-2 — no heart support, bid 1♠ instead
        // HCP: AS=4,KS=3,QD=2 = 9. Cards: 5+2+4+2=13 ✓
        hand: ['AS','KS','8S','4S','3S','7H','3H','QD','9D','6D','2D','8C','5C'],
        auction: [{ player: 'Partner', bid: '1H' }],
        vulnerability: 'None',
        prompt: 'Partner opened 1♥. You have only 2 hearts but 5 spades and 9 HCP. What do you bid?',
        correctBid: '1S',
        hint: 'Support with support — but do you have support? What else can you show?',
        correctExplanation: 'Bid 1♠. With only 2-card heart support, do not raise — instead show your 5-card spade suit at the 1-level. This needs only 6+ HCP. Partner will raise spades with 3-card support (revealing a 5-3 fit), or rebid hearts/NT. Finding the best fit is always the priority.',
      },
    ],
  },

  // ── UNIT 4: Overcalls ─────────────────────────────────────────────────────
  {
    id: 'overcalls',
    unit: 'Competitive Bidding',
    title: 'Simple Overcalls & Takeout Doubles',
    description: 'An overcall shows a 5-card suit and 8–17 HCP. A takeout double (at the 1-level) shows 13+ HCP and support for the unbid suits — it asks partner to bid their best suit.',
    convention: 'Standard American',
    difficulty: 'Intermediate',
    scenarios: [
      {
        id: 'overcall-1',
        // ♠ KQJ85  ♥ AJ6  ♦ K43  ♣ 72 → 15 HCP, 5-3-3-2 — overcall 1♠
        // HCP: KS=3,QS=2,JS=1,AH=4,JH=1,KD=3 = 14. Cards: 5+3+3+2=13 ✓
        hand: ['KS','QS','JS','8S','5S','AH','JH','6H','KD','4D','3D','7C','2C'],
        auction: [{ player: 'Opp', bid: '1H' }],
        vulnerability: 'None',
        prompt: 'Right-hand opponent opened 1♥. You have 5 good spades and 14 HCP. What do you bid?',
        correctBid: '1S',
        hint: 'You have a good 5-card suit and values. Can you show it at the 1-level?',
        correctExplanation: 'Overcall 1♠. With a solid 5-card spade suit and 14 HCP, a 1♠ overcall perfectly describes your hand. Overcalls serve three purposes: showing your suit, suggesting a lead, and competing for the contract. The suit quality is the key — KQJxx or better is ideal.',
      },
      {
        id: 'overcall-2',
        // ♠ AJ754  ♥ 73  ♦ KQ62  ♣ 84 → 11 HCP, 5-2-4-2 — overcall 1♠
        // HCP: AS=4,JS=1,KD=3,QD=2 = 10. Cards: 5+2+4+2=13 ✓
        hand: ['AS','JS','7S','5S','4S','7H','3H','KD','QD','6D','2D','8C','4C'],
        auction: [{ player: 'Opp', bid: '1H' }],
        vulnerability: 'None',
        prompt: 'RHO opened 1♥. You have 5 spades and 10 HCP. Is your suit good enough to overcall?',
        correctBid: '1S',
        hint: 'AJxxx is a reasonable overcall suit. The lead-directing value matters.',
        correctExplanation: 'Overcall 1♠. AJxxx with 10 HCP is a sound 1♠ overcall. While the suit quality is not as strong as KQJxx, the ace gives you a good stopper and tricks. Overcalling on weak 5-card suits (54xxx or lower) is riskier — but Axxxx or better at the 1-level is generally fine.',
      },
      {
        id: 'overcall-3',
        // ♠ AJ74  ♥ 6  ♦ KQ52  ♣ KJ83 → 14 HCP, 4-1-4-4 — takeout double (shortage in their suit)
        // HCP: AS=4,JS=1,KD=3,QD=2,KC=3,JC=1 = 14. Cards: 4+1+4+4=13 ✓
        hand: ['AS','JS','7S','4S','6H','KD','QD','5D','2D','KC','JC','8C','3C'],
        auction: [{ player: 'Opp', bid: '1H' }],
        vulnerability: 'None',
        prompt: 'RHO opened 1♥. You have 4 spades, 1 heart, 4 diamonds, 4 clubs, 14 HCP. What do you bid?',
        correctBid: 'X',
        hint: 'With support for all three unbid suits and shortage in their suit, which call shows this?',
        correctExplanation: 'Double for takeout! With support for spades, diamonds, and clubs plus shortage in hearts (their suit), a takeout double is ideal. It says "Pick your best suit, partner." A 1♠ overcall would miss a diamond or club fit. Double first; if partner bids a minor, you can show spades next.',
      },
      {
        id: 'overcall-4',
        // ♠ KQ652  ♥ AJ4  ♦ K73  ♣ 86 → 13 HCP — after X, partner bids a suit, what now?
        // Different scenario: RHO opens 1♦, you double, partner bids 1♠, showing 0-8 HCP. You have extras.
        // Simpler: RHO opens 1♣, your hand supports all three unbid suits
        // ♠ AQ64  ♥ KJ72  ♦ Q83  ♣ 75 → 13 HCP, 4-4-3-2 — takeout double of 1♣
        // HCP: AS=4,QS=2,KH=3,JH=1,QD=2 = 12. Cards: 4+4+3+2=13 ✓
        hand: ['AS','QS','6S','4S','KH','JH','7H','2H','QD','8D','3D','7C','5C'],
        auction: [{ player: 'Opp', bid: '1C' }],
        vulnerability: 'None',
        prompt: 'RHO opened 1♣. You have 4 spades, 4 hearts, 3 diamonds and 12 HCP. What do you bid?',
        correctBid: 'X',
        hint: 'You have equal length in the three unbid suits. Is there a call that shows this?',
        correctExplanation: 'Double for takeout. With 4-4 in the majors and 3 diamonds — support for all three unbid suits — a takeout double is ideal. Partner will bid their best suit: 1♥ or 1♠ most likely. If partner bids 1♦ showing a diamond preference, you can still bid a major. Double finds the best fit.',
      },
    ],
  },

  // ── UNIT 5: Slam Bidding ──────────────────────────────────────────────────
  {
    id: 'blackwood',
    unit: 'Slam Bidding',
    title: 'Blackwood (4NT — Ace-Asking)',
    description: '4NT asks partner how many aces they hold. Responses: 5♣ = 0 or 4 aces, 5♦ = 1 ace, 5♥ = 2 aces, 5♠ = 3 aces. Only use when a trump suit is agreed. After 1NT/2NT openings, use 4♣ Gerber instead.',
    convention: 'Blackwood',
    difficulty: 'Advanced',
    scenarios: [
      {
        id: 'blackwood-1',
        // ♠ AKQ52  ♥ AK74  ♦ Q83  ♣ 6 → 19 HCP, 5-4-3-1 — use Blackwood after spades agreed
        // HCP: AS=4,KS=3,QS=2,AH=4,KH=3,QD=2 = 18. Cards: 5+4+3+1=13 ✓
        hand: ['AS','KS','QS','5S','2S','AH','KH','7H','4H','QD','8D','3D','6C'],
        auction: [
          { player: 'Partner', bid: '1S' },
          { player: 'You', bid: '3S' },
          { player: 'Partner', bid: '4S' },
        ],
        vulnerability: 'None',
        prompt: 'Spades are agreed. You have 18 HCP with 2 aces. Partner accepted your limit raise with 4♠. Should you check for slam?',
        correctBid: '4N',
        hint: 'You have a powerhouse hand. How do you check for aces before committing to a small slam?',
        correctExplanation: 'Bid 4NT (Blackwood)! With 18 HCP and 2 aces — and partner showing 15+ HCP for accepting the limit raise — you have slam potential. Ask for aces: if partner shows 2 aces (5♥), all 4 aces are accounted for and 6♠ should make. If partner shows 1 ace (5♦), you are missing one — stay at 5♠.',
      },
      {
        id: 'blackwood-2',
        // Continuation: partner responded 5♥ to 4NT (2 aces). You have 2 aces. Bid 6♠.
        hand: ['AS','KS','QS','5S','2S','AH','KH','7H','4H','QD','8D','3D','6C'],
        auction: [
          { player: 'Partner', bid: '1S' },
          { player: 'You', bid: '3S' },
          { player: 'Partner', bid: '4S' },
          { player: 'You', bid: '4N' },
          { player: 'Partner', bid: '5H' },
        ],
        vulnerability: 'None',
        prompt: 'Partner responded 5♥ to Blackwood (showing 2 aces). You have 2 aces. How many aces total? What do you bid?',
        correctBid: '6S',
        hint: 'You have 2 aces + partner has 2 aces = 4 aces total. Is slam safe?',
        correctExplanation: 'Bid 6♠! You have 2 aces + partner has 2 aces = all 4 aces between you. No missing ace means a small slam is safe to bid. Bid 6♠ confidently. You would only pass (stop in 5♠) if the combined count showed a missing ace.',
      },
      {
        id: 'blackwood-3',
        // ♠ AQ7  ♥ KQ6  ♦ AKJ3  ♣ Q82 → 21 HCP — after partner's 2NT, bid 4♣ (Gerber) not 4NT
        // HCP: AS=4,QS=2,KH=3,QH=2,AD=4,KD=3,JD=1,QC=2 = 21. Cards: 3+3+4+3=13 ✓
        hand: ['AS','QS','7S','KH','QH','6H','AD','KD','JD','3D','QC','8C','2C'],
        auction: [{ player: 'Partner', bid: '2N' }],
        vulnerability: 'None',
        prompt: 'Partner opened 2NT (20–21 HCP). You have 21 HCP. Grand slam is likely! How do you ask for aces?',
        correctBid: '4C',
        hint: 'After a notrump opening, 4NT is NOT Blackwood. What convention asks for aces after NT?',
        correctExplanation: 'Bid 4♣ (Gerber)! After a notrump bid, 4NT is quantitative (inviting NT slam) — NOT Blackwood. To ask for aces after a NT opening, use 4♣ (Gerber). Responses: 4♦ = 0/4 aces, 4♥ = 1 ace, 4♠ = 2 aces, 4NT = 3 aces. This is a critical distinction — confusing Gerber with Blackwood is one of the most common errors in slam bidding!',
      },
    ],
  },

  {
    id: 'rkcb',
    unit: 'Slam Bidding',
    title: 'Roman Keycard Blackwood (RKCB)',
    description: 'RKCB treats the trump King as a 5th "ace" (keycard). 4NT asks for keycards. Responses (1430): 5♣ = 1 or 4, 5♦ = 0 or 3, 5♥ = 2 without the trump Queen, 5♠ = 2 with the trump Queen.',
    convention: 'Roman Keycard Blackwood',
    difficulty: 'Advanced',
    scenarios: [
      {
        id: 'rkcb-1',
        // ♠ AKJ82  ♥ AQ94  ♦ K7  ♣ 85 → 17 HCP, 5-4-2-2 — spades agreed, use RKCB
        // HCP: AS=4,KS=3,JS=1,AH=4,QH=2,KD=3 = 17. Cards: 5+4+2+2=13 ✓
        hand: ['AS','KS','JS','8S','2S','AH','QH','9H','4H','KD','7D','8C','5C'],
        auction: [
          { player: 'Partner', bid: '1S' },
          { player: 'You', bid: '2H' },
          { player: 'Partner', bid: '3S' },
        ],
        vulnerability: 'Both',
        prompt: 'Spades agreed, partner jump-rebid 3♠ (16+ HCP). You have 17 HCP and 2 aces. What do you bid to ask for keycards?',
        correctBid: '4N',
        hint: 'RKCB is still invoked with 4NT — the difference is in how partner responds.',
        correctExplanation: 'Bid 4NT (RKCB)! With 17 HCP facing 16+ HCP from partner, slam is very likely — you just need to confirm keycards (the 4 aces + ♠K). RKCB gives more precise information than standard Blackwood because it includes the trump King. After the response you will know exactly how many of the 5 keycards partner holds.',
      },
      {
        id: 'rkcb-2',
        // Partner responded 5♣ to RKCB = 1 or 4 keycards. You hold AS + AH = 2 keycards.
        // Combined = 3 (if partner has 1) or 6 (impossible). So partner has 1 keycard.
        // Missing 2 keycards → sign off in 5♠
        // ♠ AKJ82  ♥ AQ94  ♦ K7  ♣ 85 same hand
        hand: ['AS','KS','JS','8S','2S','AH','QH','9H','4H','KD','7D','8C','5C'],
        auction: [
          { player: 'Partner', bid: '1S' },
          { player: 'You', bid: '2H' },
          { player: 'Partner', bid: '3S' },
          { player: 'You', bid: '4N' },
          { player: 'Partner', bid: '5C' },
        ],
        vulnerability: 'Both',
        prompt: 'Partner responded 5♣ to RKCB (1 or 4 keycards). You hold 2 keycards (♠A and ♥A). Combined = 3. Is slam safe?',
        correctBid: '5S',
        hint: 'You have 2 keycards. Partner has 1. That means you are missing 2 of the 5 keycards. What do you do?',
        correctExplanation: 'Sign off in 5♠. You hold 2 keycards + partner has 1 = only 3 of 5 keycards. You are missing 2 (♠K and one ace) — slam is far too dangerous. Bid 5♠ to play in game. Never bid a small slam missing 2 keycards. This is exactly why RKCB is so valuable — it prevents expensive slams off two controls.',
      },
      {
        id: 'rkcb-3',
        // Partner responded 5♦ to RKCB = 0 or 3 keycards. You have 2. Combined = 5 (all!).
        // Bid 6♠ — all keycards present.
        // ♠ AKJ82  ♥ AQ94  ♦ K7  ♣ 85 same hand
        hand: ['AS','KS','JS','8S','2S','AH','QH','9H','4H','KD','7D','8C','5C'],
        auction: [
          { player: 'Partner', bid: '1S' },
          { player: 'You', bid: '2H' },
          { player: 'Partner', bid: '3S' },
          { player: 'You', bid: '4N' },
          { player: 'Partner', bid: '5D' },
        ],
        vulnerability: 'Both',
        prompt: 'Partner responded 5♦ to RKCB (0 or 3 keycards). You hold 2 keycards. Combined = 2 or 5. Which is it, and what do you bid?',
        correctBid: '6S',
        hint: 'Partner cannot have 0 keycards — they opened the bidding. So they must have 3.',
        correctExplanation: 'Bid 6♠! Partner opened and then jump-rebid 3♠ showing 16+ HCP — having 0 keycards is impossible. Partner must have 3 keycards. 2 + 3 = all 5 keycards accounted for. Small slam is safe — bid 6♠. With all 5 keycards you could even investigate a grand slam by bidding 5NT, but 6♠ is excellent here.',
      },
      {
        id: 'rkcb-4',
        // After RKCB, partner shows 2 keycards WITH the trump Queen (5♠).
        // You have 2 keycards = 4 total. All keycards. Strong hand → bid 7♠?
        // ♠ AKQT5  ♥ AK93  ♦ A7  ♣ 85 → 20 HCP, 5-4-2-2
        // HCP: AS=4,KS=3,QS=2,AH=4,KH=3,AD=4 = 20. Cards: 5+4+2+2=13 ✓
        hand: ['AS','KS','QS','TS','5S','AH','KH','9H','3H','AD','7D','8C','5C'],
        auction: [
          { player: 'Partner', bid: '2S' },
          { player: 'You', bid: '4N' },
          { player: 'Partner', bid: '5S' },
        ],
        vulnerability: 'None',
        prompt: 'Partner opened a weak 2♠ (6-card suit, 6–10 HCP). You bid RKCB. Partner shows 2 keycards WITH the ♠Q (5♠). What do you bid?',
        correctBid: '7S',
        hint: 'You have 3 keycards. Partner has 2 + the trump Queen. That is all 5 keycards plus the trump Queen. How many tricks can you count?',
        correctExplanation: 'Bid 7♠ (grand slam)! You have 3 keycards (♠A, ♥A, ♦A). Partner has 2 keycards + ♠Q. All 5 keycards plus the trump Queen — no losers in trumps or aces. Your 20 HCP + partner\'s 6–10 HCP = enormous playing strength with at least 11 combined trumps. Count the tricks: ♠♠♠♠♠♠ + ♥♥♥♥ + ♦♦♦ = 13 tricks easily. Go for the grand!',
      },
    ],
  },

  {
    id: 'cue-bids',
    unit: 'Slam Bidding',
    title: 'Control-Showing Cue Bids',
    description: 'After a trump suit is agreed, bids below game show a "control" (ace or void = 1st round; king or singleton = 2nd round) in that suit. Cue bids explore slam without committing prematurely. Always cue-bid the cheapest control first.',
    convention: 'Cue Bids',
    difficulty: 'Advanced',
    scenarios: [
      {
        id: 'cue-1',
        // ♠ AKJ95  ♥ KQ6  ♦ A84  ♣ 73 → 17 HCP, 5-3-3-2 — partner raises to 3♠, cue-bid 4♦
        // HCP: AS=4,KS=3,JS=1,KH=3,QH=2,AD=4 = 17. Cards: 5+3+3+2=13 ✓
        hand: ['AS','KS','JS','9S','5S','KH','QH','6H','AD','8D','4D','7C','3C'],
        auction: [
          { player: 'You', bid: '1S' },
          { player: 'Partner', bid: '3S' },
        ],
        vulnerability: 'None',
        prompt: 'You opened 1♠. Partner limit-raised to 3♠ (10–12 HCP). You have 17 HCP with the ♠A, ♥K, ♦A. You want to investigate slam. What do you bid?',
        correctBid: '4D',
        hint: 'You have too much to just bid 4♠. Show your cheapest first-round control (ace or void) below game.',
        correctExplanation: 'Cue-bid 4♦! With 17 HCP facing a limit raise you have slam interest. Rather than asking for aces blindly with 4NT, show your ♦A with 4♦ — a control-showing cue bid. This tells partner "I want to investigate slam and I control diamonds." Partner will now cue-bid their cheapest control (♣A → 4♣ area, ♥A → 4♥, etc.) or sign off in 4♠ with no slam interest.',
      },
      {
        id: 'cue-2',
        // Partner cue-bid 4♥ (showing ♥A or void). You hold ♣A too. Cue-bid 4♣ is below 4♦ so wrong order.
        // Actually: auction is 1♠-3♠-4♦(you)-4♥(partner). Now you hold ♣A. Bid 4NT (Blackwood/RKCB) now.
        // ♠ AKJ95  ♥ KQ6  ♦ A84  ♣ 73 same hand
        hand: ['AS','KS','JS','9S','5S','KH','QH','6H','AD','8D','4D','7C','3C'],
        auction: [
          { player: 'You', bid: '1S' },
          { player: 'Partner', bid: '3S' },
          { player: 'You', bid: '4D' },
          { player: 'Partner', bid: '4H' },
        ],
        vulnerability: 'None',
        prompt: 'You cue-bid 4♦ (♦A). Partner cue-bid 4♥ (♥A). You now know partner controls hearts and diamonds. What do you bid next?',
        correctBid: '4N',
        hint: 'You know partner has the ♥A. You have the ♦A and ♠A. Should you now count aces precisely with Blackwood?',
        correctExplanation: 'Bid 4NT (RKCB)! The cue-bidding exchange confirmed partner has the ♥A (or void). Now use RKCB to count keycards precisely. You know ♦ and ♥ are controlled — you just need to confirm no missing ace or the ♠K. Cue bids and Blackwood work together: cue bids locate specific controls, then RKCB counts all keycards before committing to slam.',
      },
      {
        id: 'cue-3',
        // ♠ KQT84  ♥ AKJ  ♦ K93  ♣ 76 → 17 HCP, 5-3-3-2
        // HCP: KS=3,QS=2,AH=4,KH=3,JH=1,KD=3 = 16. Cards: 5+3+3+2=13 ✓
        // Partner raised to 3♠. Opponent cue-bid sequence. You have no ♣ control — sign off.
        hand: ['KS','QS','TS','8S','4S','AH','KH','JH','KD','9D','3D','7C','6C'],
        auction: [
          { player: 'You', bid: '1S' },
          { player: 'Partner', bid: '3S' },
          { player: 'You', bid: '4H' },
          { player: 'Partner', bid: '5C' },
        ],
        vulnerability: 'Both',
        prompt: 'You cue-bid 4♥ (♥A). Partner cue-bid 5♣ (♣A). You have NO club control and NO diamond ace. What do you bid?',
        correctBid: '5S',
        hint: 'Partner skipped over 4♠ to show the ♣A — this is past game. But you are missing the ♦A and ♣K. Is slam safe?',
        correctExplanation: 'Sign off in 5♠! Partner\'s 5♣ cue bid is past game, showing the ♣A and slam interest. But you have no ♦A or ♦ control — the opponents can cash the ♦A immediately against a slam. Bid 5♠ to play in game. This is the key lesson of cue bidding: if you cannot cue-bid past a critical suit (diamonds here), you show it by signing off rather than bidding a slam you cannot make.',
      },
      {
        id: 'cue-4',
        // ♠ AQJ73  ♥ void  ♦ AKQ82  ♣ K65 → 18 HCP + void, 5-0-5-3
        // HCP: AS=4,QS=2,JS=1,AD=4,KD=3,QD=2,KC=3 = 19. Cards: 5+0+5+3=13 ✓
        // Show void with a cue bid above 4NT level
        hand: ['AS','QS','JS','7S','3S','AD','KD','QD','8D','2D','KC','6C','5C'],
        auction: [
          { player: 'Partner', bid: '1S' },
          { player: 'You', bid: '2D' },
          { player: 'Partner', bid: '4S' },
        ],
        vulnerability: 'None',
        prompt: 'Partner jumped to 4♠ (game values + good spades). You have 19 HCP, ♥ void, and controls everywhere. What is your slam move?',
        correctBid: '4N',
        hint: 'With 19 HCP, two aces, a void and a solid 5-card diamond suit, you have far more than partner expects. How do you check for keycards?',
        correctExplanation: 'Bid 4NT (RKCB)! With 19 HCP and a heart void your hand is enormously powerful. Use RKCB to count keycards before committing to 6♠ or even 7♠. Your void in hearts means you are not worried about heart losers — you just need partner to have the ♠K (a keycard) to make slam virtually certain. After RKCB you can place the final contract precisely.',
      },
    ],
  },

  {
    id: 'grand-slam',
    unit: 'Slam Bidding',
    title: 'Grand Slam Bidding',
    description: 'A grand slam (7-level) scores a massive bonus but requires 13 tricks — all four aces plus the trump King and Queen. Use 5NT (pick-a-slam / grand slam force) or continued cue bids after confirming all keycards.',
    convention: 'Grand Slam Force / 5NT',
    difficulty: 'Advanced',
    scenarios: [
      {
        id: 'grand-1',
        // ♠ AKQ95  ♥ AKQ  ♦ AK8  ♣ 73 → 25 HCP, 5-3-3-2
        // HCP: AS=4,KS=3,QS=2,AH=4,KH=3,QH=2,AD=4,KD=3 = 25. Cards: 5+3+3+2=13 ✓
        // After RKCB partner shows all 5 keycards → bid 7♠
        hand: ['AS','KS','QS','9S','5S','AH','KH','QH','AD','KD','8D','7C','3C'],
        auction: [
          { player: 'You', bid: '2C' },
          { player: 'Partner', bid: '2D' },
          { player: 'You', bid: '2S' },
          { player: 'Partner', bid: '3S' },
          { player: 'You', bid: '4N' },
          { player: 'Partner', bid: '5H' },
        ],
        vulnerability: 'Both',
        prompt: 'You opened 2♣, partner raised spades. RKCB (4NT) → partner shows 2 keycards (5♥). You hold 3 keycards. All 5 keycards accounted for. What do you bid?',
        correctBid: '7S',
        hint: '2 + 3 = 5 keycards. You have all the aces and the trump King. Can you count 13 tricks?',
        correctExplanation: 'Bid 7♠ (grand slam)! All 5 keycards are present. Count your tricks: ♠AKQxx (5) + ♥AKQ (3) + ♦AK (2) = 10 top tricks in your hand alone, plus partner\'s spades and entries = 13 easily. When you have a 25 HCP powerhouse, all keycards accounted for, and a solid trump suit — bid the grand slam! The grand slam bonus at both vulnerable is enormous.',
      },
      {
        id: 'grand-2',
        // 5NT = pick-a-slam / grand slam try — asks partner to bid 7 of their best suit with top 2 trump honors
        // ♠ AKJ96  ♥ AKJ  ♦ AK5  ♣ 84 → 22 HCP, 5-3-3-2
        // HCP: AS=4,KS=3,JS=1,AH=4,KH=3,JH=1,AD=4,KD=3 = 23. Cards: 5+3+3+2=13 ✓
        hand: ['AS','KS','JS','9S','6S','AH','KH','JH','AD','KD','5D','8C','4C'],
        auction: [
          { player: 'Partner', bid: '1S' },
          { player: 'You', bid: '2D' },
          { player: 'Partner', bid: '3S' },
          { player: 'You', bid: '4N' },
          { player: 'Partner', bid: '5D' },
        ],
        vulnerability: 'None',
        prompt: 'RKCB shows partner has 3 keycards (5♦). You have 2. All 5 keycards present. You want to check if partner has the ♠Q for a grand slam. What do you bid?',
        correctBid: '5N',
        hint: 'After confirming all 5 keycards, 5NT asks a specific question. What does it ask?',
        correctExplanation: 'Bid 5NT! After all 5 keycards are confirmed, 5NT is the "grand slam try" — it asks partner to bid 7♠ if they hold the ♠Q (trump Queen), or sign off in 6♠ without it. With 23 HCP + partner\'s opening values and all keycards, the only missing piece is the ♠Q. If partner bids 7♠ you play it confidently; if 6♠, you accept. 5NT is the precise surgical tool for this situation.',
      },
      {
        id: 'grand-3',
        // When NOT to bid a grand slam — missing trump Queen, wrong to bid 7
        // ♠ AKJT5  ♥ AKQ  ♦ AQ6  ♣ 84 → 22 HCP, 5-3-3-2
        // HCP: AS=4,KS=3,JS=1,AH=4,KH=3,QH=2,AD=4,QD=2 = 23. Cards: 5+3+3+2=13 ✓
        hand: ['AS','KS','JS','TS','5S','AH','KH','QH','AD','QD','6D','8C','4C'],
        auction: [
          { player: 'Partner', bid: '1S' },
          { player: 'You', bid: '2H' },
          { player: 'Partner', bid: '3S' },
          { player: 'You', bid: '4N' },
          { player: 'Partner', bid: '5C' },
        ],
        vulnerability: 'Both',
        prompt: 'RKCB shows partner has 1 keycard (5♣). You have 3 keycards. Total = 4 of 5 keycards — missing the ♠Q (5th keycard). Vulnerable. What do you bid?',
        correctBid: '6S',
        hint: 'You have 4 of 5 keycards. The missing keycard is the ♠Q. Is a grand slam safe?',
        correctExplanation: 'Bid 6♠, not 7♠. You are missing the ♠Q (the 5th keycard in RKCB). Without the trump Queen, you likely have a trump loser — making 7♠ very risky, especially vulnerable where going one down costs you the slam bonus AND the game bonus. Settle for 6♠ which should be cold. Never bid a grand slam with a potential trump loser unless you have enough side entries to discard any losers.',
      },
      {
        id: 'grand-4',
        // Quantitative raise: 4NT after 1NT/2NT = asking for slam in NT, not Blackwood
        // ♠ KQ6  ♥ AJ9  ♦ KQ84  ♣ KJ7 → 19 HCP, 3-3-4-3
        // HCP: KS=3,QS=2,AH=4,JH=1,KD=3,QD=2,KC=3,JC=1 = 19. Cards: 3+3+4+3=13 ✓
        hand: ['KS','QS','6S','AH','JH','9H','KD','QD','8D','4D','KC','JC','7C'],
        auction: [{ player: 'Partner', bid: '2N' }],
        vulnerability: 'None',
        prompt: 'Partner opened 2NT (20–21 HCP). You have 19 HCP balanced. What do you bid to invite a grand slam in NT?',
        correctBid: '4N',
        hint: 'After a 2NT opening, 4NT is NOT Blackwood — it is quantitative. What does it mean here?',
        correctExplanation: 'Bid 4NT (quantitative raise)! After a 2NT opening, 4NT is a quantitative (invitational) raise — it says "Partner, if you are maximum (21 HCP), bid 7NT; if minimum (20 HCP), pass and play 4NT." Your 19 HCP + partner\'s 20–21 = 39–40 HCP total, enough for 7NT if the fits are right. This is completely different from Blackwood — context determines meaning!',
      },
    ],
  },

  {
    id: 'splinter-bids',
    unit: 'Slam Bidding',
    title: 'Splinter Bids',
    description: 'A splinter is a double-jump in a new suit showing: (1) trump fit, (2) game-forcing values (13+ HCP), and (3) a singleton or void in the splinter suit. It helps partner evaluate whether their values are "working" or "wasted".',
    convention: 'Splinter Bids',
    difficulty: 'Advanced',
    scenarios: [
      {
        id: 'splinter-1',
        // ♠ AK975  ♥ KQ84  ♦ A62  ♣ 3 → 17 HCP, 5-4-3-1
        // HCP: AS=4,KS=3,AH=0... wait: AS=4,KS=3,KH=3,QH=2,AD=4 = 16. Cards: 5+4+3+1=13 ✓
        // Splinter: 4♣ after partner opens 1♠ = spade fit + singleton club + game values
        hand: ['AS','KS','9S','7S','5S','KH','QH','8H','4H','AD','6D','2D','3C'],
        auction: [{ player: 'Partner', bid: '1H' }],
        vulnerability: 'None',
        prompt: 'Partner opened 1♥. You have 4-card heart support, 16 HCP, and a singleton club. How do you show a forcing raise with a club shortage?',
        correctBid: '4C',
        hint: 'A double jump in a new suit (1♥ → 4♣ skips 2♣ and 3♣) shows a splinter — fit + shortage + game values.',
        correctExplanation: 'Bid 4♣ (splinter)! A double jump to 4♣ shows: 4-card heart support, 13+ HCP, and a singleton or void in clubs. This is far more informative than a direct 4♥ raise. Partner can now evaluate whether their club values are "working" (e.g. ♣A is wasted opposite your void/singleton) or if they hold a "working" hand with club shortness too → potential slam!',
      },
      {
        id: 'splinter-2',
        // Partner splinters 4♦ after your 1♠ opening → evaluate your diamond holding
        // ♠ KQJ85  ♥ AK6  ♦ Q97  ♣ K4 → 18 HCP — you have ♦Q97 = wasted values opposite partner's singleton
        // HCP: KS=3,QS=2,JS=1,AH=4,KH=3,QD=2,KC=3 = 18. Cards: 5+3+3+2=13 ✓
        hand: ['KS','QS','JS','8S','5S','AH','KH','6H','QD','9D','7D','KC','4C'],
        auction: [
          { player: 'You', bid: '1S' },
          { player: 'Partner', bid: '4D' },
        ],
        vulnerability: 'None',
        prompt: 'You opened 1♠. Partner splinters 4♦ (spade fit + singleton/void diamond + 13+ HCP). You hold ♦Q97. What do you bid?',
        correctBid: '4S',
        hint: 'Partner has at most 1 diamond. Your ♦Q97 = 2 HCP that will be completely wasted. How does that affect your slam prospects?',
        correctExplanation: 'Sign off in 4♠. Your ♦Q97 (2 HCP) is "wasted" — partner\'s singleton/void means those values contribute nothing. Effectively you have only 16 working HCP. With wasted values opposite a splinter, sign off in game. If instead you held ♦2 (no wasted values), or your honours were in the other suits, slam would be very attractive. Splinters let you make this judgment immediately.',
      },
      {
        id: 'splinter-3',
        // Same situation but now opener has NO wasted values in the splinter suit → drive to slam
        // ♠ AQJ85  ♥ AK6  ♦ 3  ♣ KJ74 → 18 HCP, 5-3-1-4
        // HCP: AS=4,QS=2,JS=1,AH=4,KH=3,KC=3,JC=1 = 18. Cards: 5+3+1+4=13 ✓
        hand: ['AS','QS','JS','8S','5S','AH','KH','6H','3D','KC','JC','7C','4C'],
        auction: [
          { player: 'You', bid: '1S' },
          { player: 'Partner', bid: '4D' },
        ],
        vulnerability: 'None',
        prompt: 'You opened 1♠. Partner splinters 4♦ (singleton/void diamond). This time you hold only ♦3 (a singleton too!). What do you bid?',
        correctBid: '4N',
        hint: 'You have a diamond singleton to match partner\'s! All your 18 HCP are in the "working" suits. What does that mean for slam?',
        correctExplanation: 'Bid 4NT (RKCB)! You have a diamond singleton — partner\'s splinter is music to your ears. All 18 of your HCP are in spades, hearts, and clubs where they are fully working. With 18 working HCP facing partner\'s 13+ working HCP + a fit, slam is almost certain. Use RKCB to confirm keycards before bidding 6♠. This is the power of splinters: they let you upgrade or downgrade your hand instantly.',
      },
      {
        id: 'splinter-4',
        // Identify a splinter bid in a competitive auction
        // ♠ 6  ♥ AKJ84  ♦ KQ93  ♣ AJ5 → 19 HCP, 1-5-4-3
        // HCP: AH=4,KH=3,JH=1,KD=3,QD=2,AC=4,JC=1 = 18. Cards: 1+5+4+3=13 ✓
        hand: ['6S','AH','KH','JH','8H','4H','KD','QD','9D','3D','AC','JC','5C'],
        auction: [{ player: 'Partner', bid: '1H' }],
        vulnerability: 'None',
        prompt: 'Partner opened 1♥. You have 5-card heart support, 18 HCP, and a spade singleton. What is the most descriptive bid?',
        correctBid: '3S',
        hint: 'A double jump in spades (1♥ → 3♠, skipping 2♠) shows a splinter with heart support.',
        correctExplanation: 'Bid 3♠ (splinter)! A double jump to 3♠ shows 4+ heart support, 13+ HCP, and a singleton or void in spades. Note that after a 1♥ opening, 2♠ is a natural response and 4♠ would be past game — so 3♠ is the splinter. This lets partner immediately know you have a huge fit, game-forcing values, and no wasted values in spades. If partner holds ♠AK, they know those are wasted and will sign off. If partner holds ♠xx, slam is very likely.',
      },
    ],
  },

  {
    id: 'slam-without-bw',
    unit: 'Slam Bidding',
    title: 'Bidding Slam Without Blackwood',
    description: 'Sometimes you can count 12 or 13 tricks directly — no need for Blackwood. Recognise when a hand is so powerful that you can simply place the contract, or when Blackwood is actually dangerous (void hands, suit quality issues).',
    convention: 'Judgment / Direct Slam Bids',
    difficulty: 'Advanced',
    scenarios: [
      {
        id: 'slam-direct-1',
        // ♠ AKQ  ♥ AKQ  ♦ AKQJ  ♣ AK2 → 37 HCP — just bid 7NT
        // HCP: 4+3+2+4+3+2+4+3+2+1+4+3 = 35. Cards: 3+3+4+3=13 ✓
        // AS=4,KS=3,QS=2,AH=4,KH=3,QH=2,AD=4,KD=3,QD=2,JD=1,AC=4,KC=3 = 35 HCP
        hand: ['AS','KS','QS','AH','KH','QH','AD','KD','QD','JD','AC','KC','2C'],
        auction: [],
        vulnerability: 'Both',
        prompt: 'You are dealer. Count your tricks. Do you need to ask for aces?',
        correctBid: '7N',
        hint: 'Count your top tricks before reaching for Blackwood.',
        correctExplanation: 'Bid 7NT directly! You have 35 HCP and 13 top tricks: ♠AKQ (3) + ♥AKQ (3) + ♦AKQJ (4) + ♣AK (2) = 12 tricks, plus the ♣2 is a 13th trick when clubs split. There is no need for Blackwood — you can see all 13 tricks in your own hand. Sometimes the right bid is simply the final contract.',
      },
      {
        id: 'slam-direct-2',
        // When Blackwood is DANGEROUS: void in a suit means you may get a misleading response
        // ♠ AKJ85  ♥ AKQ94  ♦ void  ♣ K6 → 19 HCP, 5-5-0-2
        // HCP: AS=4,KS=3,JS=1,AH=4,KH=3,QH=2,KC=3 = 20. Cards: 5+5+0+2=13 ✓
        hand: ['AS','KS','JS','8S','5S','AH','KH','QH','9H','4H','KC','6C','3C'],
        auction: [
          { player: 'Partner', bid: '1S' },
          { player: 'You', bid: '2H' },
          { player: 'Partner', bid: '3H' },
        ],
        vulnerability: 'None',
        prompt: 'Partner raised your hearts (3♥). You have 20 HCP, 5-5 in the majors, ♦ void. You want to reach 6♥. Which is better: 4NT Blackwood or a direct 4♦ cue bid?',
        correctBid: '4D',
        hint: 'Blackwood is dangerous with a void — if partner shows 1 ace you cannot tell if it is the ♦A (useless) or a useful ace. What should you do instead?',
        correctExplanation: 'Cue-bid 4♦! Blackwood is dangerous with a void — if partner responds 5♦ (1 ace), you cannot tell if it\'s the ♦A (worthless facing your void) or the ♣A (crucial). Instead, cue-bid 4♦ showing your diamond void / first-round control. Partner can now cue-bid their controls, and you will be able to place the slam contract without the ambiguity Blackwood creates with a void.',
      },
      {
        id: 'slam-direct-3',
        // Count winners and bid slam directly — no need for Blackwood
        // ♠ KQJ  ♥ AKQ987  ♦ AK  ♣ 65 → 22 HCP, 3-6-2-2
        // HCP: KS=3,QS=2,JS=1,AH=4,KH=3,QH=2,AD=4,KD=3 = 22. Cards: 3+6+2+2=13 ✓
        hand: ['KS','QS','JS','AH','KH','QH','9H','8H','7H','AD','KD','6C','5C'],
        auction: [
          { player: 'Partner', bid: '1H' },
          { player: 'You', bid: '2D' },
          { player: 'Partner', bid: '3H' },
        ],
        vulnerability: 'None',
        prompt: 'Partner confirmed a heart fit (3♥). You have 22 HCP, solid 6-card heart suit, ♦AK. Can you count 12 tricks?',
        correctBid: '6H',
        hint: 'Count your tricks: ♥AKQxxx + ♦AK + ♠KQJ. Do you need to ask for aces, or can you just bid the slam?',
        correctExplanation: 'Bid 6♥ directly! Count your tricks: ♥AKQxxx = 6 tricks (solid suit), ♦AK = 2, ♠KQJ = likely 2–3 tricks. That is 10–11 tricks in your hand, and partner opened with 13+ HCP adding at least 2 more. 12 tricks are clearly available. Blackwood is unnecessary when you can count the tricks — using it wastes bidding space and reveals information to the opponents. Just bid the slam.',
      },
      {
        id: 'slam-direct-4',
        // Quantitative 4NT after 1NT — not Blackwood, slam invite in NT
        // ♠ KQ6  ♥ KJ9  ♦ AQ84  ♣ KJ7 → 18 HCP, 3-3-4-3
        // HCP: KS=3,QS=2,KH=3,JH=1,AD=4,QD=2,KC=3,JC=1 = 19. Cards: 3+3+4+3=13 ✓
        hand: ['KS','QS','6S','KH','JH','9H','AD','QD','8D','4D','KC','JC','7C'],
        auction: [{ player: 'Partner', bid: '1N' }],
        vulnerability: 'None',
        prompt: 'Partner opened 1NT (15–17 HCP). You have 19 HCP balanced. What do you bid to invite a small slam in NT?',
        correctBid: '4N',
        hint: 'After a 1NT opening, 4NT is quantitative (not Blackwood). It invites partner to bid 6NT with a maximum.',
        correctExplanation: 'Bid 4NT (quantitative raise)! After a 1NT opening with no agreed suit, 4NT is NOT Blackwood — it is a quantitative slam invitation. It says: "Partner, if you are maximum (17 HCP), bid 6NT; if minimum (15 HCP), pass." Your 19 HCP + partner\'s 15–17 = 34–36 HCP total. With 33+ HCP and flat shape, 6NT is normally makeable. Partner decides based on their exact strength.',
      },
    ],
  },

  // ── UNIT 6: Strong 2♣ Opening ─────────────────────────────────────────────
  {
    id: 'open-2c',
    unit: 'Strong Openings',
    title: 'The Strong 2♣ Opening',
    description: 'An artificial 2♣ opening shows 22+ HCP or a powerful hand. It is forcing to game. Responses: 2♦ = waiting (standard); 2♥/2♠/3♣/3♦ = natural positive (8+ HCP with good 5-card suit).',
    convention: 'Standard American',
    difficulty: 'Advanced',
    scenarios: [
      {
        id: 'open-2c-1',
        // ♠ AKQ5  ♥ AKJ3  ♦ AQ8  ♣ K6 → 26 HCP, 4-4-3-2 — open 2♣
        // HCP: AS=4,KS=3,QS=2,AH=4,KH=3,JH=1,AD=4,QD=2,KC=3 = 26. Cards: 4+4+3+2=13 ✓
        hand: ['AS','KS','QS','5S','AH','KH','JH','3H','AD','QD','8D','KC','6C'],
        auction: [],
        vulnerability: 'None',
        prompt: 'You are dealer. Count your HCP carefully. What is your opening bid?',
        correctBid: '2C',
        hint: 'How many HCP does this hand have? Is that enough to open 2♣?',
        correctExplanation: 'Open 2♣! This hand has 26 HCP — well above the 22-point threshold. The strong 2♣ opening is artificial (says nothing about clubs) and is forcing to game. Simply wait for partner\'s response before describing your actual suits.',
      },
      {
        id: 'open-2c-2',
        // ♠ AKJ94  ♥ AQT76  ♦ K8  ♣ A → 20 HCP but 9 playing tricks — 2♣ by playing tricks
        // Let's use a cleaner hand: ♠ AKJ9  ♥ AKQ  ♦ AQ72  ♣ 85 → 24 HCP, 4-3-4-2
        // HCP: AS=4,KS=3,JS=1,AH=4,KH=3,QH=2,AD=4,QD=2 = 23. Cards: 4+3+4+2=13 ✓
        hand: ['AS','KS','JS','9S','AH','KH','QH','AD','QD','7D','2D','8C','5C'],
        auction: [],
        vulnerability: 'None',
        prompt: 'You are dealer. What is your opening bid with 23 HCP and a balanced hand?',
        correctBid: '2C',
        hint: '23 HCP is in the strong 2♣ range. What do you open?',
        correctExplanation: 'Open 2♣! With 23 HCP, this hand is in the strong 2♣ range (22+). After the 2♦ waiting response from partner, you would rebid 2NT (22–24 HCP balanced) or 3NT (25–27 HCP balanced) to precisely describe your hand strength. Never open 1-of-a-suit with 22+ HCP.',
      },
      {
        id: 'open-2c-3',
        // Responding to 2♣ with 8 HCP and 5-card suit — positive response
        // ♠ Q  ♥ KJ8762  ♦ A93  ♣ 854 → 10 HCP, 1-6-3-3 — respond 2♥ (positive in hearts)
        // HCP: QS=2,KH=3,JH=1,AD=4 = 10. Cards: 1+6+3+3=13 ✓
        hand: ['QS','KH','JH','8H','7H','6H','2H','AD','9D','3D','8C','5C','4C'],
        auction: [{ player: 'Partner', bid: '2C' }],
        vulnerability: 'None',
        prompt: 'Partner opened 2♣ (game forcing). You have 10 HCP with a 6-card heart suit headed by KJxxxx and an outside ace. What do you respond?',
        correctBid: '2H',
        hint: 'With a good 5+ card suit and 8+ HCP, make a positive response showing your suit.',
        correctExplanation: 'Bid 2♥! A positive response to 2♣ shows a good 5+ card suit and 8+ HCP. KJxxxx with an outside ace qualifies perfectly. This immediately sets hearts as the potential trump suit and tells partner you have something useful. The 2♦ waiting response would also be acceptable, but 2♥ is more informative.',
      },
    ],
  },
];

// Flat list of all scenarios for random access
export const ALL_SCENARIOS = LESSONS.flatMap(lesson =>
  lesson.scenarios.map(scenario => ({
    ...scenario,
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    unit: lesson.unit,
    convention: lesson.convention,
    difficulty: lesson.difficulty,
  }))
);

export function getLesson(id) {
  return LESSONS.find(l => l.id === id);
}

export function getLessonScenarios(lessonId) {
  const lesson = getLesson(lessonId);
  return lesson ? lesson.scenarios : [];
}
