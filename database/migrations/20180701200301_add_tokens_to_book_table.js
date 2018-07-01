exports.up = function(knex, Promise) {
  return knex.schema.table("book", function(table) {
    table.specificType("tokens", "TSVECTOR");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("book", function(table) {
    table.dropColumn("tokens");
  });
};
