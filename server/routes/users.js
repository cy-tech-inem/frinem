const express = require("express");
const authJwt = require('../config/authJwt')
const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns the list of all the users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Users'
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
    .db("users")
    .column("id", "name", { openCount: "open_count" })
    .then((users) => {
        res.status(200).json({ data: { users: users } });
    })
    .catch((error) => {
        res.status(500).json({
            error: { message: "Unable to retrieve users", catchMessage: error },
        });
    });
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Returns the list of an user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user's id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The user's info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
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
    req.app.db("users")
    .where("id", id)
    .column("id", "name", { openCount: "open_count" })
    .then((user) => {
        res.status(200).json({ data: { user: user[0] } });
    })
    .catch((error) => {
        res.status(500).json({
            error: { message: "Unable to retrieve users", catchMessage: error },
        });
    });
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user 
 *     tags: [Users]
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
 *         description: The user is create
 *         content:
 *           application/json:
 *             data:
 *               type: object
 *               properties:
 *                 userId:
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
    req.app
    .db("users")
    .insert({ name: name })
    .returning("id")
    .then(id => {
        res.status(200).json({ data: { userId: id[0] } });
    })
    .catch((error) => {
        res.status(500).json({
            error: { message: "Unable to retrieve users", catchMessage: error },
        });
    });
});

/**
 * @swagger
 * /users/{id}/open-count:
 *   put:
 *     summary: Add one to the open count of user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user's id
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
router.put("/:id/open-count", authJwt.verifyJWT, (req, res) => {
    const { id } = req.params;
    req.app.db("users")
    .where("id", id)
    .column({ openCount: "open_count" })
    .then(openCount => {
        req.app.db("users")
        .where("id", id)
        .update({ open_count: openCount[0].openCount+1 })
        .then(() => {
            res.status(200).json({ data: { message: "Update done successfully" } });
        })
        .catch((error) => {
            res.status(500).json({
                error: { message: "Unable to retrieve users", catchMessage: error },
            });
        });
    })
    .catch((error) => {
        res.status(500).json({
            error: { message: "Unable to retrieve users", catchMessage: error },
        });
    });
});

  
module.exports = router;