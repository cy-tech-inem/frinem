
/**
 * @file Knex file. Creation of the initial tables.
 * @author Amaury DERIGNY
 */

const definitions = require('../definitions')

 /**
  * Create the users table.
  * @param table - Table object in knex type
  */
function createTableUsers(table) {
    table.increments(definitions.users.idCol).primary();
    table.string(definitions.users.firstnameCol).notNullable();
    table.string(definitions.users.nameCol).notNullable();
    table.integer(definitions.users.openCountCol).notNullable().defaultTo(0);
}
 
exports.up = function(knex) {
    return knex.schema
        .createTable(definitions.users.tableName, createTableUsers)
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists(definitions.users.tableName)
};
 