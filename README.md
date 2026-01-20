# Proiect Sisteme de Recomandare Boardgames - Milestone 2

## Project Overview
This project implements a hybrid recommendation system for board games using the Recombee platform. It combines Collaborative Filtering (based on user interactions) and Content-Based Filtering (based on game metadata) to provide personalized suggestions.

## Features

### Hybrid Recommendation Engine
* **Collaborative Filtering:** Uses a matrix of interactions based on synthetic user ratings.
* **Content-Based Filtering:** Utilizes game metadata such as categories, mechanics, age, and player count.

### Cold Start Solution (Twitter-style Onboarding)
To address new users with no history:
* Users select preferences explicitly via a CLI interface (categories, age group, number of players).
* The system constructs dynamic ReQL (Recombee Query Language) filters to provide immediate recommendations.
* Logic: (Selected Category) AND (Age Constraint) AND (Player Count Constraint).

### Data Processing & Quality
* **Source:** Kaggle "20,000 Boardgames Dataset".
* **Filtering:** Reduced to 15,000 items to fit the Recombee free tier.
* **Cleaning Pipeline:** Implements a strict cleaning function to remove "dirty data" from the categories column (e.g., removing non-category tags like "Nominee", "Winner", or years).
* **Normalization:** Handles Unicode characters (e.g., Chinese titles) and maps ratings from a 1-10 scale to the Recombee -1.0 to 1.0 scale.

## Technology Stack
* **Platform:** Recombee (Recommendation-as-a-Service)
* **Language:** Python
* **Libraries:** `recombee-api-client`, `pandas`, `beautifulsoup4` (HTML cleaning), `unidecode`.

## Authors
* Burnichi Alexandra
* Ardeleanu Călin-Veniamin