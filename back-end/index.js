var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

const fs = require('fs');

const TokenGenerator = require('uuid-token-generator');
const { config } = require('process');
const token = new TokenGenerator(256, TokenGenerator.BASE62);

// Subir Archivos al servidor
const multipart = require('connect-multiparty');
const subirImagenes = multipart({
    uploadDir: './../src/assets/img',
    autoFiles: true
});

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
    con == true ? con.destroy() : 
    con = mysql.createConnection(configuracionMysql);
    con.connect();
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

app.post('/datos-personales/subirImagen', subirImagenes, (req, res) => {
    res.json({
        'message': 'Archivo subido correctamente.',
    }); 


    fs.stat('..\\src\\assets\\img\\perfil.jpg', (err, stat) => {
        if (err) {
            return
        } else {
            fs.unlink('..\\src\\assets\\img\\perfil.jpg', () => {
                switchFileImageType(req);
            });
        }
    });
    fs.stat('..\\src\\assets\\img\\perfil.png', (err, stat) => {
        if (err) {
            return
        } else {
            fs.unlink('..\\src\\assets\\img\\perfil.png', () => {
                switchFileImageType(req);
            });
        }
    });

    switchFileImageType(req);
});

function switchFileImageType(req) {
    if (req.files.imagen.type == 'image/png') {
        fs.stat('..\\src\\assets\\img\\perfil.png', (err, stast) => {
            if (err != null) {
                fs.rename(req.files.imagen.path, '..\\src\\assets\\img\\perfil.png', (err) => {
                    if (err) return;
                    console.log('Cambio de foto de perfil!');
                    });
            }
        });
    } else if (req.files.imagen.type == 'image/jpeg') {
        fs.stat('..\\src\\assets\\img\\perfil.jpg', (err, stast) => {
            if (err != null) {
                fs.rename(req.files.imagen.path, '..\\src\\assets\\img\\perfil.jpg', (err) => {
                    if (err) return;
                    console.log('Cambio de foto de perfil!');
                    });
            }
        });
    }
}

/**
 * Petición para cambiar a que tenga imagen perfil
 */
app.get("/datos-personales/tieneImagenPerfil/:updateOInsert", (req, res, otro) => {
    con == true ? con.destroy() : 
    con = mysql.createConnection(configuracionMysql);
    con.connect();
    
    var updateOInsert = req.params.updateOInsert;
    if (updateOInsert == 'true') {
        con.query("UPDATE INTO datos_personales SET imagen=true",
        function(error, result, fields) {
            con.on('error', function(err) {
                console.log('[MYSQL]ERROR', err);
            })
            if (error == null) {
                res.end(JSON.stringify({responseOK : 'Se ha cambiado el estado de imagen de perfil.'}));
            } else {
                res.end(JSON.stringify({responseKO : 'Se ha producido un error inesperado.'}));
            }
        })
    } else if (updateOInsert == 'false') {
        con.query("INSERT INTO datos_personales(nombre, apellidos, imagen) VALUES (?,?,?)", [
            '',
            '',
            true
        ],
        function(error, result, fields) {
            con.on('error', function(err) {
                console.log('[MYSQL]ERROR', err);
            })
            if (error == null) {
                res.end(JSON.stringify({responseOK : 'Se ha cambiado el estado de imagen de perfil.'}));
            } else {
                res.end(JSON.stringify({responseKO : 'Se ha producido un error inesperado.'}));
            }
        })
    } else {
        res.end(JSON.stringify({responseKO : 'Se ha producido un error en el servidor inesperado.'}))
    }
});

