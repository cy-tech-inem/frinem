const express = require("express");
const authJwt = require('../config/authJwt');
const router = express.Router();

/**
 * @swagger
 * /areas:
 *   get:
 *     summary: Returns the list of all the areas
 *     tags: [Areas]
 *     responses:
 *       200:
 *         description: The list of the areas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 areas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Areas'
 *       500:
 *         description: The error result
 *         content:
 *           application/json:
 *             data:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/", authJwt.verifyJWT, (req, res) => {
    req.app
    .db("areas")
    .column("id", "localisation", {productsId: "products_id"})
    .then((results) => {
        const areas = results.sort((a, b) => a.id - b.id)
        res.status(200).json({ data: { areas: areas } });
    })
    .catch((error) => {
        res.status(500).json({
            error: { message: "Unable to retrieve areas", catchMessage: error },
        });
    });
});

/**
 * @swagger
 * /areas/{id}:
 *   get:
 *     summary: Returns the infos of an area
 *     tags: [Areas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The area's id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The list of the areas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 area:
 *                   type: object
 *       500:
 *         description: The error result
 *         content:
 *           application/json:
 *             data:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/:id", authJwt.verifyJWT, (req, res) => {
    const { id } = req.params;
    req.app
    .db("areas")
    .where("areas.id", id)
    .leftJoin("products", "areas.products_id", "=", "products.id")
    .column(
        "areas.id", 
        "localisation", 
        {productId: "products.id"}, 
        {productName: "products.name"}, 
        {productQuantity: "products.quantity"}, 
        {productWeight: "products.weight"}
    )
    .then((result) => {
        const area = {
            id: result[0].id,
            localisation: result[0].localisation,
            product: {
                id: result[0].productId,
                name: result[0].productName,
                quantity: result[0].productQuantity,
                weight: result[0].productWeight,
            }
        }
        res.status(200).json({ data: { area: area } });
    })
    .catch((error) => {
        res.status(500).json({
            error: { message: "Unable to retrieve areas", catchMessage: error },
        });
    });
});

/**
 * @swagger
 * /areas/{id}/products/{productsId}:
 *   put:
 *     summary: Edit the product of an array (no product's id if null)
 *     tags: [Areas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The area's id
 *         schema:
 *           type: integer
 *       - in: path
 *         name: productsId
 *         description: The products'id (nothing if null)
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: The error result
 *         content:
 *           application/json:
 *             data:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.put("/:id/products/:productsId", authJwt.verifyJWT, (req, res) => {
    var { id, productsId } = req.params
    productsId = parseInt(productsId) ? productsId : null
    req.app.db("areas")
    .where("id", id)
    .update({ products_id: productsId })
    .then(() => {
        res.status(200).json({ data: { message: "Update done successfully" } });
    })
    .catch((error) => {
        res.status(500).json({
            error: { message: "Unable to retrieve areas", catchMessage: error },
        });
    });
});
  
module.exports = router;