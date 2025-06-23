import React from "react"
import { useNavigate } from "react-router-dom"
import { useMovieContext } from "../movieContext"
import "../css/MovieCard.css"

function MovieCard({ movie }) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext()
  const favorite = isFavorite(movie.id)
  const navigate = useNavigate()

  const handleMovieClick = () => {
    navigate(`/movie/${movie.id}`)
  }

  function onfavclick(e) {
    e.preventDefault()
    e.stopPropagation() // Prevent navigation when clicking favorite button
    if (favorite) removeFromFavorites(movie.id)
    else addToFavorites(movie)
  }

  return (
    <div className="movie-card" onClick={handleMovieClick}>
      <div className="movie-poster">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
        />
        <div className="movie-overlay">
          <button
            className={`favorite-btn ${favorite ? "active" : ""}`}
            onClick={onfavclick}
          >
            ♥
          </button>
        </div>
      </div>
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>{movie.release_date?.split("-")[0]}</p>
      </div>
    </div>
  )
}

export default MovieCard