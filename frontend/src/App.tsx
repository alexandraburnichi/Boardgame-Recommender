import { useState, useEffect } from 'react'
import { DiscoveryWizard } from './components/DiscoveryWizard'
import { GameCard } from './components/GameCard'
import { GameDetailsModal } from './components/GameDetailsModal'
import { type Game, getPersonalRecommendations } from './api'

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [personalGames, setPersonalGames] = useState<Game[]>([]);
  const [currentUser, setCurrentUser] = useState('');
  const [userIdInput, setUserIdInput] = useState('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Typewriter animation for subtitles
  const line1 = '</> Hei :)';
  const line2 = '</> nice clean work, thought id contribute a smile here';
  const line3 = '</> sper să nu dai reject la PR :)';
  const line4 = '</> aHR0cHM6Ly9vcGVuLnNwb3RpZnkuY29tL3RyYWNrLzFSQ3RITHlxMXhJYmdHTXJZUnJLSjI/c2k9YTgwOGU3ZTcxZmU1NDc3Yw==';
  const [typed1, setTyped1] = useState('');
  const [typed2, setTyped2] = useState('');
  const [typed3, setTyped3] = useState('');
  const [typed4, setTyped4] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    const speed = 75;
    const timer1 = setInterval(() => {
      if (i < line1.length) {
        setTyped1(line1.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer1);
        let j = 0;
        const timer2 = setInterval(() => {
          if (j < line2.length) {
            setTyped2(line2.slice(0, j + 1));
            j++;
          } else {
            clearInterval(timer2);
            let k = 0;
            const timer3 = setInterval(() => {
              if (k < line3.length) {
                setTyped3(line3.slice(0, k + 1));
                k++;
              } else {
                clearInterval(timer3);
                let l = 0;
                const timer4 = setInterval(() => {
                  if (l < line4.length) {
                    setTyped4(line4.slice(0, l + 1));
                    l++;
                  } else {
                    clearInterval(timer4);
                    setTimeout(() => setShowCursor(false), 1500);
                  }
                }, speed);
              }
            }, speed);
          }
        }, speed);
      }
    }, speed);
    return () => clearInterval(timer1);
  }, []);

  const handleLogin = async () => {
    if (!userIdInput.trim()) return;
    try {
      const recs = await getPersonalRecommendations(userIdInput);
      setPersonalGames(recs);
      setCurrentUser(userIdInput);
    } catch (e) {
      alert("User ID not found or error fetching data.");
    }
  };

  const handleResults = (results: Game[]) => {
    setIsLoading(true);
    setTimeout(() => {
      setGames(results);
      setIsLoading(false);
      setHasSearched(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20">
      {selectedGame && (
        <GameDetailsModal
          game={selectedGame}
          onClose={() => setSelectedGame(null)}
        />
      )}

      {showInfo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setShowInfo(false)}
        >
          <div
            className="relative max-w-lg w-full mx-4 animate-fade-in-up bg-[#111] p-3 rounded-lg border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowInfo(false)}
              className="absolute -top-10 right-0 text-gray-400 hover:text-white font-mono text-sm transition-colors cursor-pointer"
            >
              [ ESC ]
            </button>
            <img
              src="/image.png"
              alt="System Architecture"
              className="w-full rounded border border-white/10"
            />
          </div>
        </div>
      )}

      <div className="border-b border-white mb-12">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tighter flex items-center gap-2">
              &gt; BOARDGAME_RECOMMENDER_V1 <span className="animate-pulse">_</span>
              <button
                onClick={() => setShowInfo(true)}
                className="text-sm md:text-base text-gray-600 hover:text-white border border-gray-700 hover:border-white rounded-full w-6 h-6 md:w-7 md:h-7 flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-110"
              >
                ?
              </button>
            </h1>
            <p className="text-xs md:text-sm font-mono text-gray-500 tracking-widest mt-1 ml-6">
              {typed1}{typed1.length < line1.length && showCursor ? <span className="animate-pulse">▌</span> : ''}
            </p>
            <p className="text-xs md:text-sm font-mono text-gray-500 tracking-widest mt-0.5 ml-6" style={{ minHeight: '1.25em' }}>
              {typed2}{typed1.length >= line1.length && typed2.length < line2.length && showCursor ? <span className="animate-pulse">▌</span> : ''}
            </p>
            <p className="text-xs md:text-sm font-mono text-gray-500 tracking-widest mt-0.5 ml-6" style={{ minHeight: '1.25em' }}>
              {typed3}{typed2.length >= line2.length && typed3.length < line3.length && showCursor ? <span className="animate-pulse">▌</span> : ''}
            </p>
            <p className="text-xs md:text-sm font-mono text-gray-500 tracking-widest mt-0.5 ml-6" style={{ minHeight: '1.25em' }}>
              {typed4}{typed3.length >= line3.length && typed4.length < line4.length && showCursor ? <span className="animate-pulse">▌</span> : ''}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {currentUser ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-400 font-mono text-sm">user: {currentUser}</span>
                <button
                  onClick={() => { setCurrentUser(''); setPersonalGames([]); }}
                  className="text-xs text-gray-600 hover:text-white font-mono"
                >
                  x
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group hover:opacity-100 opacity-60 transition-opacity duration-300">
                <span className="text-gray-500 text-xl font-bold">&gt;.</span>
                <input
                  type="text"
                  placeholder="user_id"
                  className="bg-transparent border-b border-transparent focus:border-gray-800 text-gray-400 focus:text-white px-0 py-1 font-mono text-sm w-24 outline-none transition-all placeholder-gray-600"
                  value={userIdInput}
                  onChange={(e) => setUserIdInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
                <button
                  onClick={handleLogin}
                  className="text-white animate-pulse font-bold hover:text-gray-400"
                  title="Access Restricted Area"
                >
                  <span className="inline-block w-2 H-4 bg-white/50"></span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">

        {currentUser && personalGames.length > 0 && (
          <div className="mb-16 animate-fade-in-up">
            <div className="flex items-center justify-between mb-8 pb-2 border-b border-white/5">
              <h2 className="text-sm tracking-widest text-gray-500 font-mono lowercase">
                ~/user/recommendations
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {personalGames.map(game => (
                <GameCard
                  key={game.objectid}
                  game={game}
                  onClick={() => setSelectedGame(game)}
                />
              ))}
            </div>
          </div>
        )}

        <DiscoveryWizard onResults={async (g) => handleResults(g)} isLoading={isLoading} />

        {hasSearched && (
          <div className="mt-16 animate-fade-in-up">
            <div className="flex items-center justify-between mb-8 border-b border-dashed border-gray-700 pb-2">
              <h2 className="text-xl font-bold text-white uppercase">
                &gt; SEARCH_RESULTS
              </h2>
              <span className="text-sm font-mono text-gray-400">
                [{games.length}_ITEMS_FOUND]
              </span>
            </div>

            {games.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {games.map(game => (
                  <GameCard
                    key={game.objectid}
                    game={game}
                    onClick={() => setSelectedGame(game)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-white border-dashed">
                <p className="text-xl text-gray-400 font-mono">
                  &gt; NO_MATCHES_FOUND
                  <br />
                  &gt; TRY_RELAXING_PARAMETERS
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
