require("dotenv").config();
const Sequelize = require("sequelize");
const sequelize = new Sequelize('mysql://root@localhost:3306/delilah_resto');

sequelize.authenticate()
    .then(function(){
        console.log("Conexión a Base de Datos establecida...");
    })
    .catch(function(){
        console.error("Error en conexión...");
    })
    .finally(function(){
        sequelize.close;
    });

module.exports = sequelize;