require ("dotenv").config;
const express = require("express");
const server = express();

server.listen(process.env.EXPRESS_PORT, function(){
    console.log("Conexión a express establecida...");
});