const sequelize = require("./conexion.js");

function insertarFila(){
    let array_usuario = ["camreynolds", "Carlos Muñoz", "carlos@dominio.com", "001231234567", "calle 1 #1 norte - 1", "abc.123"];

    sequelize.query('INSERT INTO usuarios (nickname, nombre_apellido, email, telefono, direccion_envio, contrasenna) VALUES (?,?,?,?,?,?)',
        {replacements: array_usuario})
        .then(projects => console.log(projects))
        .catch(err => (console.error("No se pudieron insertar los datos! "+err)));
};

insertarFila();