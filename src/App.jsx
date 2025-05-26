import {React, useEffect, useState} from 'react'
import Search from './components/Search.jsx'
import Spinner from './components/Spinner.jsx'
import MovieCard from './components/MovieCard.jsx';
import { useDebounce } from 'react-use';
import { getTrendingMovies, updateSearchCount } from './appwrite.js';

const API_BASE_URL = 'https://whatson-api.onrender.com/?';

// Not used to this api
// const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
// const API_OPTIONS = {
//   method:'GET',
// }


const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [moviesList, setMoviesList] = useState([]);
  const [trendingMovies, settrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setUsedDebouncedSearchTerm] = useState(searchTerm);

  useDebounce( ()=> setUsedDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    try {
  
      const endpoint = query ? `${API_BASE_URL}title=${encodeURIComponent(query)}` : `${API_BASE_URL}`;
  
      const response = await fetch(endpoint);
      
      if(!response.ok){
        throw new Error('Faield to fetch movies')
      }
  
      const data = await response.json();
      
      if(data.Response === 'False'){
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMoviesList([]);
        return;
      }

      setMoviesList(data.results) || [];
      if (query && data.results.length > 0){
        await updateSearchCount(query, data.results[0]);
      }
  
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');
    }finally {
      setIsLoading(false);
    }
  }

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      
      settrendingMovies(movies);

    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  },[debouncedSearchTerm])

  useEffect(() => {
    loadTrendingMovies();
  }, [])

  return (
    <main>
      <div className='pattern'>
        <div className='wrapper'>
          <header>
            <img src='./hero.png' alt='Hero Banner'/>
            <h1>Find <span className='text-gradient'> Movies </span> You'll Enjoy Without the Hassle</h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
          </header>


          {settrendingMovies.length > 0 && (
            <section className="trending">
              <h2>Treding Movies</h2>
              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={movie.$id}>
                    <p> {index + 1}</p>
                    <img src={movie.poster_url} alt={movie.title}/>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className='all-movies'>
            <h2>All Movies</h2>

            {isLoading ? (
              <Spinner/>
            ) : errorMessage ? (
              <p className="tex-red-500">{errorMessage}</p>
            ): (<ul>
                {moviesList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie}/>
                ))}
            </ul>)}
          </section>
        </div>
      </div>
    </main>
  )
}

export default App


