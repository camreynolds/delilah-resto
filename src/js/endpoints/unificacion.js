const app = require('../conexiones/conexion_express.js');
const sequelize = require('../conexiones/conexion_sequelize.js');
const jwt = require("jsonwebtoken");
const jwtClave = "clave";

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

// Endpoint para logear usuarios registrados.
app.post("/login", async (req, res) => {
    console.log("Proviene del Body: " + JSON.stringify(req.body));

    let nombreTabla = 'usuarios';
    let columnaNickname = 'nickname';
    let columnaEmail = 'email';
    let columnaContrasenna = "contrasenna";
    let usuarioNickname = req.body.nickname;
    let usuarioEmail = req.body.email;
    let usuarioContrasenna = req.body.contrasenna;
    let tipoDeQuery = `SELECT count(1) AS existe FROM ${nombreTabla} WHERE ( ${columnaNickname} = "${usuarioNickname}" OR ${columnaEmail} = "${usuarioEmail}" ) AND ( ${columnaContrasenna} = "${usuarioContrasenna}" )`;
    
    console.log("Variable que almacema el req.body.nickname: " + usuarioNickname);
    console.log("Variable que almacema el req.body.email: " + usuarioEmail);
    console.log("Variable que almacema el req.body.contrasenna: " + usuarioContrasenna);
    
    console.log(" **** **** **** **** **** **** **** **** **** **** **** ");
    
    await sequelize.query(tipoDeQuery, {type: sequelize.QueryTypes.SELECT})
        .then(data => {
            console.log(data[0].existe);
            let validar = data[0].existe;
            console.log("Validar: " + validar);
            if(validar === 1){
                let token = jwt.sign({usuario: usuarioNickname}, jwtClave);
                res.status(200).json({
                    Mensaje: "OK",
                    Data: data[0].existe,
                    Token: token
                });
            }else{
                res.status(400).json({
                    Mensaje: "Nombre de usuario/email o contraseña inválidos."
                });
            };
        })
        .catch( e => {
            console.error("El error es: " + e);
            res.status(400).json({
                Mensaje: "Error en la petición."
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

//Función generica de Usuario No Autorizado.
usuarioNoAutorizado = (res) => {
    res.status(401).json({Mensaje: "Usuario no autorizado."});
};

//Middleware para verificar token asignado en las rutas de los endpoints.
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

//Endpoint por registrar "productos".
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

//Endpoint para borrar productos.
app.post("/productos/borrar", async (req, res) => {
    let nombreTabla = 'productos';
    let columnaNombrePlato = 'nombre_plato';
    //let nombrePlato = req.body.nombre_plato;
    let nombrePlato = "Hamburguesa clásica";
    let tipoDeQuery = `SELECT count(1) AS existe FROM ${nombreTabla} WHERE ${columnaNombrePlato} = "${nombrePlato}"`;
    
    console.log("Nombre de la columna: " + columnaNombrePlato);
    console.log(typeof columnaNombrePlato);
    console.log("Resultado de Tipo de Query: " + tipoDeQuery);
    console.log("Este es el nombre del plato: " + nombrePlato);
  
    if(tipoDeQuery){
        //await  sequelize.query(`'DELETE FROM ${nombreTabla} WHERE ${columnaNombrePlato} = "${nombrePlato}"`)
        await  sequelize.query("DELETE FROM productos WHERE nombre_plato = ?", {replacements: [nombrePlato]})
            .then(data => {
                console.log('Data log de borrado: ' + data);
                res.status(200).json({
                    Mensaje: "Producto borrado exitosamente."
                });
            })
            .catch( e => {
                console.error("Error del endpoint de borrado: " + e);
                res.status(408).json({
                    Mensaje: "No se pudo borrar el producto."
                });
            });
        
    }else{
        res.status(400).json({Mensaje: "error de prueba."})
    };
});

// Endpoint global de errores.
app.use( (error, req, res, next)=>{
    if(error){
        console.error("Mensaje error del servidor: " + error);
        res.status(500).json({
            Mensaje: 'Error interno del servidor.'
        });
    };
    next();
});