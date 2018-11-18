exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists("movie", function(table) {
    table
      .uuid("id")
      .defaultTo(knex.raw("uuid_generate_v4()"))
      .notNullable()
      .primary();
    table.string("title");
    table.text("overview");
    table.specificType("tokens", "TSVECTOR");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("movie");
};
