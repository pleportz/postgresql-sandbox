exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists("movie_genre", function(table) {
    table
      .uuid("id")
      .defaultTo(knex.raw("uuid_generate_v4()"))
      .notNullable()
      .primary();
    table.string("name").notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("movie_genre");
};
