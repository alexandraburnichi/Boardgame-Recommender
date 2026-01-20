# Boardgame Recommender

A hybrid recommendation engine for board games built with Python and Recombee. [cite_start]This system combines collaborative filtering (user interactions) with content-based filtering (game metadata) to deliver personalized game suggestions and address the "cold start" problem for new users[cite: 7, 9, 91].

## Features

* [cite_start]**Hybrid Recommendation System:** Combines user interaction history with game metadata (categories, mechanics, playtime) to generate recommendations[cite: 91, 95].
* [cite_start]**Cold Start Handling:** Implements a "Twitter-style" onboarding flow where new users select preferences (categories, age, player count) to receive instant, relevant suggestions via ReQL filtering[cite: 121, 122].
* [cite_start]**Data Cleaning Pipeline:** Automated preprocessing to sanitize "dirty" dataset inputs, removing irrelevant tags (e.g., "Nominee", "Winner") and standardizing categories[cite: 113, 114].
* [cite_start]**Scalable Architecture:** Capable of handling board game entries with support for international character sets[cite: 103].

## Dataset

[cite_start]The project utilizes the **20,000 Boardgames Dataset** from Kaggle, processed and optimized for the Recombee free tier[cite: 16, 97].
* [cite_start]**Source:** Kaggle Boardgames Dataset[cite: 16].
* [cite_start]**Size:** Filtered from 20,000 to 15,000 unique titles to respect plan limits[cite: 100].
* [cite_start]**Attributes:** Includes game mechanics, categories, complexity (weight), play time, and age constraints[cite: 20, 21, 22].

## Tech Stack

* [cite_start]**Language:** Python [cite: 101]
* [cite_start]**Engine:** Recombee (Recommendation-as-a-Service) [cite: 93]
* [cite_start]**Libraries:** `recombee-api-client`, `pandas`, `beautifulsoup4` (for HTML cleaning), `unidecode`[cite: 101, 108].

## Setup and Usage

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/boardgame-recommender.git](https://github.com/your-username/boardgame-recommender.git)
    cd boardgame-recommender
    ```

2.  **Install dependencies:**
    ```bash
    pip install recombee-api-client pandas beautifulsoup4 unidecode
    ```

3.  **Configure API Keys:**
    Update the `DB_ID` and `PRIVATE_TOKEN` in the script with your Recombee credentials.

4.  **Run the Jupyter Notebook:**
    The main logic is contained in `boardgames.ipynb`. Running the cells will:
    * [cite_start]Preprocess and clean the local dataset[cite: 116].
    * Sync items and users to the Recombee database.
    * [cite_start]Generate synthetic ratings for testing[cite: 110].
    * Demonstrate recommendation scenarios (User-specific & Advanced Search).

## Recommendation Logic

The system operates on two levels:

1.  [cite_start]**Personalized Recommendations:** Uses synthetic rating data (converted to a -1.0 to 1.0 scale) to predict games a user will like based on similar users[cite: 110].
2.  [cite_start]**Advanced Search (Cold Start):** A CLI-based tool allows users to filter using ReQL (Recombee Query Language) based on the following logic[cite: 124, 125]:
    * `(SelectedCategory OR AlternativeCategory) AND (MinAge <= UserAge) AND (MinPlayers <= UserCount <= MaxPlayers)`

## Authors

* [cite_start]**Burnichi Alexandra** [cite: 3, 88]
* [cite_start]**Ardeleanu Călin-Veniamin** [cite: 4, 89]