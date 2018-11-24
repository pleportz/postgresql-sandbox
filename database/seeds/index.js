const books = require("./data/28181-books-with-lended-count-in-France-in-2017.json");
const movies = require("./data/kaggleMovies.json");
import { extractGenreListFromMoviesForDatabaseInsertion } from "./data/extractGenreListFromMoviesForDatabaseInsertion";
import { formatMoviesForDatabaseInsertion } from "./data/formatMoviesForDatabaseInsertion";
import { formatMovieMoviesGenreAssociationsForDatabaseInsertion } from "./data/formatMovieMoviesGenreAssociationsForDatabaseInsertion";

const booksToInsert = books.slice(0, 10000).map(book => ({
  title: book.fields.titre,
  author: book.fields.auteur,
  editor: book.fields.editeur,
  category: book.fields.categorie_documentaire,
  publishingYear: book.fields.annee_edition,
  lendingNumber2017: book.fields.nb_prets_2017
}));

const movieGenresToInsert = extractGenreListFromMoviesForDatabaseInsertion(
  movies
);
const moviesToInsert = formatMoviesForDatabaseInsertion(movies);

exports.seed = async function(knex, Promise) {
  await knex.table("movie").del();
  await knex.table("movie_genre").del();
  await knex.table("book").del();

  await knex("book").insert(booksToInsert);

  const insertedMovieGenres = await knex("movie_genre")
    .insert(movieGenresToInsert)
    .returning("*");
  const insertedMovies = await knex("movie")
    .insert(moviesToInsert)
    .returning("*");

  const movieMovieGenreAssociationsToInsert = formatMovieMoviesGenreAssociationsForDatabaseInsertion(
    movies,
    insertedMovies,
    insertedMovieGenres
  );

  await knex("movie_movie_genre").insert(movieMovieGenreAssociationsToInsert);

  await knex.schema.raw(
    "UPDATE movie SET text_search_vector = setweight(to_tsvector('english', coalesce(title, '')), 'A') || setweight(to_tsvector('english', coalesce(overview, '')), 'B');"
  );
  await knex.schema.raw(
    "UPDATE movie_genre SET text_search_vector = setweight(to_tsvector('english', coalesce(name, '')), 'A');"
  );
  await knex.raw("REFRESH MATERIALIZED VIEW search_movie");
};
