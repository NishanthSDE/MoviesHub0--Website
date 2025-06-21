import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.jsx';
import MovieList from './components/MovieList/MovieList.jsx';
import Favorite from './components/Favorite/Favorite.jsx';
import AnimeList from './components/AnimeList/AnimeList.jsx';
import MangaList from './components/Manga/MangaList.jsx';
import MangaFavorite from './components/Manga/MangaFavorite.jsx';
import AnimeFavorite from './components/AnimeList/AnimeFavorite.jsx';

const App = () => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (item) => {
    const key = item.id || item.mal_id;
    setFavorites((prev) =>
      prev.some((fav) => (fav.id || fav.mal_id) === key) ? prev : [...prev, item]
    );
  };

  const removeFavorite = (itemId) => {
    setFavorites((prev) =>
      prev.filter((fav) => (fav.id || fav.mal_id) !== itemId)
    );
  };

  return (
    <Router>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/all" replace />}
          />
          <Route
            path="/all"
            element={<MovieList type="all" title="All" addFavorite={addFavorite} removeFavorite={removeFavorite} favorites={favorites} />}
          />
          <Route
            path="/now_playing"
            element={<MovieList type="now_playing" title="Now Playing" addFavorite={addFavorite} removeFavorite={removeFavorite} favorites={favorites} />}
          />
          <Route
            path="/popular"
            element={<MovieList type="popular" title="Popular" addFavorite={addFavorite} removeFavorite={removeFavorite} favorites={favorites} />}
          />
          <Route
            path="/top_rated"
            element={<MovieList type="top_rated" title="Top Rated" addFavorite={addFavorite} removeFavorite={removeFavorite} favorites={favorites} />}
          />
          <Route
            path="/upcoming"
            element={<MovieList type="upcoming" title="Upcoming" addFavorite={addFavorite} removeFavorite={removeFavorite} favorites={favorites} />}
          />
          <Route
            path="/favorite"
            element={
              <Favorite
                favorites={favorites.filter((item) => item.id)} // Only movies
                addFavorite={addFavorite}
                removeFavorite={removeFavorite}
              />
            }
          />

          {/* Anime */}
          <Route
            path="/anime"
            element={<AnimeList type="top" title="Top Anime" addFavorite={addFavorite} removeFavorite={removeFavorite} favorites={favorites} />}
          />
          <Route
            path="/anime/popular"
            element={<AnimeList type="popular" title="Popular Anime" addFavorite={addFavorite} removeFavorite={removeFavorite} favorites={favorites} />}
          />
          <Route
            path="/anime/seasonal"
            element={<AnimeList type="seasonal" title="Seasonal Anime" addFavorite={addFavorite} removeFavorite={removeFavorite} favorites={favorites} />}
          />
          <Route
            path="/anime/favorite"
            element={
              <AnimeFavorite
                favorites={favorites.filter((item) => item.mal_id)} // Only anime
                addFavorite={addFavorite}
                removeFavorite={removeFavorite}
              />
            }
          />

          {/* Manga */}
          <Route
            path="/manga"
            element={<MangaList type="top" title="Top Manga" addFavorite={addFavorite} removeFavorite={removeFavorite} favorites={favorites} />}
          />
          <Route
            path="/manga/popular"
            element={<MangaList type="popular" title="Popular Manga" addFavorite={addFavorite} removeFavorite={removeFavorite} favorites={favorites} />}
          />
          <Route
            path="/manga/seasonal"
            element={<MangaList type="seasonal" title="Publishing Manga" addFavorite={addFavorite} removeFavorite={removeFavorite} favorites={favorites} />}
          />
          <Route
            path="/manga/:id/recommendations"
            element={<MangaList title="Recommendations" addFavorite={addFavorite} removeFavorite={removeFavorite} favorites={favorites} />}
          />
          <Route
            path="/manga/favorite"
            element={
              <MangaFavorite
                favorites={favorites.filter((item) => item.mal_id)} // Only manga
                addFavorite={addFavorite}
                removeFavorite={removeFavorite}
              />
            }
          />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
