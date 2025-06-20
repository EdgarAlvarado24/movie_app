import React from 'react'
import isUrlHttp from 'is-url-http';

const MovieCard = ({movie:
  {title, ratings_average, popularity_average ,image, release_date, genres}
}) => {
  return (
    <div className='movie-card'>
      <img 
        src={isUrlHttp(image) ? 
        image : '/no-movie.png'}
        alt={title}
      />

      <div className='mt-4'>
        <h3>{title}</h3>

        <div className='content'>
          <div className='rating'>
            <img src='/star.svg' alt='Start Icon' />
            <p>{popularity_average ? popularity_average.toFixed(1) : 'N/A'}</p>
          </div>

          <span>•</span>
          {genres ? genres.map((genre, index) => (
            <p id={index} className='lang'> {genre} </p>
          )) : <p className='lang'>N/A</p>}
          
          <span>•</span>
          <p className='year'>
            {release_date ? release_date.split('-')[0] : 'N/A' }
          </p>
        
        </div>
      </div>
    </div>
  )
}
export default MovieCard