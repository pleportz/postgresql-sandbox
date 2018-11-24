select *
  from "search_recipe"
  where document @@ to_tsquery('french', $1) and "type" = $2
  order by ts_rank(document, to_tsquery('french', $3)) DESC
  limit $4 ;
  with args: [Tarte,doItYourself,Tarte,1] ;
  time: 3.525 ms


SELECT title, overview FROM movie
WHERE title ILIKE '%eat%' OR overview ILIKE '%eat%';

SELECT COUNT(*) FROM movie
WHERE title ILIKE '%eat%' OR overview ILIKE '%eat%';

SELECT COUNT(*) FROM movie
WHERE title ILIKE '%eat better%' OR overview ILIKE '%eat better%';

UPDATE movie
SET text_search_vector = setweight(to_tsvector('english', coalesce(title, '')), 'A') || setweight(to_tsvector('english', coalesce(overview, '')), 'B');

SELECT title, overview
FROM movie
WHERE text_search_vector @@ to_tsquery('english', 'eat');

SELECT count(*)
FROM movie
WHERE text_search_vector @@ to_tsquery('english', 'eat');

SELECT title, overview
FROM search_movie
WHERE text_search_vector @@ to_tsquery('english', 'eat');

-- Cost 2777.05, Execution time: 23.104 ms
EXPLAIN ANALYZE
SELECT movie.title, movie_genre.name
FROM movie
LEFT JOIN movie_movie_genre
  ON movie.id = movie_movie_genre."movieId"
LEFT JOIN movie_genre
  ON movie_movie_genre."movieGenreId" = movie_genre.id;

CREATE INDEX movie_movie_genre_movieid_index ON movie_movie_genre ("movieId");
CREATE INDEX movie_movie_genre_moviegenreid_index ON movie_movie_genre ("movieGenreId");
DROP INDEX IF EXISTS movie_movie_genre_movieid_index;
DROP INDEX IF EXISTS movie_movie_genre_moviegenreid_index;

-- Adventure, Fantasy, Family
SELECT movie.title, movie_genre.name
FROM movie
LEFT JOIN movie_movie_genre
  ON movie.id = movie_movie_genre."movieId"
LEFT JOIN movie_genre
  ON movie_movie_genre."movieGenreId" = movie_genre.id
WHERE movie.title = 'Jumanji';

-- Cost 2777.07, Execution time: 219.309 ms
EXPLAIN ANALYZE
SELECT movie.title, movie_genre.name
FROM movie
LEFT JOIN movie_movie_genre
  ON movie.id = movie_movie_genre."movieId"
LEFT JOIN movie_genre
  ON movie_movie_genre."movieGenreId" = movie_genre.id
WHERE movie.title ILIKE '%eat%'
  OR movie.overview ILIKE '%eat%'
  OR movie_genre.name ILIKE '%eat%';


