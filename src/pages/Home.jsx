import React, { useEffect, useState } from "react";
import MovieCard from "../components/moviecard";
import { searchMovies, getPopularMovies, getMoviesByGenre } from "../services/Api";
import { useMovieContext } from "../movieContext";
import GenreFilter from "../components/genre"; // Changed from GenreFilter to genre
import "../css/Home.css";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();

  const loadMovies = async (page = 1, reset = false) => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      
      if (searchQuery.trim()) {
        response = await searchMovies(searchQuery, page);
      } else if (selectedGenre) {
        response = await getMoviesByGenre(selectedGenre, page);
      } else {
        response = await getPopularMovies(page);
      }
      
      if (reset || page === 1) {
        setMovies(response.results);
      } else {
        setMovies(prev => [...prev, ...response.results]);
      }
      
      setTotalPages(response.total_pages);
      setCurrentPage(page);
    } catch (err) {
      console.error("Error loading movies:", err);
      setError("Failed to load movies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load movies when component mounts, search query changes, or genre changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      loadMovies(1, true);
    }, searchQuery ? 500 : 0); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedGenre]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenre(genreId);
    setSearchQuery(""); // Clear search when selecting genre
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages && !loading) {
      loadMovies(currentPage + 1, false);
    }
  };

  const handleFavoriteClick = (movie) => {
    if (isFavorite(movie.id)) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  const getPageTitle = () => {
    if (searchQuery) return `Search Results for "${searchQuery}"`;
    if (selectedGenre) {
      // You might want to store genre names to display here
      return "Movies by Genre";
    }
    return "Popular Movies";
  };

  return (
    <div className="home">
      <header className="home-header">
        <h1>🎬 MovieVerse</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for movies..."
            className="search-input"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </header>

      <GenreFilter 
        selectedGenre={selectedGenre}
        onGenreChange={handleGenreChange}
      />

      <div className="movies-section">
        <h2>{getPageTitle()}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        {loading && movies.length === 0 ? (
          <div className="loading">Loading movies...</div>
        ) : (
          <>
            <div className="movies-grid">
              {movies.map((movie) => (
                <MovieCard
                  key={`${movie.id}-${currentPage}`}
                  movie={movie}
                  isFavorite={isFavorite(movie.id)}
                  onFavoriteClick={handleFavoriteClick}
                />
              ))}
            </div>
            
            {movies.length === 0 && !loading && (
              <div className="no-movies">
                {searchQuery 
                  ? `No movies found for "${searchQuery}"`
                  : "No movies available"
                }
              </div>
            )}
            
            {currentPage < totalPages && (
              <div className="load-more-container">
                <button 
                  onClick={handleLoadMore} 
                  disabled={loading}
                  className="load-more-btn"
                >
                  {loading ? "Loading..." : "Load More Movies"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Home;