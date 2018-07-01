const books = require("./data/28181-books-with-lended-count-in-France-in-2017.json");

const booksToInsert = books.slice(0, 10000).map(book => ({
  title: book.fields.titre,
  author: book.fields.auteur,
  editor: book.fields.editeur,
  category: book.fields.categorie_documentaire,
  publishingYear: book.fields.annee_edition,
  lendingNumber2017: book.fields.nb_prets_2017
}));

exports.seed = function(knex, Promise) {
  return knex("book").insert(booksToInsert);
};
