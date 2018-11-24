export const formatMoviesForDatabaseInsertion = movies =>
  movies.map(({ title, overview }) => ({
    title,
    overview
  }));
