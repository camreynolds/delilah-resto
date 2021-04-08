const app = require('../conexiones/conexion_express.js');
const sequelize = require('../conexiones/conexion_sequelize.js');
const jwt = require("jsonwebtoken");
const jwtClave = "clave";

usuarioNoAutorizado = (res) => {
    res.status(401).json({Mensaje: "Usuario no autorizado."});
};

verificarToken = (req, res, next) => {
    let token = req.headers.authorization;
    console.log(token);
    if(token){
        token = token.split(" ")[1];
        let decodificado = jwt.verify(token, jwtClave);
        console.log(decodificado);
        if(!decodificado){
            usuarioNoAutorizado(res);
        };
        next();
    }else{
        usuarioNoAutorizado(res);
    };
};

app.post("/productos", verificarToken, (req, res) => {
    let producto = Object.values(req.body);
    let nombreTabla = 'productos';
    let tipoDeQuery = `INSERT INTO ${nombreTabla} (nombre_plato, precio_plato) VALUES (?,?)`;

    console.log('Body: ' + producto);

    sequelize.query(tipoDeQuery, {replacements: producto})
        .then(data => {
            console.log('Data log producto: ' + data);
            res.status(200).json({
                Mensaje: "Plato creado exitosamente.",
                Data: producto,
            });
        })
        .catch( e => {
            console.error('Data log error producto: ' + e);
            res.status(400).json({
                Mensaje: 'El plato no pudo ser creado.'
            });
        });
});

app.use( (error, req, res, next)=>{
    if(error){
        console.error("Mensaje error del servidor: " + error);
        res.status(500).json({
            Mensaje: 'Error interno del servidor.'
        });
    };
    next();
});