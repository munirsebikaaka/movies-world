import { useEffect, useRef } from "react";
import { useState } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";

const KEY = "ef1735bd";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
export default function App() {
  const [query, setQuery] = useState("");
  const [watched, setWatched] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useMovies(query);

  function handleSelectMovie(id) {
    setSelectedId(id);
  }
  function handleCloseMovie() {
    setSelectedId(null);
  }

  function hundleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
    localStorage.getItem("watched", JSON.stringify([...watched, movie]));
  }

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MoviesList movies={movies} />}</Box> */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MoviesList movies={movies} handleSelectMovie={handleSelectMovie} />
          )}
          {Error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MoviesDetails
              selectedId={selectedId}
              onCloseMovieD={handleCloseMovie}
              onHundleAddWatched={hundleAddWatched}
            />
          ) : (
            <>
              <WatchedSamery watched={watched} />
              <WatchedMovieList watched={watched} />{" "}
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      {/* <span>x</span> */}
      {/* {message} */}
    </p>
  );
}

function Loader() {
  return <p className="loader">loading....</p>;
}
function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function Search({ query, setQuery }) {
  const inputEl = useRef(null);
  useEffect(function () {
    function callBack(e) {
      if (e.code === "Enter") inputEl.current.focus();
    }
    document.addEventListener("keydown", callBack);
    return () => document.addEventListener("keydown", callBack);
  }, []);
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}
function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MoviesList({ movies, handleSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          handleSelectMovie={handleSelectMovie}
        />
      ))}
    </ul>
  );
}
function Movie({ movie, handleSelectMovie }) {
  return (
    <li onClick={() => handleSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MoviesDetails({ selectedId, onCloseMovieD, onHundleAddWatched }) {
  const [movie, setMovie] = useState({});
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;
  console.log(title, year);
  useEffect(
    function () {
      async function getMovieDetails() {
        const res =
          await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}
        `);
        const data = await res.json();
        setMovie(data);
      }
      getMovieDetails();
    },
    [selectedId]
  );
  function addWatched() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
    };
    onHundleAddWatched(newWatchedMovie);
  }
  useEffect(
    function () {
      if (!title) return;
      document.title = `movie | ${title}`;
      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );
  return (
    <div className="details">
      <header>
        <button onClick={onCloseMovieD} className="btn-back">
          x
        </button>
        <img src={poster} alt={`poster of ${movie}`} />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {released} &bull; {runtime}
          </p>
          <p>{genre}</p>
          <p>
            <span>⭐️</span>
            {imdbRating} IMDB rating
          </p>
        </div>
      </header>
      <section>
        <div className="rating">
          <StarRating maxRating={10} size={24} />
          <button className="btn-add" onClick={addWatched}>
            + Add to list
          </button>
        </div>
        <p>
          <em>{plot}</em>
        </p>
        <p>Staring {actors}</p>
        <p>Directed by {director}</p>
      </section>
    </div>
  );
}

function WatchedSamery({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}
function WatchedMovieList({ watched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedListMovies movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}
function WatchedListMovies({ movie }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}
