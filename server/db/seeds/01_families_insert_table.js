const definitions = require('../definitions');

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex(definitions.families.tableName)
    .del()
    .then(function () {
      // Inserts seed entries
      return knex(definitions.families.tableName).insert([
        {
          name: "Boisson",
        },
        {
          name: "Nourriture",
        },
        {
          name: "Autre",
        },
      ]);
    });
};
