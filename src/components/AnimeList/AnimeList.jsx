import React, { useEffect, useState } from "react";
import AnimeCard from "./AnimeCard";
import "./AnimeList.css";

const AnimeList = ({ type = "top", title, addFavorite, removeFavorite, favorites }) => {
  const [topAnimes, setTopAnimes] = useState([]);
  const [seasonalAnimes, setSeasonalAnimes] = useState([]);
  const [popularAnimes, setPopularAnimes] = useState([]);
  const [sort, setSort] = useState({ by: "default", order: "asc" });
  const [category, setCategory] = useState(type);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    setCategory(type);
  }, [type]);

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      fetchSearchResults();
    } else {
      fetchData();
    }
  }, [searchQuery]);

  const fetchData = async () => {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    try {
      // Top Anime
      const topRes = await fetch("https://api.jikan.moe/v4/top/anime");
      const topData = await topRes.json();
      setTopAnimes(getUniqueAnimes(topData.data));
      await delay(1000);

      // Seasonal Anime
      const seasonalRes = await fetch("https://api.jikan.moe/v4/seasons/2025/spring");
      const seasonalData = await seasonalRes.json();
      setSeasonalAnimes(getUniqueAnimes(seasonalData.data));
      await delay(1000);

      // Popular Anime
      const popularRes = await fetch("https://api.jikan.moe/v4/top/anime?filter=bypopularity");
      const popularData = await popularRes.json();
      setPopularAnimes(getUniqueAnimes(popularData.data));
    } catch (error) {
      console.error("Failed to fetch anime data:", error);
    }
  };

  const fetchSearchResults = async () => {
    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setSearchResults(getUniqueAnimes(data.data));
    } catch (error) {
      console.error("Failed to fetch search results:", error);
      setSearchResults([]);
    }
  };

  const getUniqueAnimes = (animes = []) => {
    return Array.from(new Map(animes.map(item => [item.mal_id, item])).values());
  };

  const filteredAndSortedAnimes = (animes) => {
    let filtered = animes;

    if (sort.by === "score") {
      filtered.sort((a, b) =>
        sort.order === "asc" ? a.score - b.score : b.score - a.score
      );
    }
    if (sort.by === "release_date") {
      filtered.sort((a, b) =>
        sort.order === "asc"
          ? new Date(a.aired.prop.from) - new Date(b.aired.prop.from)
          : new Date(b.aired.prop.from) - new Date(a.aired.prop.from)
      );
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

  const handleSort = (e) => {
    const { name, value } = e.target;
    setSort(prevSort => ({
      ...prevSort,
      [name]: value
    }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const getCurrentAnimes = () => {
    if (searchQuery.trim() !== '') {
      return searchResults;
    }
    switch (category) {
      case "top":
        return topAnimes;
      case "seasonal":
        return seasonalAnimes;
      case "popular":
        return popularAnimes;
      default:
        return topAnimes;
    }
  };

  return (
    <div className="anime-list-container">
      <h2>
        {title || (category.charAt(0).toUpperCase() + category.slice(1)) + " Anime"}
      </h2>

      <div className="anime_search_bar" style={{ width: '100%', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search for an anime..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search_input"
          style={{ width: '100%' }}
        />
        <button className="search_button">Search</button>
      </div>

      <div className="align_center anime_list_fs">
        <select name="by" onChange={handleSort} value={sort.by} className="anime_sorting">
          <option value="default">Sort By</option>
          <option value="release_date">Date</option>
          <option value="score">Rating</option>
          <option value="popularity">Popularity</option>
          <option value="rank">Rank</option>
        </select>
        <select name="order" onChange={handleSort} value={sort.order} className="anime_sorting">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div className="anime-grid">
        {filteredAndSortedAnimes(getCurrentAnimes()).map((anime, index) => (
          <AnimeCard
            key={anime.mal_id + '-' + index}
            anime={anime}
            addFavorite={addFavorite}
            removeFavorite={removeFavorite}
            favorites={favorites}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimeList;
