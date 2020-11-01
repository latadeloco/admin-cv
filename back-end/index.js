var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

const TokenGenerator = require('uuid-token-generator');
const { config } = require('process');
const token = new TokenGenerator(256, TokenGenerator.BASE62);

var configuracionMysql = {
    host: 'localhost',
    port: "3306",
    user: 'root',
    password: '',
    database: 'bd_cv_jesus_online'
}

var con = mysql.createConnection(configuracionMysql);

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride());
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    next();
});

/**
 * 
 * 
 * INICIO DE SESIÓN (USUARIO)
 * 
 * 
 */

/**
 * Petición para ver si existe usuario
 */
app.get("/usuario/existe", (req, res) => {
    con.destroy() 
    con = mysql.createConnection(configuracionMysql);
    con.connect();
    con.query("SELECT * FROM usuario", function(error, result, fields) {
        con.on('error', function(err) {
            console.log('[MYSQL]ERROR', err);
        })

        if (result && result.length) {
            res.end(JSON.stringify(result));
        } else {
            res.end(JSON.stringify([{response : 'No hay usuarios'}]));
        }
    });
});

/**
 * Petición para el usuario
 */
app.post("/usuario/crear", (req, res, otro) => {
    con == true ? con.destroy() : 
    con = mysql.createConnection(configuracionMysql);
    con.connect();
    let respuestaJson = JSON.parse(req.body.params);
    var nombreUsuario = respuestaJson.nombre;
    var email = respuestaJson.email;
    var passUsuario = respuestaJson.pass;
    
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    con.query("INSERT INTO usuario(username, pass, email, token) VALUES (?,?,?,?)",
    [
        nombreUsuario, 
        passUsuario,
        email,
        token.generate()
    ], function(error, result, fields) {
        console.log(error)
        console.log("\n")
        console.log(result)
        console.log("\n")
        console.log(fields)
        con.on('error', function(err) {
            console.log('[MYSQL]ERROR', err);
        })
        if (error == null) {
            res.end(JSON.stringify({response : 'Usuario creado correctamente.'}));
        } else {
            res.end(JSON.stringify({errResponse : 'Ha habido un problema al insertar el usuario.'}));
        }
    })
});

/**
 * Petición de comprobación de credenciales del usuario
 */
app.get("/usuario/logIn", (req, res, otro) => {
    con.query("SELECT username, pass, token FROM usuario",
    function(error, result, fields) {
        con.on('error', function(err) {
            console.log('[MYSQL]ERROR', err);
        })
        if (error == null) {
            res.end(JSON.stringify(result));
        } else {
            res.end(JSON.stringify({response : 'Se ha producido un error inesperado.'}));
        }
    })
});



/**
 * 
 * 
 * DATOS PERSONALES
 * 
 * 
 */







/**
 * 
 * 
 * ARRANCAR SERVIDOR
 * 
 * 
 */
app.listen(3500, () => {
    console.log("Running on port 3500");
})