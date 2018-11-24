exports.up = function(knex, Promise) {
  return knex.schema
    .table("movie_genre", function(table) {
      table.specificType("text_search_vector", "TSVECTOR");
    })
    .then(() =>
      knex.raw(
        "CREATE INDEX movie_genre_text_search_vector_index ON movie_genre USING GIN (text_search_vector)"
      )
    );
};

exports.down = function(knex, Promise) {
  return knex.schema.table("movie_genre", function(table) {
    table.dropColumn("text_search_vector");
  });
};
