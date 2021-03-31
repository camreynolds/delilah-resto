const app = require('../conexiones/conexion_express.js');
const sequelize = require('../conexiones/conexion_sequelize.js');

// Endpoint para logear usuarios registrados.
app.post("/login", async (req, res) => {
    console.log("Proviene del Body: " + JSON.stringify(req.body));

    let nombreTabla = 'usuarios';
    let nombreColumna_1 = 'nickname';
    let nombreColumna_2 = 'email';
    let usuarioNickname = req.body.nickname;
    let usuarioEmail = req.body.email;
    let tipoDeQuery = `SELECT count(1) AS existe FROM ${nombreTabla} WHERE ${nombreColumna_1} = "${usuarioNickname}" OR ${nombreColumna_2} = "${usuarioEmail}" `;
    /*
    let tipoDeQuery = `SELECT ${nombreColumna_1} FROM ${nombreTabla} WHERE ${nombreColumna_1} = "${usuarioNickname}"`;
    */
    console.log("Variable que almacema el req.body.nickname: " + usuarioNickname);
    console.log("Variable que almacema el req.body.email: " + usuarioEmail);
    
    console.log(" **** **** **** **** **** **** **** **** **** **** **** ");
    
    await sequelize.query(tipoDeQuery, {type: sequelize.QueryTypes.SELECT})
        .then(data => {
            console.log(data[0].existe);
            let validar = data[0].existe;
            console.log("Validar: " + validar);
            if(validar === 1){
                res.status(200).json({
                    Mensaje: "OK",
                    Data: data[0].existe
                });
            }else{
                res.status(400).json({
                    Mensaje: "Solicitud no procesada."
                });
            };
        })
        .catch( e => {
            console.error("El error es: " + e);
            res.status(400).json({
                Mensaje: "Error en la petición."
            });
        });
   
    /*
    ---- ESTA PARTE ESTA COMENTADA ----
    let usuarioNickname = req.body.nickname;
    let usuarioEmail = req.body.email;
    let usuarioContrasenna = req.body.contrasenna;
        
    if( (usuarioNickname === "carlos" || usuarioEmail === "carlos@dominio.com") && usuarioContrasenna === "123abc" ){
        res.status(200).json({Mensaje: "OK"});
    };
    */
    
});