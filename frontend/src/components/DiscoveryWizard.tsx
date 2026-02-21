import React, { useState, useEffect } from 'react';
import { getCategories, getRecommendations, type Game } from '../api';

interface DiscoveryWizardProps {
    onResults: (games: Game[]) => void;
    isLoading: boolean;
}

export const DiscoveryWizard: React.FC<DiscoveryWizardProps> = ({ onResults, isLoading }) => {
    const [allCategories, setAllCategories] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [minAge, setMinAge] = useState<number | ''>('');
    const [players, setPlayers] = useState<number | ''>('');
    const [error, setError] = useState('');

    useEffect(() => {
        getCategories()
            .then(setAllCategories)
            .catch(err => console.error("Failed to fetch categories", err));
    }, []);

    const toggleCategory = (cat: string) => {
        if (selectedCategories.includes(cat)) {
            setSelectedCategories(selectedCategories.filter(c => c !== cat));
        } else {
            setSelectedCategories([...selectedCategories, cat]);
        }
    };

    const handleSearch = async () => {
        setError('');
        if (selectedCategories.length === 0 && !minAge && !players) {
            setError("Please select at least one filter.");
            return;
        }

        try {
            const games = await getRecommendations(
                selectedCategories,
                minAge === '' ? undefined : Number(minAge),
                players === '' ? undefined : Number(players)
            );
            onResults(games);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch recommendations. Is the backend running?");
        }
    };

    return (
        <div className="bg-gray-900/20 backdrop-blur-lg border border-white/10 p-6 max-w-4xl mx-auto mb-12">
            <h2 className="text-xl font-bold mb-6 text-gray-200 uppercase border-b border-white/10 pb-2 tracking-widest text-xs">
        // COMMAND_CENTER
            </h2>

            <div className="mb-8">
                <label className="block text-gray-400 text-sm font-bold mb-3 uppercase tracking-wider">
                    [1] SELECT_CATEGORIES
                </label>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 border border-gray-700 bg-black custom-scrollbar">
                    {allCategories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => toggleCategory(cat)}
                            className={`px-3 py-1 text-sm font-mono transition-all border ${selectedCategories.includes(cat)
                                ? 'bg-white text-black border-white'
                                : 'bg-black text-gray-400 border-gray-800 hover:border-gray-500 hover:text-white'
                                }`}
                        >
                            {selectedCategories.includes(cat) ? '[x]' : '[ ]'} {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <label className="block text-gray-400 text-sm font-bold mb-2 uppercase tracking-wider">
                        [2] MIN_AGE
                    </label>
                    <input
                        type="number"
                        placeholder="0"
                        value={minAge}
                        onChange={e => setMinAge(Number(e.target.value))}
                        className="w-full bg-black border-b border-gray-600 px-2 py-3 text-white focus:border-white outline-none font-mono"
                    />
                </div>

                <div>
                    <label className="block text-gray-400 text-sm font-bold mb-2 uppercase tracking-wider">
                        [3] PLAYER_COUNT
                    </label>
                    <input
                        type="number"
                        placeholder="0"
                        value={players}
                        onChange={e => setPlayers(Number(e.target.value))}
                        className="w-full bg-black border-b border-gray-600 px-2 py-3 text-white focus:border-white outline-none font-mono"
                    />
                </div>
            </div>

            {error && (
                <div className="mb-4 p-2 border border-red-500 text-red-500 font-mono text-sm">
                    &gt; ERROR: {error}
                </div>
            )}

            <button
                onClick={handleSearch}
                disabled={isLoading}
                className="w-full py-4 border border-white font-bold text-lg hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase"
            >
                {isLoading ? (
                    <span className="flex items-center justify-center gap-2 animate-pulse">
                        &gt; EXECUTING_QUERY...
                    </span>
                ) : (
                    "&gt; RUN_RECOMMENDATION_ENGINE"
                )}
            </button>
        </div>
    );
};
