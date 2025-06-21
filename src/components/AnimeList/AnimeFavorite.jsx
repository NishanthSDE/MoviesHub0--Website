import React from 'react';
import AnimeCard from './AnimeCard';
import './AnimeList.css';

const AnimeFavorite = ({ favorites, addFavorite, removeFavorite }) => {
  const animeFavorites = favorites.filter(
    (item) => item.mal_id && item.episodes !== undefined // Only anime (has episodes)
  );

  if (animeFavorites.length === 0) {
    return <div className="no_favorites">No favorite anime added yet.</div>;
  }

  return (
    <div className="favorite_list">
      {animeFavorites.map((item) => (
        <div key={item.mal_id} className="favorite_item">
          <AnimeCard
            anime={item}
            favorites={favorites}
            addFavorite={addFavorite}
            removeFavorite={removeFavorite}
            showRecommendationButton={true}
          />
        </div>
      ))}
    </div>
  );
};

export default AnimeFavorite;
