const app = require('../conexiones/conexion_express.js');
const sequelize = require('../conexiones/conexion_sequelize.js');

app.get('/usuarios', async (req, res) => {
    
    await sequelize.query('SELECT * FROM usuarios', {type: sequelize.QueryTypes.SELECT})
        .then(data => {
            console.log(data);
            res.status(200).json({
                Mensaje: "OK",
                Data: data,
            });
        })
        .catch( e => {
            console.error("Error del endpoint: " + e);
            res.status(418).json({
                Mensaje: 'No se pudo mostrar el usuario',
            });
        });
});

app.post('/usuarios', async (req, res) => {
    let usuario = Object.values(req.body);
    console.log("Body: " + usuario);

    await sequelize.query('INSERT INTO usuarios (nickname, nombre_apellido, email, telefono, direccion_envio, contrasenna) VALUES (?,?,?,?,?,?)', 
        {replacements: usuario})
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