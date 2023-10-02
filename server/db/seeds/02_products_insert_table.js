const definitions = require('../definitions');

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex(definitions.products.tableName)
    .del()
    .then(function () {
      // Inserts seed entries
      return knex(definitions.products.tableName).insert([
        {
          name: "Canette de coca (25cl)",
          quantity: 0,
          image: "1.png",
          families_id: 1,
        },
        {
          name: "Canette d'ice tea (25cl)",
          quantity: 0,
          image: "2.png",
          families_id: 1,
        },
        {
          name: "Cannette de sprite (25cl)",
          quantity: 0,
          image: "3.png",
          families_id: 1,
        },
        {
          name: "Mister freeze",
          quantity: 0,
          image: "4.png",
          families_id: 2,
        },
        {
          name: "Cannette d'oasis (25cl)",
          quantity: 0,
          image: "5.png",
          families_id: 1,
        },
      ]);
    });
};
