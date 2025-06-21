import React, { useEffect, useState } from "react";
import MangaCard from "./MangaCard";
import { Link, useParams, useLocation } from "react-router-dom";
import "./MangaList.css";

const MangaList = ({ title = "Top Manga", type = "top", addFavorite, removeFavorite, favorites }) => {
  const [manga, setManga] = useState([]);
  const [sort, setSort] = useState({ by: "default", order: "asc" });
  const [currentType, setCurrentType] = useState(type);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const { id } = useParams();
  const location = useLocation();
  const isRecommendation = location.pathname.includes("recommendations");

  useEffect(() => {
    setCurrentType(type);
  }, [type]);

  useEffect(() => {
    const fetchManga = async () => {
      try {
        let url = "";

        if (debouncedSearchQuery.trim() !== "") {
          url = `https://api.jikan.moe/v4/manga?q=${encodeURIComponent(debouncedSearchQuery)}&limit=20`;
        } else if (isRecommendation && id) {
          url = `https://api.jikan.moe/v4/manga/${id}/recommendations`;
        } else if (currentType === "popular") {
          url = "https://api.jikan.moe/v4/manga?order_by=popularity";
        } else if (currentType === "seasonal") {
          url = "https://api.jikan.moe/v4/top/manga?filter=publishing";
        } else {
          url = "https://api.jikan.moe/v4/top/manga";
        }

        const response = await fetch(url);
        const data = await response.json();

        if (isRecommendation && id) {
          const recommendations = data.data?.map((rec) => rec.entry) || [];
          const limitedRecommendations = recommendations.slice(0, 10); // limit to 10 recommendations
          setManga(limitedRecommendations);
        } else {
          setManga(data.data || []);
        }
      } catch (error) {
        setManga([]);
      }
    };

    fetchManga();
  }, [currentType, id, isRecommendation, debouncedSearchQuery]);

  const filteredAndSortedManga = () => {
    let filtered = manga;

    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sort.by === "score") {
      filtered.sort((a, b) =>
        sort.order === "asc" ? a.score - b.score : b.score - a.score
      );
    } else if (sort.by === "rank") {
      filtered.sort((a, b) =>
        sort.order === "asc" ? a.rank - b.rank : b.rank - a.rank
      );
    } else if (sort.by === "popularity") {
      filtered.sort((a, b) =>
        sort.order === "asc" ? a.popularity - b.popularity : b.popularity - a.popularity
      );
    }
    else if (sort.by === "release_date") {
      filtered.sort((a, b) =>
        sort.order === "asc"
          ? new Date(a.published.prop.from) - new Date(b.published.prop.from)
          : new Date(b.published.prop.from) - new Date(a.published.prop.from)
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

  // Debounce searchQuery to reduce API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const handleSearch = () => {
    // Search is now handled reactively by useEffect on searchQuery
  };

  return (
    <div className="manga-list-container">
      <h2>{title}</h2>

      <div className="manga_search_bar" style={{ width: '100%', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search for a manga..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search_input"
          style={{ width: '100%' }}
        />
        <button onClick={handleSearch} className="search_button">Search</button>
      </div>

      <div className="align_center manga_list_fs">
        <label className="filter-label">
          <p className="name"></p>
        </label>
        <select name="by" onChange={handleSort} value={sort.by} className="manga_sorting">
          <option value="default">Sort By</option>
          <option value="release_date">Date</option>
          <option value="score">Rating</option>
          <option value="rank">Rank</option>
          <option value="popularity">Popularity</option>
        </select>
        <select name="order" onChange={handleSort} value={sort.order} className="manga_sorting">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div className="manga-grid">
        {filteredAndSortedManga().length > 0 ? (
          filteredAndSortedManga().map((item) => (
            <MangaCard key={item.mal_id} manga={item} addFavorite={addFavorite} removeFavorite={removeFavorite} favorites={favorites} />
          ))
        ) : (
          <p className="no-recommendations-message">No recommendations available.</p>
        )}
      </div>
    </div>
  );
};

export default MangaList;
