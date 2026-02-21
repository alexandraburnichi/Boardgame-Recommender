import React from 'react';
import type { Game } from '../api';

interface GameCardProps {
    game: Game;
    onClick?: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onClick }) => {
    const categories = Array.isArray(game.boardgamecategory)
        ? game.boardgamecategory
        : (typeof game.boardgamecategory === 'string' ? game.boardgamecategory.replace(/[\[\]']/g, "").split(',') : []);

    const displayCats = categories.slice(0, 3);

    return (
        <div
            onClick={onClick}
            className="p-6 bg-gray-900/40 backdrop-blur-md border border-white/5 rounded-none group hover:bg-gray-900/60 transition-all duration-500 cursor-pointer min-h-[12rem] flex flex-col justify-between"
        >
            <div>
                <h3 className="text-xl font-bold text-white mb-2 font-serif tracking-tight leading-none group-hover:text-gray-300 transition-colors">
                    {game.name}
                </h3>
                <div className="flex items-center gap-3 text-xs font-mono text-gray-500 mb-4">
                    <span>{game.yearpublished}</span>
                    <span>//</span>
                    <span>{game.minplayers ? `${game.minplayers}-${game.maxplayers}P` : 'N/A'}</span>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                    {displayCats.map((cat, i) => (
                        <span key={i} className="text-[10px] uppercase tracking-widest text-gray-400 border border-white/5 px-1 bg-white/5">
                            {cat}
                        </span>
                    ))}
                </div>
                <p className="text-gray-600 text-xs line-clamp-2 font-mono border-t border-white/5 pt-2">
                    {game.description.substring(0, 100)}...
                </p>
            </div>
        </div>
    );
};
