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
