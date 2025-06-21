import React, { useEffect, useState } from "react";
import '../AnimeList/AnimeCard.css';
import Star from '../../assets/star.png';

const AnimeCard = ({ anime, addFavorite, removeFavorite, favorites, showRecommendationButton = false }) => {
  const [liked, setLiked] = useState(false);
  const baseUrl = "https://myanimelist.net/anime/";

  useEffect(() => {
    const isFavorite = favorites?.some(fav => fav.mal_id === anime.mal_id);
    setLiked(isFavorite);
  }, [favorites, anime.mal_id]);

  const toggleLike = (e) => {
    e.preventDefault();
    if (liked) {
      removeFavorite(anime.mal_id);
    } else {
      addFavorite(anime);
    }
    setLiked(!liked);
  };

  return (
    <a
      href={baseUrl + anime.mal_id}
      target="_blank"
      rel="noopener noreferrer"
      className="anime_card"
    >
      <img
        src={anime.images?.jpg?.image_url}
        alt={anime.title}
        className="anime_poster"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://via.placeholder.com/200x300?text=Image+Not+Available";
        }}
      />

      <button
        className={`heart_button ${liked ? 'liked' : ''}`}
        onClick={toggleLike}
        aria-label="Like button"
      >
        ♥
      </button>

      <div className="anime_details">
        <h3 className="anime_details_heading">
          {anime.title || "Untitled"}
        </h3>
        <div className="align_center anime_date_rate">
          <p>{anime.aired?.prop?.from?.year || "Unknown Year"}</p>
          <p className="align_center" style={{ color: 'var(--rating_color)' }}>
             {anime.score ?? "N/A"}
            <img src={Star} alt="rating icon" className="card_emoji" />
          </p>

        </div>
        <p className="anime_description">
          {anime.synopsis ? anime.synopsis.slice(0, 100) + "..." : "No description available."}
        </p>
      </div>
    </a>
  );
};

export default AnimeCard;
