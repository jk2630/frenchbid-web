import { useNavigate } from 'react-router-dom';

const GameRules = () => {

    const navigate = useNavigate();

  return (
    // Page container
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-8">

      {/* Rules container with max-width, centering, and styling */}
      <div className="max-w-4xl mx-auto bg-gray-800 shadow-2xl rounded-lg p-6 sm:p-10">

        {/* Header */}
        <div className="relative text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-amber-300">
            French Bid Rules
          </h1>
          {/* Back link to return to the game */}
          <button
            onClick={() => navigate(-1)} // This will go back to the previous page
            className="absolute top-0 left-0 text-teal-400 hover:text-teal-300 transition-colors cursor-pointer"
          >
            &larr; Go Back
          </button>
        </div>

        {/* --- Navigation Bar --- */}
        <nav className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8">
          <a href="#overview" className="nav-link">Overview</a>
          <a href="#dealer" className="nav-link">The Dealer</a>
          <a href="#setup" className="nav-link">Round Setup</a>
          <a href="#gameplay" className="nav-link">Gameplay</a>
          <a href="#scoring" className="nav-link">Scoring</a>
          <a href="#elimination" className="nav-link">Elimination</a>
          <a href="#winning" className="nav-link">Winning</a>
        </nav>

        {/* --- Section: Overview --- */}
        <section className="mb-8">
          <h2 id="overview" className="section-title">Overview</h2>
          <p className="section-content">
            French Bid is a multi-player card game. It can be played by any number of players, referred to as 'n'. The game consists of 14 total rounds.
          </p>
        </section>

        {/* --- Section: The Dealer --- */}
        <section className="mb-8">
          <h2 id="dealer" className="section-title">The Dealer</h2>
          <ul className="list-disc list-outside pl-5 space-y-2 section-content">
            <li>A dealer is chosen to deal the cards for the round.</li>
            <li>The role of dealer changes for the next round, passing to the adjacent player in an **anti-clockwise** direction.</li>
            <li>This rotation continues for every round of the game.</li>
          </ul>
        </section>

        {/* --- Section: Round Setup --- */}
        <section className="mb-8">
          <h2 id="setup" className="section-title">Round Setup</h2>
          <ul className="list-disc list-outside pl-5 space-y-2 section-content">
            <li>In each round, the number of cards dealt to each player is equal to the current round number.</li>
            <li>Before dealing, a random card is drawn from the deck. The suit of this card becomes the **Trump Suit** for the round.</li>
          </ul>
        </section>

        {/* --- Section: Gameplay --- */}
        <section className="mb-8">
          <h2 id="gameplay" className="section-title">Gameplay (Per Round)</h2>

          <h3 className="subsection-title">1. Bidding</h3>
          <ul className="list-disc list-outside pl-5 space-y-2 section-content">
            <li>Bidding starts with the player adjacent to the dealer, moving in a **clockwise** direction.</li>
            <li>Each player states a "bid," which is the number of sub-rounds they expect to win.</li>
            <li className="text-amber-300">
              <strong>Last Player Rule:</strong> The last player to bid must choose a number such that the total sum of all bids does **not** equal the current round number.
            </li>
          </ul>

          <h3 className="subsection-title">2. Playing a Sub-Round</h3>
          <ul className="list-disc list-outside pl-5 space-y-2 section-content">
            <li>The first sub-round is started by the player adjacent to the dealer, moving in an **anti-clockwise** direction.</li>
            <li>A sub-round consists of each player playing one card.</li>
            <li>The number of sub-rounds in a round is equal to the round number.</li>
            <li>The winner of a sub-round starts the next sub-round. This continues until all cards are played.</li>
          </ul>

          <h3 className="subsection-title">3. Card Rules</h3>
          <ul className="list-disc list-outside pl-5 space-y-2 section-content">
            <li>
              <strong>Base Card:</strong> The first card played in a sub-round is the "base card."
            </li>
            <li>
              <strong>Following Suit:</strong> All other players *must* play a card of the same suit as the base card if they have one.
            </li>
            <li>
              <strong>No Suit:</strong> If a player does not have a card of the base suit, they may play any card from their hand, including a Trump Card.
            </li>
            <li>
              <strong>Trump Card:</strong> A card of the Trump Suit. It can be played when a player cannot follow the base suit and has the power to win the sub-round.
            </li>
          </ul>

          <h3 className="subsection-title">4. Winning a Sub-Round</h3>
          <ul className="list-disc list-outside pl-5 space-y-2 section-content">
            <li>
              <strong>Scenario 1 (All Follow Suit):</strong> If all players play the base suit, the player who played the highest-numbered card of that suit wins.
            </li>
            <li>
              <strong>Scenario 2 (One Trump):</strong> If one player plays a trump card, that player wins the sub-round.
            </li>
            <li>
              <strong>Scenario 3 (Multiple Trumps):</strong> If multiple players play trump cards, the player who played the **highest-numbered trump card** wins.
            </li>
          </ul>
        </section>

        {/* --- Section: Scoring --- */}
        <section className="mb-8">
          <h2 id="scoring" className="section-title">Scoring (After each round)</h2>
          <p className="section-content mb-4">
            After all sub-rounds are complete, points are calculated for each player based on their bid versus the number of sub-rounds they actually won.
          </p>

          <div className="space-y-4">
            {/* ... (scoring boxes remain the same) ... */}
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-green-400">Bid 0 & Won 0</h4>
              <p>If a player bids 0 and wins 0 sub-rounds, they get <strong>[Round Number] points</strong>.</p>
              <p className="text-sm text-gray-400 italic">Example: In Round 4, this player gets 4 points.</p>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-green-400">Bid &gt; 0 & Won = Bid</h4>
              <p>If a player bids more than 0 and wins the *exact* number of sub-rounds they bid, they get <strong>[2 * Bid] points</strong>.</p>
              <p className="text-sm text-gray-400 italic">Example: In Round 6, a player bids 2 and wins 2. They get $2 * 2 = 4$ points.</p>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-red-400">Bid != Won</h4>
              <p>If a player wins a *different* number of sub-rounds than they bid (more or less), they get <strong>negative points</strong>.</p>
              <p>Formula: <code>-abs(Bid - Sub-rounds Won)</code></p>
              <p className="text-sm text-gray-400 italic">Example: Player bids 2 and wins 3. They get $-abs(2 - 3) = -1$ point.</p>
            </div>
          </div>
        </section>

        {/* --- Section: Elimination --- */}
        <section className="mb-8">
          <h2 id="elimination" className="section-title">Player Elimination</h2>
          <ul className="list-disc list-outside pl-5 space-y-2 section-content">
            <li>An elimination check occurs after each round.</li>
            <li>
              <strong>Condition:</strong> A player is eliminated if there are not enough cards in the deck for all players in the *next* round.
            </li>
            <li>
              <em>Example: 6 players finish Round 8. For Round 9, they would need $9 * 6 = 54$ cards, but a deck only has 52. One player must be eliminated. The game would then continue with 5 players ($9 * 5 = 45$ cards).</em>
            </li>
            <li>
              <strong>Who is Eliminated:</strong> The player with the **least number of total points** (last place on the leaderboard) is eliminated.
            </li>
            <li>
              <strong>Tie-breaker:</strong> If two or more players are tied for the lowest score, the **same round repeats** until a single player is in last place.
            </li>
          </ul>
        </section>

        {/* --- Section: Winning --- */}
        <section>
          <h2 id="winning" className="section-title">Winning the Game</h2>
          <p className="section-content">
            At the end of the 14th round, the player with the **highest number of total points** wins the game.
          </p>
        </section>

      </div>
    </div>
  );
};

export default GameRules;
