import { flatten } from "lodash";

export const formatMovieMoviesGenreAssociationsForDatabaseInsertion = (
  rawMovies,
  insertedMovies,
  insertedMovieGenres
) => {
  const movieIdMovieGenreIdsAssociations = rawMovies.map((movie, index) => ({
    movieId: insertedMovies[index].id,
    movieGenreIds: movie.genres.map(
      genreName =>
        insertedMovieGenres.find(movieGenre => movieGenre.name === genreName).id
    )
  }));

  const movieMovieGenreAssociationsToInsert = flatten(
    movieIdMovieGenreIdsAssociations.map(({ movieId, movieGenreIds }) =>
      movieGenreIds.map(movieGenreId => ({ movieGenreId, movieId }))
    )
  );

  return movieMovieGenreAssociationsToInsert;
};
