const path = require("path")
const express = require("express");
const authJwt = require('../config/authJwt')
const router = express.Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Returns the list of all the products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: The list of the products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Products'
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
    req.app.db("products")
    .leftJoin("families", "products.families_id", "=", "families.id")
    .column("products.id", "products.name", "quantity", "image", { familyName: "families.name" }, "weight")
    .then((products) => {
        const productsOrderById = products.sort((a, b) => a.id - b.id);
        res.status(200).json({ data: { products: productsOrderById } });
    })
    .catch((error) => {
        res.status(500).json({
            error: { message: "Unable to retrieve products", catchMessage: error },
        });
    });
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Returns a product's detail
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The product's id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The list of the products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Products'
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
    req.app.db("products")
    .where("products.id", id)
    .leftJoin("families", "products.families_id", "=", "families.id")
    .column("products.id", "products.name", "quantity", "image", { familyName: "families.name" }, "weight")
    .then((product) => {
        res.status(200).json({ data: { product: product[0] } });
    })
    .catch((error) => {
        res.status(500).json({
            error: { message: "Unable to retrieve products", catchMessage: error },
        });
    });
});

/**
 * @swagger
 * /products/family/{id}:
 *   get:
 *     summary: Returns every product in a family
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The family's id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The product's lists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
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
router.get("/family/:id", authJwt.verifyJWT, (req, res) => {
    const { id } = req.params;
    req.app.db("products")
    .leftJoin("families", "products.families_id", "=", "families.id")
    .where("families.id", id)
    .column("products.id", "products.name", "quantity", "image", { familyName: "families.name" }, "weight")
    .then((products) => {
        res.status(200).json({ data: { products: products } });
    })
    .catch((error) => {
        res.status(500).json({
            error: { message: "Unable to retrieve products", catchMessage: error },
        });
    });
});

/**
 * @swagger
 * /products/in/areas:
 *   get:
 *     summary: Return the products define in an area
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: The product's lists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 areas:
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
router.get("/in/areas", authJwt.verifyJWT, (req, res) => {
    req.app.db("areas")
    .leftJoin("products", "areas.products_id", "=", "products.id")
    .column(
        { areaId: "areas.id" }, 
        { productId: "products_id" }, 
        { productName: "products.name" }, 
        { productQuantity: "quantity" },
        { productImage: "image" },
        { productWeight: "weight" }
    )
    .then((results) => {
        const areas = results.map(value => { return {
            area: value.areaId,
            product: {
                id: value.productId,
                name: value.productName,
                quantity: value.productQuantity,
                image: value.productImage,
                weight: value.productWeight,
            }
        }}).sort((a, b) => a.area - b.area);
        res.status(200).json({ data: { areas: areas } });
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({
            error: { message: "Unable to retrieve products", catchMessage: error },
        });
    });
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product 
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               familyId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: The product is create
 *         content:
 *           application/json:
 *             data:
 *               type: object
 *               properties:
 *                 productId:
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
    const { name, familyId, quantity } = req.body;
    req.app.db("products")
    .insert({ name: name, families_id: familyId, quantity: quantity })
    .returning("id")
    .then(returnId => {
        res.status(200).json({ data: { productId: returnId[0] } });
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({
            error: { message: "Unable to retrieve products", catchMessage: error },
        });
    });
});

/**
 * @swagger
 * /products/{id}/images:
 *   put:
 *     summary: Upload the image of the products
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The products's id
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
router.put("/:id/images", authJwt.verifyJWT, (req, res) => {
    const { id } = req.params;
    if (req.files.File) {
        const file = req.files.File;
        const extension = "." + file.name.split(".").pop();
        const filename = id + extension;
        const filepath = path.join(process.env.UPLOAD_DIR, "images/", filename);

        file.mv(filepath, function (err) {
            if (err) {
                res.status(500).json({
                    error: { message: "File not upload", catchMessage: err },
                });
            } else {
                req.app.db("products")
                .where("id", id)
                .update({ image: filename })
                .then(() =>
                    res.status(200).json({ data: { message: "File upload successfuly" } })
                )
                .catch(error =>
                    res.status(500).json({ error: {
                            message: "A server error occurred",
                            catchMessage: error,
                        },
                    })
                );
            }
        });
    } else {
        res.status(500).json({ error: { message: "An error occured while uploading the photo" } });
    }
});

/**
 * @swagger
 * /products/{id}/weight/{weight}:
 *   put:
 *     summary: Edit the weight of a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The product's id
 *         schema:
 *           type: integer
 *       - in: path
 *         name: weight
 *         required: true
 *         description: The new weight
 *         schema:
 *           type: float
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
router.put("/:id/weight/:weight", authJwt.verifyJWT, (req, res) => {
    const { id, weight } = req.params;
    req.app.db("products")
    .where("id", id)
    .update({ weight: weight })
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
 * /products/{id}/quantity/{quantity}:
 *   put:
 *     summary: Edit the quantity of a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The product's id
 *         schema:
 *           type: integer
 *       - in: path
 *         name: quantity
 *         required: true
 *         description: The new quantity
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
router.put("/:id/quantity/:quantity", authJwt.verifyJWT, (req, res) => {
    const { id, quantity } = req.params;
    req.app.db("products")
    .where("id", id)
    .update({ quantity: quantity })
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
 * /products/{id}/quantity-reduce:
 *   put:
 *     summary: Reduce by 1 the quantity of a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The product's id
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
router.put("/:id/quantity-reduce", authJwt.verifyJWT, (req, res) => {
    const { id } = req.params;
    req.app.db("products")
    .where("id", id)
    .column("quantity")
    .then(results => {
        const quantity = results[0].quantity
        if (quantity == 0) {
            res.status(200).json({ data: { message: "You can't have a negative quantity of product" } })
        } else {
            req.app.db("products")
            .where("id", id)
            .update({ quantity: quantity-1 })
            .then(() => {
                res.status(200).json({ data: { message: "Update done successfully" } });
            })
            .catch((error) => {
                res.status(500).json({
                    error: { message: "Unable to retrieve products", catchMessage: error },
                });
            });
        }
    })
    .catch((error) => {
        res.status(500).json({
            error: { message: "Unable to retrieve products", catchMessage: error },
        });
    });
});

/**
 * @swagger
 * /products/{id}/quantity-increase:
 *   put:
 *     summary: Increase by 1 the quantity of a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The product's id
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
router.put("/:id/quantity-increase", authJwt.verifyJWT, (req, res) => {
    const { id } = req.params;
    req.app.db("products")
    .where("id", id)
    .column("quantity")
    .then((results) => {
        const quantity = results[0].quantity
        req.app.db("products")
        .where("id", id)
        .update({ quantity: quantity+1 })
        .then(() => {
            res.status(200).json({ data: { message: "Update done successfully" } });
        })
        .catch((error) => {
            res.status(500).json({
                error: { message: "Unable to retrieve products", catchMessage: error },
            });
        });
    })
    .catch((error) => {
        res.status(500).json({
            error: { message: "Unable to retrieve products", catchMessage: error },
        });
    });
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Edit a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The product's id
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               image:
 *                 type: string
 *               familyId:
 *                 type: integer
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
router.put("/:id", authJwt.verifyJWT, (req, res) => {
    const { id } = req.params;
    const { name, quantity, image, familyId } = req.body;
    req.app.db("products")
    .where("id", id)
    .update({ name: name, quantity: quantity, image: image, families_id: familyId })
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
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The product's id
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
    .db("products")
    .where("id", id)
    .del()
    .then(() => {
        res.status(200).json({ data: { message: "Delete done successfully" } });
    })
    .catch((error) => {
        res.status(500).json({
            error: { message: "Unable to retrieve products", catchMessage: error },
        });
    });
});
  
module.exports = router;