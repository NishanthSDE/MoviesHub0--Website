import React, { useEffect, useState } from "react";
import './MangaCard.css';
import Star from '../../assets/star.png';
import { Link } from "react-router-dom";

const MangaCard = ({ manga, addFavorite, removeFavorite, favorites, showRecommendationButton = false }) => {
  const [liked, setLiked] = useState(false);
  const baseUrl = "https://myanimelist.net/manga/";

  useEffect(() => {
    const isFavorite = favorites?.some(fav => fav.mal_id === manga.mal_id);
    setLiked(isFavorite);
  }, [favorites, manga.mal_id]);

  const toggleLike = (e) => {
    e.preventDefault();
    if (liked) {
      removeFavorite(manga.mal_id);
    } else {
      addFavorite(manga);
    }
    setLiked(!liked);
  };

  return (
    <a
      href={baseUrl + manga.mal_id}
      target="_blank"
      rel="noopener noreferrer"
      className="manga_card"
    >
      <img
        src={manga.images?.jpg?.image_url}
        alt={manga.title}
        className="manga_poster"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://via.placeholder.com/200x300?text=Image+Not+Available";
        }}
      />

      <button
        className={`heart_button ${liked ? 'liked' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          toggleLike(e);
        }}
        aria-label="Like button"
      >
        ♥
      </button>

      <div className="manga_details">
        <h3 className="manga_details_heading">
          {manga.title || "Untitled"}
        </h3>
        <div className="align_center manga_date_rate">
          <p>{manga.published?.prop?.from?.year || "Unknown Year"}</p>
          <p className="align_center" style={{ color: 'var(--rating_color)' }}>
            {manga.score ?? "N/A"}
            <img src={Star} alt="rating icon" className="card_emoji" />
          </p>
        </div>
        <p className="manga_description">
          {manga.synopsis ? manga.synopsis.slice(0, 100) + "..." : "No description available."}
        </p>

        {showRecommendationButton && manga.mal_id && (
          <Link to={`/manga/${manga.mal_id}/recommendations`} className="rec-button">
            Recommendations
          </Link>
        )}
      </div>
    </a>
  );
};

export default MangaCard;
