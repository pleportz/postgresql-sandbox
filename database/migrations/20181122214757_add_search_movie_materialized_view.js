exports.up = function(knex, Promise) {
  return knex.schema.raw(
    'CREATE MATERIALIZED VIEW search_movie AS \n' +
      'SELECT movie.id,\n' +
      '       movie.title,\n' +
      '       movie.overview,\n' +
      "       setweight(to_tsvector('english', coalesce(movie.title, '')), 'A') || \n" +
      "       setweight(to_tsvector('english', coalesce(movie.overview, '')), 'B') as text_search_vector\n" +
      'FROM movie'
  )
  .then(() => knex.raw('CREATE INDEX search_movie_id_index ON search_movie ("id")'))
  .then(() => knex.raw('CREATE INDEX search_movie_text_search_vector_index ON search_movie USING GIN(text_search_vector)'));
};

exports.down = function(knex, Promise) {
  return knex.schema.raw('DROP MATERIALIZED VIEW IF EXISTS search_movie');
};
