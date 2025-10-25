import { Link, useNavigate } from 'react-router-dom';

const AboutPage = () => {

    const navigate = useNavigate();

  return (
    // Page container
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-8">

      {/* Content container */}
      <div className="max-w-4xl mx-auto bg-gray-800 shadow-2xl rounded-lg p-6 sm:p-10">

        {/* Header */}
        <div className="relative text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-amber-300">
            About French Bid
          </h1>

          <button
            onClick={() => navigate(-1)} // This will go back to the previous page
            className="absolute top-0 left-0 text-teal-400 hover:text-teal-300 transition-colors cursor-pointer"
          >
            &larr; Go Back
          </button>

        </div>

        {/* --- Section: About the Game --- */}
        <section className="mb-8">
          <h2 className="section-title">About the Game</h2>
          <p className="section-content">
            **French Bid** is a fast-paced, multi-player card game of strategy, luck, and daring. Based on the classic rules, this web version brings the excitement of bidding and trump suits to your browser.
          </p>
          <p className="section-content mt-4">
            The game consists of 14 rounds of increasing difficulty. Players must bid on the exact number of "tricks" (sub-rounds) they believe they can win. Make your bid, and you'll be rewarded handsomely. Miss it, and you'll face the consequences.
          </p>
        </section>

        {/* --- Section: How to Play --- */}
        <section className="mb-8">
          <h2 className="section-title">How to Play</h2>
          <p className="section-content">
            The rules are simple, but the strategy is deep:
          </p>
          <ul className="list-disc list-outside pl-5 space-y-2 section-content mt-4">
            <li>Each round, players are dealt a number of cards equal to the round number.</li>
            <li>A "Trump Suit" is chosen, which beats all other suits.</li>
            <li>Players bid on how many tricks they'll win.</li>
            <li>Play your cards, follow suit, and use your trumps wisely to win the exact number of tricks you bid.</li>
          </ul>
          <p className="section-content mt-4">
            For a complete breakdown, check out the full rules.
          </p>
          <Link
            to="/game/rules"
            className="inline-block mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-500 rounded-md text-lg font-medium text-white transition-colors"
          >
            View Full Game Rules
          </Link>
        </section>

        {/* --- Section: The Developer --- */}
        <section className="mb-8">
          <h2 className="section-title">The Developer</h2>
          <p className="section-content">
            This game was designed and built by Jaswanth D. I am passionate about bringing classic card games to life with modern web technology.
          </p>
          {/* Optional: Add links
          <div className="mt-4 flex gap-4">
            <a href="[Your GitHub URL]" className="text-teal-400 hover:text-teal-300">GitHub</a>
            <a href="[Your LinkedIn URL]" className="text-teal-400 hover:text-teal-300">LinkedIn</a>
          </div>
          */}
        </section>

        {/* --- Section: Technology Used --- */}
        <section>
          <h2 className="section-title">Technology</h2>
          <p className="section-content">
            This application was built using:
          </p>
          <ul className="list-disc list-outside pl-5 space-y-2 section-content mt-4">
            <li>**React:** For building the user interface.</li>
            <li>**Vite:** For a blazing fast development and build experience.</li>
            <li>**React Router:** For all client-side navigation.</li>
            <li>**Tailwind CSS:** For the responsive and modern design.</li>
          </ul>
        </section>

      </div>
    </div>
  );
};

// --- CSS Classes ---
// Remember to add these to your 'index.css' file if you haven't!
/*
.section-title {
  @apply text-2xl sm:text-3xl font-semibold text-teal-300 border-b-2 border-teal-500 pb-2 mb-4;
}
.section-content {
  @apply text-base sm:text-lg leading-relaxed text-gray-300;
}
*/

export default AboutPage;
