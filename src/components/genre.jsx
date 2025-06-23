import React, { useState, useEffect } from 'react';
import { getGenres } from '../services/Api';
import '../css/genre.css'; // Changed from GenreFilter.css to genre.css

const GenreFilter = ({ selectedGenre, onGenreChange }) => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresData = await getGenres();
        if (genresData && Array.isArray(genresData.genres)) {
          setGenres(genresData.genres);
        } else {
          setGenres([]);
          console.error('Invalid genres data:', genresData);
        }
      } catch (error) {
        console.error('Error fetching genres:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  if (loading) {
    return <div className="genre-filter-loading">Loading genres...</div>;
  }

  return (
    <div className="genre-filter">
      <h3>Filter by Genre</h3>
      <div className="genre-buttons">
        <button
          className={`genre-btn ${selectedGenre === null ? 'active' : ''}`}
          onClick={() => onGenreChange(null)}
        >
          All Movies
        </button>
        {genres.map(genre => (
          <button
            key={genre.id}
            className={`genre-btn ${selectedGenre === genre.id ? 'active' : ''}`}
            onClick={() => onGenreChange(genre.id)}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenreFilter;