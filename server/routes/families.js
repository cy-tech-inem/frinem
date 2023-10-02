const express = require("express");
const authJwt = require('../config/authJwt')
const router = express.Router();

/**
 * @swagger
 * /families:
 *   get:
 *     summary: Returns the list of all the families
 *     tags: [Families]
 *     responses:
 *       200:
 *         description: The list of the families
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 families:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Families'
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
    .db("families")
    .column("id", "name")
    .then((families) => {
        res.status(200).json({ data: { families: families } });
    })
    .catch((error) => {
        res.status(500).json({
            error: { message: "Unable to retrieve families", catchMessage: error },
        });
    });
});

/**
 * @swagger
 * /families:
 *   post:
 *     summary: Create a new family 
 *     tags: [Families]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: The family is create
 *         content:
 *           application/json:
 *             data:
 *               type: object
 *               properties:
 *                 familiyId:
 *                   type: integer
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
router.post("/", authJwt.verifyJWT, (req, res) => {
    const { name } = req.body;
    req.app.db("families")
    .insert({ name: name })
    .returning("id")
    .then(id => {
        res.status(200).json({ data: { familyId: id[0] } });
    })
    .catch((error) => {
        res.status(500).json({
            error: { message: "Unable to retrieve users", catchMessage: error },
        });
    });
});

/**
 * @swagger
 * /families/{id}/name/{name}:
 *   put:
 *     summary: Edit the name of a family
 *     tags: [Families]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The family's id
 *         schema:
 *           type: integer
 *       - in: path
 *         name: name
 *         required: true
 *         description: The new name
 *         schema:
 *           type: string
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
router.put("/:id/name/:name", authJwt.verifyJWT, (req, res) => {
    const { id, name } = req.params;
    req.app.db("families")
    .where("id", id)
    .update({ name: name })
    .then(() => {
        res.status(200).json({ data: { message: "Update done successfully" } });
    })
    .catch((error) => {
        res.status(500).json({
            error: { message: "Unable to retrieve products", catchMessage: error },
        });
    });
});

/**
 * @swagger
 * /families/{id}:
 *   delete:
 *     summary: Delete a family
 *     tags: [Families]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The family's id
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
router.delete("/:id", authJwt.verifyJWT, (req, res) => {
    const { id } = req.params
    req.app
    .db("families")
    .where("id", id)
    .del()
    .then(() => {
        res.status(200).json({ data: { message: "Delete done successfully" } });
    })
    .catch((error) => {
        res.status(500).json({
            error: { message: "Unable to retrieve families", catchMessage: error },
        });
    });
});
  
module.exports = router;