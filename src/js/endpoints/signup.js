const app = require('../conexiones/conexion_express.js');
const sequelize = require('../conexiones/conexion_sequelize.js');

// Endpoint para registar nuevos usuarios.
app.post('/signup', async (req, res) => {
    let usuario = Object.values(req.body);
    let nombreTabla = 'usuarios';
    let tipoDeQuery = `INSERT INTO ${nombreTabla} (nickname, nombre_apellido, email, telefono, direccion_envio, contrasenna) VALUES (?,?,?,?,?,?)`;

    console.log("Body: " + usuario);

    await sequelize.query(tipoDeQuery, {replacements: usuario})
        .then(data => {
            console.log("Data log usuario: " + data);
            res.status(200).json({
                Mensaje: "Usuario creado exitosamente.",
                Data: data
            });
        })
        .catch( e => {
            console.error("Data log error usuario: " + e);
            res.status(400).json({
                Mensaje: 'El usuario no pudo ser creado.'
            });
        });            
});

//Enpoint que devuelve todos los registros de la tabla "usuarios".
app.get('/usuarios', async (req, res) => {
    let nombreTabla = 'usuarios';
    let tipoDeQuery = `SELECT * FROM ${nombreTabla}`;
    
    await sequelize.query(tipoDeQuery, {type: sequelize.QueryTypes.SELECT})
        .then(data => {
            console.log(data);
            res.status(200).json({
                Mensaje: "OK",
                Data: data,
            });
        })
        .catch( e => {
            console.error("Error del endpoint: " + e);
            res.status(408).json({
                Mensaje: 'No se pudo mostrar el usuario',
            });
        });
});