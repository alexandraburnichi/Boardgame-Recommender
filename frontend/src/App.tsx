import { useState } from 'react'
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

      <div className="border-b border-white mb-12">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tighter">
            &gt; BOARDGAME_RECOMMENDER_V1 <span className="animate-pulse">_</span>
          </h1>

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
