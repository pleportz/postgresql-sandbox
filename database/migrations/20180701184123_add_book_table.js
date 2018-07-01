exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists("book", function(table) {
    table
      .uuid("id")
      .defaultTo(knex.raw("uuid_generate_v4()"))
      .notNullable()
      .primary();
    table.string("title");
    table.string("author");
    table.string("editor");
    table.string("category");
    table.integer("publishingYear");
    table.integer("lendingNumber2017");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("book");
};
