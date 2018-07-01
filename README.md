# A sandbox for testing PostgreSQL features

## Study 1 - Search engine with single input field

We have a `book` table with 10000 entries and the following columns:

| id   | title  | author |  publishingYear |  editor |  category |  lendingNumber2017 |
| ---- | ------ | ------ | --------------- | ------- | --------- | ------------------ |
| uuid | string | string | integer         | string  | string    | integer            |

Time measurements of requests are made using PostgreSQL `\timing` on my personal computer.

We want to search the table for books that contain the `inputString` either in the `title`, `author`, `editor` or `category` columns.

### Method 1 - using ILIKE

`SELECT COUNT(*) FROM book WHERE title ILIKE '%lent%' OR author ILIKE '%lent%' OR editor ILIKE '%lent%' OR category ILIKE '%lent%';` -> 22 results

`SELECT title, author, editor, category, "lendingNumber2017" FROM book WHERE title ILIKE '%lent%' OR author ILIKE '%lent%' OR editor ILIKE '%lent%' OR category ILIKE '%lent%';`
Average timing on 10 tries: 33,887 ms

### Method 2 - using full text search

Advantages:

* results ranking by relevance
