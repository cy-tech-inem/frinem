const definitions = require('../definitions');

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex(definitions.areas.tableName)
    .del()
    .then(function () {
      // Inserts seed entries
      return knex(definitions.areas.tableName).insert([
        {
          localisation: "top-left",
        },
        {
          localisation: "top-right",
        },
        {
          localisation: "bottom-left",
        },
        {
          localisation: "bottom-right",
        },
      ]);
    });
};
