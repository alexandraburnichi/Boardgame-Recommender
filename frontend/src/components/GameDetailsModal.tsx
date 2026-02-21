import React, { useEffect } from 'react';
import type { Game } from '../api';

interface ModalProps {
    game: Game;
    onClose: () => void;
}

export const GameDetailsModal: React.FC<ModalProps> = ({ game, onClose }) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const categories = Array.isArray(game.boardgamecategory)
        ? game.boardgamecategory
        : (typeof game.boardgamecategory === 'string' ? game.boardgamecategory.replace(/[\[\]']/g, "").split(',') : []);

    const complexity = game.avgweight || 0;
    const playTime = game.minplaytime || 0;

    let verdict = "> STATUS: STANDARD_ISSUE";
    if (complexity > 3.5) verdict = "> STATUS: HEAVY_MENTAL_LOAD";
    else if (complexity < 2.0 && complexity > 0) verdict = "> STATUS: LIGHT_RECON";
    else if (playTime > 120) verdict = "> STATUS: LONG_DURATION";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-gray-950 border border-white/10 shadow-2xl animate-fade-in-up flex flex-col md:flex-row">

                <div className="md:w-1/3 relative border-b md:border-b-0 md:border-r border-white/10 bg-gray-900/50">
                    <img
                        src={game.image}
                        alt={game.name}
                        className="w-full h-48 md:h-full object-cover opacity-60 grayscale mix-blend-luminosity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent md:bg-gradient-to-r" />

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h2 className="text-2xl font-bold font-serif tracking-tighter leading-none mb-2 text-white">
                            {game.name}
                        </h2>
                        <div className="text-[10px] font-mono text-gray-400 space-y-1">
                            <div className="flex justify-between border-b border-white/10 pb-1">
                                <span>YEAR</span> <span>{game.yearpublished}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/10 pb-1">
                                <span>PLAYERS</span> <span>{game.minplayers}-{game.maxplayers}</span>
                            </div>
                            <div className="pt-2 text-white/80">
                                {verdict}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:w-2/3 p-6 md:p-8 flex flex-col">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-600 hover:text-white font-mono text-xs z-10"
                    >
                        [CLOSE]
                    </button>

                    <div className="grid grid-cols-3 gap-4 mb-8 border-b border-white/10 pb-6">
                        <div className="space-y-1">
                            <span className="text-[10px] font-mono text-gray-500 block">COMPLEXITY</span>
                            <div className="text-lg font-mono text-white">
                                {game.avgweight ? game.avgweight.toFixed(2) : "N/A"} <span className="text-[10px] text-gray-600">/ 5.00</span>
                            </div>
                            <div className="h-0.5 w-full bg-gray-800 mt-1">
                                <div
                                    className="h-full bg-white transition-all duration-1000"
                                    style={{ width: `${(complexity / 5) * 100}%` }}
                                />
                            </div>
                        </div>
                        <div className="space-y-1 text-center border-l border-r border-white/5">
                            <span className="text-[10px] font-mono text-gray-500 block">TIME_EST</span>
                            <div className="text-lg font-mono text-white">
                                {game.minplaytime}-{game.maxplaytime} <span className="text-[10px] text-gray-600">MIN</span>
                            </div>
                        </div>
                        <div className="space-y-1 text-right">
                            <span className="text-[10px] font-mono text-gray-500 block">RATING_DB</span>
                            <div className="text-lg font-mono text-white">
                                {game.average ? game.average.toFixed(1) : "N/A"}
                            </div>
                        </div>
                    </div>

                    <div className="flex-grow mb-8 rounded-sm">
                        <div className="pl-4 border-l-2 border-white/20">
                            <p className="prose prose-invert prose-sm md:prose-base max-w-none text-gray-300 text-justify font-serif leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:text-white first-letter:float-left first-letter:mr-3 first-letter:font-serif">
                                {game.description}
                            </p>
                        </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-white/5">
                        <div className="flex flex-wrap gap-x-4 gap-y-2 justify-end">
                            {categories.map((cat, idx) => (
                                <span key={idx} className="text-[10px] font-mono text-gray-500 hover:text-white cursor-help transition-colors">
                                    #{cat.replace(/\s+/g, '_').toUpperCase()}
                                </span>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
