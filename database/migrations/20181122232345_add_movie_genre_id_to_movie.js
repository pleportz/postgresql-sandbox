exports.up = function(knex, Promise) {
  return knex.schema.table('movie', function(table) {
    table.uuid('genreId');
    table
      .foreign('genreId')
      .references('id')
      .inTable('movie_genre')
      .onDelete('SET NULL');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('movie', function(table) {
    table.dropColumn('genreId');
  });
};
