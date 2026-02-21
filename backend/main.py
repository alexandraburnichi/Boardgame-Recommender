from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import pandas as pd
import ast
from bs4 import BeautifulSoup
from recombee_api_client.api_client import RecombeeClient, Region
from recombee_api_client.api_requests import ListItems, RecommendItemsToUser
from recombee_api_client.exceptions import ResponseException
import os
import html
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_ID = 'lex-boardgames'
PRIVATE_TOKEN = '8QvaQqqSpep8gHZ05M3m4aJzkXdL4GU9hJKXgzXsGwEbiBZGFfHEghDHEJAu3uoy'
client = RecombeeClient(DB_ID, PRIVATE_TOKEN, region=Region.EU_WEST)

CSV_PATH = os.path.join(os.path.dirname(__file__), "..", "boardgames1.csv")
print(f"DEBUG: Attempting to load CSV from: {os.path.abspath(CSV_PATH)}")

try:
    df = pd.read_csv(CSV_PATH)
    print(f"DEBUG: CSV loaded successfully.")
    
    if 'image' not in df.columns:
        df['image'] = None
    if 'thumbnail' not in df.columns:
        df['thumbnail'] = None

    df = df[['objectid', 'name', 'yearpublished', 'boardgamecategory', 'description', 'image', 'thumbnail', 
             'average', 'avgweight', 'minplaytime', 'maxplaytime', 'minplayers', 'maxplayers']]
    df['objectid'] = df['objectid'].astype(str)

except Exception as e:
    print(f"ERROR: Could not load CSV: {e}")
    df = pd.DataFrame(columns=['objectid', 'name', 'yearpublished', 'boardgamecategory', 'description', 'image', 'thumbnail'])

def clean_html(text):
    if pd.isna(text): return ""
    text = BeautifulSoup(text, "html.parser").get_text()
    return html.unescape(text)

df['description'] = df['description'].apply(clean_html)

df['image'] = df['image'].fillna("https://via.placeholder.com/300x300?text=No+Image")
df['thumbnail'] = df['thumbnail'].fillna("https://via.placeholder.com/100x100?text=No+Image")

print(f"DEBUG: Loaded {len(df)} games from CSV.")

def get_game_details(game_ids: List[str]):
    if df.empty:
        return [{"id": gid, "name": "Unknown", "image": ""} for gid in game_ids]
    
    matches = df[df['objectid'].isin(game_ids)].to_dict(orient='records')
    matches_map = {item['objectid']: item for item in matches}
    ordered_result = []
    for gid in game_ids:
        if gid in matches_map:
            ordered_result.append(matches_map[gid])
    return ordered_result

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Boardgame Recommender API"}

BANNED_KEYWORDS = [
    'Nominee', 'Winner', 'Recommended', 'Prize', 'Award', 'Place', 
    'Edition', 'Games', 'Best', 'Spill', 'Ludo', 'Jahres', 'Voters', 
    'Pubblico', 'International', 'Meeples', 'Golden Geek', 'Deutscher Spiele',
    'Hit mit Freunden', 'Gouden', 'Årets'
]

def get_clean_categories(raw_list):
    if not isinstance(raw_list, list):
        return []
    
    clean_list = []
    for c in raw_list:
        cat_str = str(c).strip()
        
        if cat_str.startswith('('):
            continue
            
        if cat_str and cat_str[0].isdigit():
            continue
            
        is_junk = False
        for keyword in BANNED_KEYWORDS:
            if keyword.lower() in cat_str.lower():
                is_junk = True
                break
        
        if not is_junk and len(cat_str) > 2:
            clean_list.append(cat_str)
            
    return clean_list

@app.get("/categories")
def get_categories():
    if df.empty: 
        return []
    
    unique_cats = set()
    raw_cats_series = df['boardgamecategory'].dropna()
    
    for raw_cats in raw_cats_series:
        try:
            if isinstance(raw_cats, str):
                actual_list = ast.literal_eval(raw_cats)
                clean_list = get_clean_categories(actual_list)
                for cat in clean_list:
                    unique_cats.add(cat)
        except Exception:
            pass
            
    return sorted(list(unique_cats))

class ColdStartRequest(BaseModel):
    categories: List[str]
    min_age: Optional[int] = None
    players: Optional[int] = None

@app.post("/recommend/cold-start")
def recommend_cold_start(request: ColdStartRequest):
    filter_parts = []
    
    if request.categories:
        cat_filters = [f'"{cat}" in \'categories\'' for cat in request.categories]
        if cat_filters:
            filter_parts.append(f"({' or '.join(cat_filters)})")
            
    if request.min_age:
        filter_parts.append(f"'minage' <= {request.min_age}")
        
    if request.players:
        filter_parts.append(f"'minplayers' <= {request.players} and 'maxplayers' >= {request.players}")
        
    final_query = " and ".join(filter_parts) if filter_parts else None
    print(f"DEBUG: Recombee Filter Query: {final_query}")
    
    try:
        res = client.send(ListItems(
            filter=final_query,
            count=12,
            return_properties=True
        ))
        
        recomms = res if isinstance(res, list) else res.get('recomms', [])
        print(f"DEBUG: Recombee returned {len(recomms)} items.")
        
        if len(recomms) > 0:
            print(f"DEBUG: First item keys: {recomms[0].keys()}")
        
        game_ids = []
        for item in recomms:
            gid = item.get('id') or item.get('itemId')
            if gid:
                game_ids.append(gid)
        
        print(f"DEBUG: Recombee IDs: {game_ids[:5]}...")
        
        enriched_results = get_game_details(game_ids)
        print(f"DEBUG: Enriched {len(enriched_results)} items from local CSV.")
        
        return enriched_results
        
    except ResponseException as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/recommend/{user_id}")
def recommend_user(user_id: str):
    try:
        recommended = client.send(RecommendItemsToUser(user_id, 12))
        print(f"DEBUG: RecommendUser returned {len(recommended['recomms'])} items")
        
        game_ids = []
        for rec in recommended['recomms']:
            gid = rec.get('id') or rec.get('itemId')
            if gid:
                game_ids.append(gid)
                
        return get_game_details(game_ids)
    except ResponseException as e:
        print(f"ERROR: Recombee error for user {user_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))
