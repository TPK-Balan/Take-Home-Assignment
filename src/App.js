import React, { useState, useEffect } from 'react';
import './App.css';

function MovieCard({ movie, onClick }) {
  return (
    <div className="movie-card" onClick={() => onClick(movie.id)}>
      <h3 className="movie-title">{movie.title}</h3>
      {movie.tagline && <p className="movie-tagline">"{movie.tagline}"</p>}
      <div className="movie-rating">
        <span className="rating-label">Rating:</span>
        <span className="rating-value">{movie.vote_average} / 10</span>
      </div>
    </div>
  );
}

function MovieDetail({ movieId, onBack }) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMovie() {
      try {
        const res = await fetch(`/api/movies/${movieId}`);
        if (!res.ok) throw new Error('Failed to load movie');
        const payload = await res.json();
        setMovie(payload.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMovie();
  }, [movieId]);

  if (loading) return <div className="status-msg">Loading...</div>;
  if (error) return <div className="status-msg error">{error}</div>;
  if (!movie) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    // date format in data is d/m/yy or d/m/yyyy
    const parts = dateStr.split('/');
    if (parts.length !== 3) return dateStr;
    let [day, month, year] = parts;
    if (year.length === 2) year = '19' + year;
    const d = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={onBack}>← Back to Movies</button>
      <div className="detail-card">
        <h1 className="detail-title">{movie.title}</h1>
        {movie.original_title && movie.original_title !== movie.title && (
          <p className="detail-original-title">Original title: {movie.original_title}</p>
        )}
        {movie.tagline && <p className="detail-tagline">"{movie.tagline}"</p>}

        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Release Date</span>
            <span className="detail-value">{formatDate(movie.release_date)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Runtime</span>
            <span className="detail-value">{movie.runtime} minutes</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Rating</span>
            <span className="detail-value">{movie.vote_average} / 10</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Vote Count</span>
            <span className="detail-value">{movie.vote_count?.toLocaleString()}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Status</span>
            <span className="detail-value">{movie.status}</span>
          </div>
        </div>

        {movie.overview && (
          <div className="detail-overview">
            <h3>Overview</h3>
            <p>{movie.overview}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await fetch('/api/movies');
        if (!res.ok) throw new Error('Failed to load movies');
        const payload = await res.json();
        setMovies(payload.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, []);

  if (selectedId) {
    return <MovieDetail movieId={selectedId} onBack={() => setSelectedId(null)} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Movie Library</h1>
        <p className="subtitle">{movies.length} movies available</p>
      </header>

      <main className="main-content">
        {loading && <div className="status-msg">Loading movies...</div>}
        {error && <div className="status-msg error">{error}</div>}
        {!loading && !error && (
          <div className="movies-grid">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onClick={setSelectedId} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