app.get('/datos-personales/imagenPerfil', (req, res) => {
    con == true ? con.destroy() : 
    con = mysql.createConnection(configuracionMysql);
    con.connect();

    con.query("SELECT imagen FROM datos_personales",
    function(error, result, fields) {
        con.on('error', function(err) {
            console.log('[MYSQL]ERROR', err);
        })
        if (result.length != 0) {
            fs.stat('..\\src\\assets\\img\\perfil.jpg', (err, stat) => {
                if (err != null) {
                    return
                } else {
                    res.end(JSON.stringify({
                        'perfilExiste' : true,
                        'extension' : 'jpg'
                    }));
                }
            });
            fs.stat('..\\src\\assets\\img\\perfil.png', (err, stat) => {
                if (err != null) {
                    return
                } else {
                    res.end(JSON.stringify({
                        'perfilExiste' : true,
                        'extension' : 'png'
                    }));
                }
            });
        } else {
            res.end(JSON.stringify({
                imagenNotFound : 'No se ha encontrado imagen de perfil.'
            }));
        }
    })

});

/**
 * Función para enviar todos los datos personales del usuario de la base de datos
 */
app.get("/datos-personales/ver", (req, res) => {
    con == true ? con.destroy() : 
    con = mysql.createConnection(configuracionMysql);
    con.connect();
    con.query("SELECT * FROM datos_personales" ,function(error, result, fields) {
        con.on('error', function(err) {
            console.log('[MYSQL]ERROR', err);
        })

        if (result && result.length) {
            res.end(JSON.stringify(result));
        } else {
            res.end(JSON.stringify({response : 'No hay datos personales'}));
        }
    })
});

app.post("/datos-personales/crear", (req, res) => {
    con == true ? con.destroy() : 
    con = mysql.createConnection(configuracionMysql);
    con.connect();
    var datosPersonales = req.body.params;
    con.query("INSERT INTO datos_personales(nombre, apellidos, puesto, fecha_nacimiento, telefono, email, direccion, poblacion, provincia, codigo_postal, descripcion_breve, descripcion_sobre_mi) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",
    [
        datosPersonales.nombre,
        datosPersonales.apellidos,
        datosPersonales.puesto,
        datosPersonales.nacimiento,
        datosPersonales.telefono,
        datosPersonales.email,
        datosPersonales.direccion,
        datosPersonales.poblacion,
        datosPersonales.provincia,
        datosPersonales.codigoPostal,
        datosPersonales.descripcionBreve,
        datosPersonales.descripcionSobreMi
    ]
    ,function(error, result, fields) {
        con.on('error', function(err) {
            console.log('[MYSQL]ERROR', err);
        })
        if (error == null) {
            res.end(JSON.stringify({responseOK : 'Datos Personales insertados correctamente.'}));
        } else {
            res.end(JSON.stringify({responseKO : 'Ha habido un error al insertar los datos personales.'}));
        }
    })
})

app.post("/datos-personales/actualizar", (req, res) => {
    con == true ? con.destroy() : 
    con = mysql.createConnection(configuracionMysql);
    con.connect();
    var datosPersonales = req.body.params;
    con.query("UPDATE datos_personales SET nombre=?, apellidos=?, puesto=?, fecha_nacimiento=?, telefono=?, email=?, direccion=?, poblacion=?, provincia=?, codigo_postal=?, descripcion_breve=?, descripcion_sobre_mi=?",
    [
        datosPersonales.nombre,
        datosPersonales.apellidos,
        datosPersonales.puesto,
        datosPersonales.nacimiento,
        datosPersonales.telefono,
        datosPersonales.email,
        datosPersonales.direccion,
        datosPersonales.poblacion,
        datosPersonales.provincia,
        datosPersonales.codigoPostal,
        datosPersonales.descripcionBreve,
        datosPersonales.descripcionSobreMi
    ]
    ,function(error, result, fields) {
        con.on('error', function(err) {
            console.log('[MYSQL]ERROR', err);
        })
        console.log(error)
        if (error == null) {
            res.end(JSON.stringify({responseOK : 'Datos Personales actualizados correctamente.'}));
        } else {
            res.end(JSON.stringify({responseKO : 'Ha habido un error al actualizar los datos personales.'}));
        }
    })
})

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