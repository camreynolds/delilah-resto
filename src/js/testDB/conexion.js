require("dotenv").config();
const Sequalize = require("sequelize");
const sequelize = new Sequalize(process.env.BASE_URL);

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