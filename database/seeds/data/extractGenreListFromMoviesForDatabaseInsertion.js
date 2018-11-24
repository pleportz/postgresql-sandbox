import { flatten, uniq } from "lodash";

export const extractGenreListFromMoviesForDatabaseInsertion = movies => {
  const genres = uniq(flatten(movies.map(({ genres }) => genres))).map(
    genre => ({
      name: genre
    })
  );
  return genres;
};
