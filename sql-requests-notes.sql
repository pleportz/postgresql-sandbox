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

-- Cost 121.16, Execution time: 1.236 ms
EXPLAIN ANALYZE
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


-- Cost 3814.73, Execution time: 1110.465 ms
EXPLAIN ANALYZE
SELECT movie.title, movie_genre.name
FROM movie
LEFT JOIN movie_movie_genre ON (movie.id = movie_movie_genre."movieId")
LEFT JOIN movie_genre ON (movie_movie_genre."movieGenreId" = movie_genre.id)
WHERE
  movie.text_search_vector @@ to_tsquery('english', 'eat')
  OR movie_genre.text_search_vector @@ to_tsquery('english', 'eat');


SELECT title, overview, "movieGenres"
FROM search_movie
WHERE text_search_vector @@ plainto_tsquery('english', 'Documentary about eating');

-- Cost 24.02, Execution time: 0.143 ms
EXPLAIN ANALYZE
SELECT title, overview, "movieGenres"
FROM search_movie
WHERE text_search_vector @@ plainto_tsquery('english', 'Documentary about insects');

-- Cost 180.29, Execution time: 9.356 ms
EXPLAIN ANALYZE
SELECT title, ts_rank(text_search_vector, query) AS rank
FROM search_movie, to_tsquery('english', 'future') AS query
WHERE text_search_vector @@ query
ORDER BY rank DESC
LIMIT 20;

SELECT 'tart' & 'poireau' @@ to_tsvector('french', 'tarte à la tomate');

-- Cost 5063.12, Execution time: 60.347 ms
EXPLAIN ANALYZE SELECT title FROM movie
WHERE to_tsquery('english', 'eating') @@ to_tsvector('english', title);

EXPLAIN ANALYZE SELECT title, ts_rank(to_tsvector('english', title), to_tsquery('english', 'eating')) AS rank
FROM movie
WHERE to_tsquery('english', 'eating') @@ to_tsvector('english', title)
ORDER BY ts_rank(to_tsvector('english', title), to_tsquery('english', 'eating')) DESC;

-- Concaténer des ts_vector
SELECT to_tsvector('french', 'Tarte à la tomate') || to_tsvector('french', 'Coupez les tomates en dés');

-- Concaténer des ts_vector et leur donner chacun un poids
SELECT setweight(to_tsvector('french', 'Tarte à la tomate'), 'A') || setweight(to_tsvector('french', 'Coupez les tomates en dés'), 'B');

SELECT ts_rank(to_tsvector('french', 'Tarte à la tomate'), to_tsquery('french', 'Aligot & et & saucisse & de & Montbéliard'));
