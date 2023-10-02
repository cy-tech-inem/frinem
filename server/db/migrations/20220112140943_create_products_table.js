
/**
 * @file Knex file. Creation of the initial tables.
 * @author Amaury DERIGNY
 */

const definitions = require('../definitions')

/**
 * Create the families table.
 * @param table - Table object in knex type
 */
function createTableFamilies(table) {
    table.increments(definitions.families.idCol).primary();
    table.string(definitions.families.nameCol).notNullable().unique();
}

/**
 * Create the products table.
 * @param table - Table object in knex type
 */
function createTableProducts(table) {
    table.increments(definitions.products.idCol).primary();
    table.string(definitions.products.nameCol).notNullable().unique();
    table.integer(definitions.products.quantityCol).notNullable().defaultTo(0);
    table.string(definitions.products.imageCol);
    table.integer(definitions.products.familiesIdCol).notNullable();
    table
        .foreign(definitions.products.familiesIdCol)
        .references(definitions.families.idCol)
        .inTable(definitions.families.tableName)
        .onDelete("CASCADE");
    table.float(definitions.products.weightCol);
}

exports.up = function(knex) {
    return knex.schema
        .createTable(definitions.families.tableName, createTableFamilies)
        .createTable(definitions.products.tableName, createTableProducts)
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists(definitions.products.tableName)
        .dropTableIfExists(definitions.families.tableName)
};
