# A sandbox for testing PostgreSQL features

## Study 1 - Search engine with single input field

We have a `book` table with 10000 entries and the following columns:

| id   | title  | author |  publishingYear |  editor |  category |  lendingNumber2017 |
| ---- | ------ | ------ | --------------- | ------- | --------- | ------------------ |
| uuid | string | string | integer         | string  | string    | integer            |

Time measurements of requests are made using PostgreSQL `\timing` on my personal computer.

We want to search the table for books that contain the `inputString` either in the `title`, `author`, `editor` or `category` columns.

### Method 1 - using ILIKE

`SELECT title, author, editor, category, "lendingNumber2017" FROM book WHERE title ILIKE '%lent%' OR author ILIKE '%lent%' OR editor ILIKE '%lent%' OR category ILIKE '%lent%';` -> 22 results

Average timing of 1 request over 10 tries: **33,887 ms**

### Method 2 - using full text search

Advantages relatively to the `ILIKE` method:

* Language specific semantic help: searching for the word "fox" will match the words "fox" and "foxes" but not "foxtrot" (because "foxes" gets normalized as "fox" by `to_tsvector` but "foxtrot" does not)
* Results ranking by relevance

First step : associate a text search vector to each entry:
`UPDATE book SET tokens = to_tsvector('french', coalesce(title, ''));`
=> TODO: include other columns in vector

Step 2: search
`SELECT title, author FROM book WHERE tokens @@ to_tsquery('french', 'lent');`
=> TODO: include other columns in vector
