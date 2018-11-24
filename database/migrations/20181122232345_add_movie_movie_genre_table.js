exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists("movie_movie_genre", function(
    table
  ) {
    table
      .uuid("id")
      .defaultTo(knex.raw("uuid_generate_v4()"))
      .notNullable()
      .primary();
    table.uuid("movieId").notNullable();
    table.uuid("movieGenreId").notNullable();
    table
      .foreign("movieId")
      .references("id")
      .inTable("movie")
      .onDelete("CASCADE");
    table
      .foreign("movieGenreId")
      .references("id")
      .inTable("movie_genre")
      .onDelete("CASCADE");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("movie_movie_genre");
};
