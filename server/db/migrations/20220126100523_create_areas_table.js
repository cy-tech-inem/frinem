
/**
 * @file Knex file. Creation of the initial tables.
 * @author Amaury DERIGNY
 */

const definitions = require('../definitions')

/**
 * Create the areas table.
 * @param table - Table object in knex type
 */
function createTableAreas(table) {
    table.increments(definitions.areas.idCol).primary();
    table.string(definitions.areas.localisationCol).notNullable().unique();
    table.integer(definitions.areas.productsIdCol);
    table
        .foreign(definitions.areas.productsIdCol)
        .references(definitions.products.idCol)
        .inTable(definitions.products.tableName)
        .onDelete("SET NULL");
}


exports.up = function(knex) {
    return knex.schema
        .createTable(definitions.areas.tableName, createTableAreas)
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists(definitions.areas.tableName)  
};
