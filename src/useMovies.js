import { useState, useEffect } from "react";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(
    function () {
      // const controller = AbortController();
      setIsLoading(true);
      setError("");
      try {
        async function fetchMovies() {
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}
            `
            // { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("Something went wrong with fectching movies ");
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");
          setMovies(data.Search);
        }
        if (query.length < 4) {
          setMovies([]);
          setError("");
          return;
        }
        fetchMovies();
        // return function () {
        //   controller.abort();
        // };
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [query]
  );
}
