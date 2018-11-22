exports.up = function(knex, Promise) {
  return knex.schema.table("movie", function(table) {
    table.specificType("text_search_vector", "TSVECTOR");
  })
  .then(() => knex.raw('CREATE INDEX movie_text_search_vector_index ON movie USING GIN (text_search_vector)'));
};

exports.down = function(knex, Promise) {
  return knex.schema.table("movie", function(table) {
    table.dropColumn("text_search_vector");
  });
};
