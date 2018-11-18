# A sandbox for testing PostgreSQL features

- Launch the db with docker: `docker-compose -f docker/docker-compose.yml up`
- Connect to the db: `psql -h localhost -p 5432 -U docker -d demodb`. Password: `docker`

## Study 1 - Search engine with single input field

We have a `book` table with 10,000 entries and the following columns:

| id   | title  | author |  publishingYear |  editor |  category |  lendingNumber2017 |
| ---- | ------ | ------ | --------------- | ------- | --------- | ------------------ |
| uuid | string | string | integer         | string  | string    | integer            |

Time measurements of requests are made using PostgreSQL `\timing` on my personal computer.

We want to search the table for books that contain the `inputString` either in the `title`, `author`, `editor` or `category` columns.

### Method 1 - using ILIKE

`SELECT title, author, editor, category FROM book WHERE title ILIKE '%performance%' OR author ILIKE '%performance%' OR editor ILIKE '%performance%' OR category ILIKE '%performance%';` -> 2 results

Average timing of 1 request over 10 tries: **33.89 ms**

### Method 2 - using full text search

Advantages relatively to the `ILIKE` method:

* Language specific semantic help: searching for the word "fox" will match the words "fox" and "foxes" but not "foxtrot" (because "foxes" gets normalized as "fox" by `to_tsvector` but "foxtrot" does not). Similarly, searching for "foxes" will match both "fox" and "foxes".
* Results ranking by relevance

**Step 1**

Associate a text search vector to each entry:

`UPDATE book SET tokens = to_tsvector('french', coalesce(title, '')) || to_tsvector('french', coalesce(author, '')) || to_tsvector('french', coalesce(editor, '')) || to_tsvector('french', coalesce(category, ''));`

**Step 2**

Search:

`SELECT title, author, editor, category FROM book WHERE tokens @@ to_tsquery('french', 'sciences');`

=> Average timing over 10 tries : **4.10 ms (query duration decreased by 88%)**

We can see the advantage of full text search versus the ILIKE method when we search for the input "performant" instead of "performance". The ILIKE method returns 0 results whereas the full text method returns the same 2 results as with the "performance" input.

**Step 3**

Add A, B, C or D weights to tokens (highest relevance is A and lowest is D). In this example we consider the `title` and the `author` to be the most relevant criteria and therefore they have the `A` rank, while `category` and `editor` are ranked `B` and `C` respectively:

`UPDATE book SET tokens = setweight(to_tsvector('french', coalesce(title, '')), 'A') || setweight(to_tsvector('french', coalesce(author, '')), 'A') || setweight(to_tsvector('french', coalesce(editor, '')), 'C') || setweight(to_tsvector('french', coalesce(category, '')), 'B');`

Then you can get ranked results using the `ts_rank` function, that computes a matching coefficient:

`SELECT title, author, editor, category, ts_rank(tokens, to_tsquery('french', 'histoire')) FROM book WHERE tokens @@ to_tsquery('french', 'histoire') ORDER BY ts_rank(tokens, to_tsquery('french', 'histoire')) DESC;`

Note: "histoire" is an interesting input because the first two results have different `ts_rank` results.
