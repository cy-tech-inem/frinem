/**
 * @file Constants definitions for the tables.
 * @author Amaury DERIGNY
 */

/**
 * Names used in the families table.
 * @type {object}
 */
const families = {
    tableName: "families",
    idCol: "id",
    nameCol: "name",
}

/**
 * Names used in the products table.
 * @type {object}
 */
const products = {
    tableName: "products",
    idCol: "id",
    nameCol: "name",
    quantityCol: "quantity",
    imageCol: "image",
    familiesIdCol: "families_id",
    weightCol: "weight"
};

/**
 * Names used in the users table.
 * @type {object}
 */
const users = {
    tableName: "users",
    idCol: "id",
    nameCol: "name",
    firstnameCol: "firstname",
    openCountCol: "open_count",
}

/**
 * Names used in the users table.
 * @type {object}
 */
const areas = {
    tableName: "areas",
    idCol: "id",
    localisationCol: "localisation",
    productsIdCol: "products_id",
}



module.exports = {
    families,
    products,
    users,
    areas,
}