const express = require("express");
const bcrypt = require('bcryptjs');
const authJwt = require("../config/authJwt");
const router = express.Router();
const QRCode = require('qrcode')

/**
 * @swagger
 * /token:
 *   post:
 *     summary: Return the token of the user if the provided password is correct
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: The password is correct
 *       400:
 *         description: Information provided are incorrect
 */
router.post("/", (req, res) => {
    const { firstname, name, password } = req.body;
    const dollarName = firstname + "$" + name
    const passwordEncrypt = bcrypt.hashSync(process.env.PASSWORD_TOKEN)
    const match = bcrypt.compareSync(password, passwordEncrypt);
    if (match) {
        const token = authJwt.generateAccessToken(dollarName);
        res.status(200).json({ data: { token } });
    } else {
        res.status(400).json({ error: { message: "Le mot de passe saisi est incorrect" } });
    }
});



module.exports = router;