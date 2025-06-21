import { useEffect, useState } from 'react';
import './MovieCard.css';
import Star from '../../assets/star.png';

const MovieCard = ({ movie, type = "movie", addFavorite, removeFavorite, favorites }) => {
  const [liked, setLiked] = useState(false);
  const baseUrl = type === "tv" ? 'https://www.themoviedb.org/tv/' : 'https://www.themoviedb.org/movie/';

  useEffect(() => {
    const isFavorite = favorites.some(fav => fav.id === movie.id);
    setLiked(isFavorite);
  }, [favorites, movie.id]);

  const toggleLike = (e) => {
    e.preventDefault();
    if (liked) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
    setLiked(!liked);
  };

  return (
    <a href={baseUrl + movie.id} target="_blank" rel="noopener noreferrer" className="movie_card">
      <img 
        src={'https://image.tmdb.org/t/p/w500' + movie.poster_path} 
        alt="movie_poster" 
        className='movie_poster' 
      />

      <button 
        className={`heart_button ${liked ? 'liked' : ''}`} 
        onClick={toggleLike} 
        aria-label="Like button"
      >
        ♥
      </button>

      <div className="movie_details">
        <h3 className="movie_details_heading">{movie.original_title || movie.name}</h3>
        <div className="align_center movie_date_rate">
          <p>{movie.release_date || movie.first_air_date}</p>
          <p className='align_center'>
            {movie.vote_average}
            <img src={Star} alt="rating icon" className='card_emoji' />
          </p>
        </div>
        <p className='movie_description'>
          {movie.overview ? movie.overview.slice(0, 100) + "..." : ""}
        </p>
      </div>
    </a>
  );
};

export default MovieCard;
