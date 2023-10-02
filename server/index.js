require('dotenv').config({path: './.env'})

const express = require('express');
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const database = require('./db/db');
const fileUpload = require('express-fileupload')
const familiesRouter = require('./routes/families');
const productsRouter = require('./routes/products');
const usersRouter = require('./routes/users');
const areasRouter = require('./routes/areas');
const tokenRouter = require('./routes/token');

const app = express();

app.use(express.json());
app.use(express.text());
app.use(fileUpload());

// REST API
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Frinem",
            version: "1.0.0",
            description: "This is the REST API for Frinem",
            contact: {
                email: "amaury.derigny@gmail.com",
            },
        },
        externalDocs: {
            description: "Find out more about Swagger",
            url: "http://swagger.io",
        },
    },
    apis: ["./yaml/*.yaml", "./routes/*.js"],
};
const specs = swaggerJsdoc(options);

// Add db to the app
app.db = database;

app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use((req, res, next) => {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log("[" + req.method + "] " + fullUrl);
    next()
});

// Routes
app.use(express.static('public'))
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/families", familiesRouter);
app.use("/products", productsRouter);
app.use("/users", usersRouter);
app.use("/areas", areasRouter);
app.use("/token", tokenRouter);


app.listen(process.env.PORT, () => {
    console.log('Example app listening at http://localhost:' + process.env.PORT);
})