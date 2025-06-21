import React from 'react';
import MangaCard from './MangaCard';
import './MangaList.css';

const MangaFavorite = ({ favorites, addFavorite, removeFavorite }) => {
  const mangaFavorites = favorites.filter(
    (item) => item.mal_id && item.episodes === undefined // Only manga (no episodes)
  );

  if (mangaFavorites.length === 0) {
    return <div className="no_favorites">No favorite manga added yet.</div>;
  }

  return (
    <div className="favorite_list">
      {mangaFavorites.map((item) => (
        <div key={item.mal_id} className="favorite_item">
          <MangaCard
            manga={item}
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

export default MangaFavorite;
