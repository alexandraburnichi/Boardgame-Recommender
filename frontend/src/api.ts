export interface Game {
    objectid: string;
    name: string;
    yearpublished: number;
    boardgamecategory: string | string[];
    description: string;
    image: string;
    thumbnail: string;
    minplayers?: number;
    maxplayers?: number;
    minage?: number;
    average?: number;
    avgweight?: number;
    minplaytime?: number;
    maxplaytime?: number;
}

const API_URL = "http://localhost:8000";

export const getCategories = async (): Promise<string[]> => {
    const res = await fetch(`${API_URL}/categories`);
    return res.json();
};

export const getRecommendations = async (
    categories: string[],
    minAge?: number,
    players?: number
): Promise<Game[]> => {
    const res = await fetch(`${API_URL}/recommend/cold-start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            categories,
            min_age: minAge,
            players: players
        }),
    });
    return res.json();
};

export const getPersonalRecommendations = async (userId: string): Promise<Game[]> => {
    const res = await fetch(`${API_URL}/recommend/${userId}`);
    if (!res.ok) throw new Error("User not found or API error");
    return res.json();
};
