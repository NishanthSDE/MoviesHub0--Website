import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import './MovieList.css';
import MovieCard from './MovieCard';

const MovieList = ({ activeTab = "movie", type, title, favorites, addFavorite, removeFavorite }) => {
  const [localActiveTab, setLocalActiveTab] = useState(type === 'all' ? 'movie' : activeTab);
  const [movies, setMovies] = useState([]);
  const [filterMovies, setFilterMovies] = useState([]);
  const [sort, setSort] = useState({ by: "default", order: "asc" });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMovies();
  }, [localActiveTab, type, searchQuery]);

  const filteredAndSortedMovies = (moviesList) => {
    let filtered = [...moviesList];

    if (sort.by === "score") {
      filtered.sort((a, b) =>
        sort.order === "asc" ? a.vote_average - b.vote_average : b.vote_average - a.vote_average
      );
    }
    if (sort.by === "release_date") {
      filtered.sort((a, b) => {
        const dateA = a.release_date ? new Date(a.release_date) : a.first_air_date ? new Date(a.first_air_date) : null;
        const dateB = b.release_date ? new Date(b.release_date) : b.first_air_date ? new Date(b.first_air_date) : null;

        if (!dateA && !dateB) return 0;
        if (!dateA) return sort.order === "asc" ? -1 : 1;
        if (!dateB) return sort.order === "asc" ? 1 : -1;

        return sort.order === "asc" ? dateA - dateB : dateB - dateA;
      });
    }
    if (sort.by === "popularity") {
      filtered.sort((a, b) =>
        sort.order === "asc" ? a.popularity - b.popularity : b.popularity - a.popularity
      );
    }
    if (sort.by === "rank") {
      filtered.sort((a, b) =>
        sort.order === "asc" ? a.rank - b.rank : b.rank - a.rank
      );
    }

    return filtered;
  };

  useEffect(() => {
    if (sort.by !== "default") {
      const sorted = filteredAndSortedMovies(filterMovies);
      setFilterMovies(sorted);
    }
  }, [sort]);

  const fetchMovies = async () => {
    const apiKey = '9bd8e8b586ed7b0d92ee9dda7e843195';
    let urls = [];

    if (searchQuery.trim() !== '') {
      // Use search API for movie or tv based on active tab
      const searchUrl = localActiveTab === 'movie'
        ? `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(searchQuery)}`
        : `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${encodeURIComponent(searchQuery)}`;
      try {
        const response = await fetch(searchUrl);
        const data = await response.json();
        setMovies(data.results || []);
        setFilterMovies(data.results || []);
      } catch (error) {
        console.error('Search fetch error:', error);
        setMovies([]);
        setFilterMovies([]);
      }
      return;
    }

    if (type === 'all') {
      urls =
        localActiveTab === 'movie'
          ? [
              `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`,
              `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`,
              `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}`
            ]
          : [
              `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}`,
              `https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}`,
              `https://api.themoviedb.org/3/tv/on_the_air?api_key=${apiKey}`
            ];
    } else {
      if (localActiveTab === 'tv') {
        const tvType = type === 'now_playing' ? 'on_the_air' : type;
        urls = [`https://api.themoviedb.org/3/tv/${tvType}?api_key=${apiKey}`];
      } else {
        urls = [`https://api.themoviedb.org/3/movie/${type}?api_key=${apiKey}`];
      }
    }

    try {
      const responses = await Promise.all(urls.map(url => fetch(url)));
      const dataArr = await Promise.all(responses.map(res => res.json()));
      const combinedResults = dataArr.flatMap(data => data.results || []);
      const uniqueResults = Array.from(new Map(combinedResults.map(item => [item.id, item])).values());

      setMovies(uniqueResults);
      setFilterMovies(uniqueResults);
    } catch (err) {
      console.error('Fetch error:', err);
      setMovies([]);
      setFilterMovies([]);
    }
  };

  const handleSort = (e) => {
    const { name, value } = e.target;
    setSort(prev => ({ ...prev, [name]: value }));
  };

  const handleTabChange = (tab) => {
    if (tab !== localActiveTab) {
      setLocalActiveTab(tab);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    // Search is handled reactively by searchQuery state
  };

  return (
    <section className="movie_list" id={type}>
      <header className="movie_list_header">

        <div className="movie_search_bar" style={{ width: '100%', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Search for a movie, tv show, person......"
            value={searchQuery}
            onChange={handleSearchChange}
            className="search_input"
            style={{ width: '100%' }}
          />
          <button onClick={handleSearch} className="search_button">Search</button>
        </div>

        <div className="heading_toggle_wrapper">
          <h2 className="movie_list_heading">{title}</h2>
          <div className="toggle_button">
            <span
              className={`toggle_segment ${localActiveTab === 'movie' ? 'active' : ''}`}
              onClick={() => handleTabChange('movie')}
            >
              Movies
            </span>
            <span
              className={`toggle_segment ${localActiveTab === 'tv' ? 'active' : ''}`}
              onClick={() => handleTabChange('tv')}
            >
              TV
            </span>
          </div>
        </div>

        <div className="align_center movie_list_fs">
          <select name="by" onChange={handleSort} value={sort.by} className="movie_sorting">
            <option value="default">Sort By</option>
            <option value="release_date">Date</option>
            <option value="score">Rating</option>
            <option value="popularity">Popularity</option>
            <option value="rank">Rank</option>
          </select>

          <select name="order" onChange={handleSort} value={sort.order} className="movie_sorting">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </header>

      <div className="movie_cards">
        {filterMovies.length > 0 ? (
          filterMovies.map(movie => (
            <div key={movie.id} style={{ width: 'auto', margin: '10px' }}>
              <MovieCard
                movie={movie}
                type={localActiveTab}
                addFavorite={addFavorite}
                removeFavorite={removeFavorite}
                favorites={favorites}
              />
            </div>
          ))
        ) : (
          <div className="loading">Loading...</div>
        )}
      </div>
    </section>
  );
};

export default MovieList;
