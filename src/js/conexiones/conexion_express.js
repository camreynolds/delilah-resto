require ("dotenv").config;
const express = require("express");
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json({limit: '10Kb'}));
app.use(logger);

app.listen(3000, function(){
    console.log("Conexión a express establecida...");
});

function logger(req, res, next){
    const {method, path, query, body} = req;
    console.log(`Método: ${method} - Ruta: ${path} - Query: ${JSON.stringify(query)} - Body: ${JSON.stringify(body)}`);
    next();
};

app.use( (error, req, res, next)=>{
    if(error){
        console.error("Mensaje error del servidor: " + error);
        res.status(500).json({
            Mensaje: 'Error interno del servidor.'
        });
    };
    next();
});

module.exports = app;