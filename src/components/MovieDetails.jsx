import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails } from '../services/Api';
import '../css/MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const movieData = await getMovieDetails(id);
        setMovie(movieData);
      } catch (err) {
        setError('Failed to fetch movie details');
        console.error('Error fetching movie details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  if (loading) return <div className="loading">Loading movie details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!movie) return <div className="error">Movie not found</div>;

  return (
    <div className="movie-details">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>
      
      <div className="movie-details-content">
        <div className="movie-poster">
          <img
            src={movie.poster_path 
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : '/placeholder-poster.jpg'
            }
            alt={movie.title}
          />
        </div>
        
        <div className="movie-info">
          <h1>{movie.title}</h1>
          <div className="movie-meta">
            <span className="release-date">Released: {movie.release_date}</span>
            <span className="rating">⭐ {movie.vote_average}/10</span>
            <span className="runtime">{movie.runtime} minutes</span>
          </div>
          
          <div className="genres">
            {movie.genres && movie.genres.map(genre => (
              <span key={genre.id} className="genre-tag">{genre.name}</span>
            ))}
          </div>
          
          <div className="overview">
            <h2>Overview</h2>
            <p>{movie.overview}</p>
          </div>
          
          {movie.tagline && (
            <div className="tagline">
              <em>"{movie.tagline}"</em>
            </div>
          )}
          
          <div className="additional-info">
            <div className="info-item">
              <strong>Budget:</strong> ${movie.budget?.toLocaleString() || 'N/A'}
            </div>
            <div className="info-item">
              <strong>Revenue:</strong> ${movie.revenue?.toLocaleString() || 'N/A'}
            </div>
            <div className="info-item">
              <strong>Production Countries:</strong> 
              {movie.production_countries?.map(country => country.name).join(', ') || 'N/A'}
            </div>
            <div className="info-item">
              <strong>Languages:</strong> 
              {movie.spoken_languages?.map(lang => lang.english_name).join(', ') || 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;