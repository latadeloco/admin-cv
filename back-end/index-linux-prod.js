var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

const fs = require('fs');

const TokenGenerator = require('uuid-token-generator');
const token = new TokenGenerator(256, TokenGenerator.BASE62);

// Subir Archivos al servidor
const multipart = require('connect-multiparty');
const subirImagenes = multipart({
    uploadDir: './../assets/img',
    autoFiles: true
});
const subirCertificados = multipart({
    uploadDir: './../assets/certificados',
    autoFiles: true
});

const subirLogotipo = multipart({
    uploadDir: './../assets/logotipos',
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

 /**
  * Petición para subir la imagen de perfil
  * @param { imagen a subir } subirImagenes
  */
app.post('/datos-personales/subirImagen', subirImagenes, (req, res) => {
    res.json({
        'message': 'Archivo subido correctamente.',
    }); 

    con == true ? con.destroy() : 
    con = mysql.createConnection(configuracionMysql);
    con.connect();
    con.query("SELECT imagen FROM datos_personales",
    function(error, result, fields) {
        con.on('error', function(err) {
            console.log('[MYSQL]ERROR', err);
        });

        if (JSON.parse(JSON.stringify(result)) == 0) {
            con.query("INSERT INTO datos_personales(nombre, apellidos, imagen) VALUES ('','',true", function(error, result, fields) {
                con.on('error', function(err) {
                    console.log('[MYSQL]ERROR', err);
                });
            })
        } else {
            con.query("UPDATE datos_personales FROM imagen=true", function(error, result, fields) {
                con.on('error', function(err) {
                    console.log('[MYSQL]ERROR', err);
                });
            })
        }
    })

    fs.stat('../assets/img/perfil.jpg', (err, stat) => {
        if (err) {
            return
        } else {
            fs.unlink('../assets/img/perfil.jpg', () => {
                switchFileImageType(req);
            });
        }
    });
    fs.stat('../assets/img/perfil.png', (err, stat) => {
        if (err) {
            return
        } else {
            fs.unlink('../assets/img/perfil.png', () => {
                switchFileImageType(req);
            });
        }
    });

    switchFileImageType(req);
});

/**
 * Función para verificar y añadir la foto de perfil (png o jpg)
 * @param {respuesta necesaria para funcion} req 
 */
function switchFileImageType(req) {
    if (req.files.imagen.type == 'image/png') {
        fs.stat('../assets/img/perfil.png', (err, stast) => {
            if (err != null) {
                fs.rename(req.files.imagen.path, '../assets/img/perfil.png', (err) => {
                    if (err) return;
                    console.log('Cambio de foto de perfil!');
                    });
            }
        });
    } else if (req.files.imagen.type == 'image/jpeg') {
        fs.stat('../assets/img/perfil.jpg', (err, stast) => {
            if (err != null) {
                fs.rename(req.files.imagen.path, '../assets/img/perfil.jpg', (err) => {
                    if (err) return;
                    console.log('Cambio de foto de perfil!');
                    });
            }
        });
    }
}

/**
 * Petición para cambiar a que tenga imagen perfil
 * @param { actualizar o insertar un nuevo dato personal } updateOInsert
 */
app.get("/datos-personales/tieneImagenPerfil/:updateOInsert", (req, res, otro) => {
    con == true ? con.destroy() : 
    con = mysql.createConnection(configuracionMysql);
    con.connect();
    
    var updateOInsert = req.params.updateOInsert;
    if (updateOInsert == 'true') {
        con.query("SELECT id_datos_personales as id FROM datos_personales ORDER by id_datos_personales ASC LIMIT 1", function (error, result, fields) {
            var idDatosPersonales = JSON.parse(JSON.stringify(result[0]['id']));
            con.on('error', function(err) {
                console.log('[MYSQL]ERROR', err);
            });

            if (idDatosPersonales > 0) {
                con.query("UPDATE datos_personales SET imagen=true WHERE id_datos_personales = ?",[
                    idDatosPersonales
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
            }
        });
        
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

/**
 * Petición para ver que imagen de perfil actual
 */
app.get('/datos-personales/imagenPerfil', (req, res) => {
    con == true ? con.destroy() : 
    con = mysql.createConnection(configuracionMysql);
    con.connect();

    con.query("SELECT imagen FROM datos_personales",
    function(error, result, fields) {
        con.on('error', function(err) {
            console.log('[MYSQL]ERROR', err);
        })

        if (JSON.parse(JSON.stringify(result['length'])) != 0) {
            let tieneImagen = JSON.parse(JSON.stringify(result[0]['imagen']));
    
            if (tieneImagen === 1) {
                fs.stat('../assets/img/perfil.jpg', (err, stat) => {
                    if (err != null) {
                        return
                    } else {
                        res.end(JSON.stringify({
                            'perfilExiste' : true,
                            'extension' : 'jpg'
                        }));
                    }
                });
                fs.stat('../assets/img/perfil.png', (err, stat) => {
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

/**
 * Petición para crear los nuevos datos personales 
 */
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

/**
 * Petición para actualizar los datos personales
 */
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
 * FORMACIÓN
 * 
 * 
 */


 /**
  * Petición para añadir una nueva formación
  */
app.post("/formacion/add", (req, res) => {
    con == true ? con.destroy() : 
    con = mysql.createConnection(configuracionMysql);
    con.connect();
    var formacion = req.body;


    if (formacion.fechaInicio == '') {
        formacion.fechaInicio = null
    }

    if (formacion.fechaFin == '') {
        formacion.fechaFin = null
    }

    con.query("INSERT INTO formacion(nombre_titulacion, nombre_institucion, fecha_inicio, fecha_fin, certificacion, descripcion_formacion) VALUES(?,?,?,?,?,?)",
    [
        formacion.nombreTitulacion,
        formacion.nombreInstitucion,
        formacion.fechaInicio,
        formacion.fechaFin,
        formacion.certificacion,
        formacion.descripcion
    ]
    ,function(error, result, fields) {
        con.on('error', function(err) {
            console.log('[MYSQL]ERROR', err);
        })
        if (error == null) {
            res.end(JSON.stringify({responseOK : 'Formación añadida.'}));
        } else {
            res.end(JSON.stringify({responseKO : 'Ha habido un error al insertar la formación actual.'}));
        }
    })
})

/**
  * Petición para actualizar la formacion
  */
 app.post("/formacion/update/:idFormacion", subirCertificados ,(req, res) => {
    con == true ? con.destroy() : 
    con = mysql.createConnection(configuracionMysql);
    con.connect();
    var formacion = req.body;
    var idFormacion = req.params.idFormacion;

    if (formacion.fechaInicio == '') {
        formacion.fechaInicio = null
    }

    if (formacion.fechaFin == '') {
        formacion.fechaFin = null
    }

    if (formacion.certificacion == 0) {
        formacion.certificacion = false
    }

    con.query("UPDATE formacion SET nombre_titulacion = ?, nombre_institucion = ?, fecha_inicio = ?, fecha_fin = ?, certificacion = ?, descripcion_formacion = ? WHERE id_formacion = ?",
    [
        formacion.nombreTitulacion,
        formacion.nombreInstitucion,
        formacion.fechaInicio,
        formacion.fechaFin,
        formacion.certificacion,
        formacion.descripcion,
        idFormacion
    ]
    ,function(error, result, fields) {
        con.on('error', function(err) {
            console.log('[MYSQL]ERROR', err);
        })

        /*if (formacion.certificacion == true || formacion.certificacion == 1) {
            console.log(req.files)

            fs.stat('../assets/certificados/' + idFormacion + '.pdf', (err, stat) => {
                if (err) {
                    return
                } else {
                    fs.unlink('../assets/certificados/' + idFormacion + '.pdf', () => {
                        switchFileCertificate(req, idFormacion);
                    });
                }
            });
    
            switchFileCertificate(req, idFormacion);
        }*/
        

        if (error == null) {
            res.end(JSON.stringify({responseOK : 'Formación actualizada.'}));
        } else {
            res.end(JSON.stringify({responseKO : 'Ha habido un error al actualizar la formación actual.'}));
        }
    })
})


/**
 * Petición para subir un certificado al añadir una nueva formación
 */
app.post("/formacion/subirCertificado", subirCertificados, (req, res) => {
    con == true ? con.destroy() : 
    con = mysql.createConnection(configuracionMysql);
    con.connect();
    con.query("SELECT id_formacion as id FROM formacion ORDER by id_formacion DESC LIMIT 1" ,function(error, result, fields) {
        con.on('error', function(err) {
            console.log('[MYSQL]ERROR', err);
        }) 

        var id = result.length == 0 ? 1 : (JSON.parse(JSON.stringify(result))[0]['id']);

        fs.stat('../assets/certificados/' + id + '.pdf', (err, stat) => {
            if (err) {
                return
            } else {
                fs.unlink('../assets/certificados/' + id + '.pdf', () => {
                    switchFileCertificate(req, id);
                });
            }
        });
    
        switchFileCertificate(req, id);
    })
});

/**
 * Petición para subir un certificado con una formación existente
 * @param { parámetro para recoger la formación existente para subir el certificado } idFormacion
 */
app.post("/formacion/subirCertificadoConFormacionExistente/:idFormacion", subirCertificados, (req, res) => {
    con == true ? con.destroy() : 
    con = mysql.createConnection(configuracionMysql);
    con.connect();

    var idFormacion = req.params.idFormacion;
    con.query("UPDATE formacion SET certificacion=true WHERE id_formacion = ?", 
    [
        idFormacion
    ] ,function(error, result, fields) {
        con.on('error', function(err) {
            console.log('[MYSQL]ERROR', err);
        }) 
        if (error == null) {
            fs.stat('../assets/certificados/' + idFormacion + '.pdf', (err, stat) => {
                if (err) {
                    return
                } else {
                    fs.unlink('../assets/certificados/' + idFormacion + '.pdf', () => {
                        switchFileCertificate(req, idFormacion);
                    });
                }
            });
            switchFileCertificate(req, idFormacion);
            res.json({
                'responseKO' : 'certificado subido correctamente.'
            });
        } else {
            res.json({
                'responseKO' : 'El certificado no se ha podido subir.'
            });
        }
    })
});

/**
 * Función para comprobar y añadir los documentos PDF de las formaciones
 * @param {respuesta necesaria para funcion} req 
 */
function switchFileCertificate(req, id) {
    if (req.files.certificado.type == 'application/pdf') {
        fs.stat('../assets/certificados/' + id + '.pdf', (err, stast) => {
            if (err != null) {
                fs.rename(req.files.certificado.path, '../assets/certificados/' + id + '.pdf', (err) => {
                    if (err) return;
                    console.log('Añadido certificado!');
                    });
            }
        });
    }
}

/**
 * Petición para ver todas las formaciones
 */
app.get("/formacion/viewAll", (req, res) => {
    con == true ? con.destroy() : 
    con = mysql.createConnection(configuracionMysql);
    con.connect();
    con.query("SELECT * FROM formacion ORDER BY id_formacion" ,function(error, result, fields) {
        con.on('error', function(err) {
            console.log('[MYSQL]ERROR', err);
        })

        res.end(JSON.stringify(result));
    })
});

/**
 * Petición para ver todas las formaciones
 */
app.get("/formacion/view/:id", (req, res) => {
    con == true ? con.destroy() : 
    con = mysql.createConnection(configuracionMysql);
    con.connect();
    var idFormacion = req.params.id;

    con.query("SELECT * FROM formacion WHERE id_formacion = ?", [ idFormacion ] ,function(error, result, fields) {
        con.on('error', function(err) {
            console.log('[MYSQL]ERROR', err);
        })
        if (error == null) {
            console.log(result)
            res.end(JSON.stringify(result));
        } else {
            res.end(JSON.stringify({
                "responseKO" : 'Formación no encontrada.'
            }))
        }
    })
});

/**
 * Petición de eliminación de certificado
 */
app.post("/formacion/removeCertificate", (req, res) => {
    con == true ? con.destroy() : 
    con = mysql.createConnection(configuracionMysql);
    con.connect();
    var removeCertificate = req.body.certificado;
    con.query("UPDATE formacion SET certificacion=false WHERE id_formacion = " + removeCertificate ,function(error, result, fields) {
        con.on('error', function(err) {
            console.log('[MYSQL]ERROR', err);
        })

        fs.stat('../assets/certificados/' + removeCertificate + '.pdf', (err, stat) => {
            if (err) {
                res.json({
                    responseKO: 'El certificado que intenta eliminar no existe.',
                }); 
                return
            } else {
                fs.unlink('../assets/certificados/' + removeCertificate + '.pdf', () => {
                    res.json({
                        responseOK: 'Certificado eliminado correctamente.',
                    }); 
                });
            }
        });
    })
});

/**
 * Petición para eliminar una formación existente por el id
 * @param { campo que recoge la formación a eliminar } id
 */
app.get("/formacion/removeFormacion/:id", (req, res) => {
    con == true ? con.destroy() : 
    con = mysql.createConnection(configuracionMysql);
    con.connect();
    var idFormacion = req.params.id;
    con.query("DELETE FROM formacion WHERE id_formacion = ?",  idFormacion ,function(error, result, fields) {
        con.on('error', function(err) {
            console.log('[MYSQL]ERROR', err);
        })

        if (error == null) {
            res.json({
                'responseOK' : 'Formación eliminada correctamente.'
            });
        } else {
            res.json({
                'responseKO' : 'No se ha podido eliminar la formación.'
            });
        }
    })
});

/**
 * 
 * 
 * 
 * EXPERIENCIAS LABORALES
 * 
 * 
 * 
 */

/**
 * Petición para ver todas las experiencias laborales
 */
app.get("/experiencias-laborales/viewAll", (req, res) => {
    con == true ? con.destroy() : 
    con = mysql.createConnection(configuracionMysql);
    con.connect();
    con.query("SELECT * FROM experiencia_laboral ORDER BY id_experiencia_laboral" ,function(error, result, fields) {
        con.on('error', function(err) {
            console.log('[MYSQL]ERROR', err);
        })
        
        res.end(JSON.stringify(result));
    })
});

 /**
  * Petición para subir el logotipo de la empresa
  * @param { imagen a subir } subirImagenes
  */
 app.post('/experiencias-laborales/subirLogotipo', subirLogotipo, (req, res) => {
    con == true ? con.destroy() : 
    con = mysql.createConnection(configuracionMysql);
    con.connect();

    con.query("SELECT id_experiencia_laboral as id FROM experiencia_laboral ORDER by id_experiencia_laboral DESC LIMIT 1" ,function(error, result, fields) {
        con.on('error', function(err) {
            console.log('[MYSQL]ERROR', err);
        }) 

        var id = result.length == 0 ? 1 : (JSON.parse(JSON.stringify(result))[0]['id']);

        if (error == null) {
            switchFileLogo(req, id);
            res.json({
                'responseOK' : 'Logotipo subido correctamente'
            })
        } else {
            res.json({
                'responseKO' : 'Ha habido un error al subir el logotipo'
            })
        }
    })
});

/**
 * Petición para updatear el logo de la empresa dada
 * @param { FormData, objeto file con todas las propiedades del logotipo } subirLogotipo
 */
app.post('/experiencias-laborales/updateSubirLogotipo', subirLogotipo, (req, res) => {
    con == true ? con.destroy() : 
    con = mysql.createConnection(configuracionMysql);
    con.connect();

    var id = req.query.idExperienciaLaboral;
    var extension;

    if (extensionFileLogo(req) !== null) {
        if (extensionFileLogo(req) == 'jpg') {
            extension = extensionFileLogo(req);
        } else if (extensionFileLogo(req) == 'png') {
            extension = extensionFileLogo(req);
        }
    } else {
        res.json({
            'responseKO' : 'El tipo de imagen no se reconoce.'
        })
        return;
    }

    fs.unlink('../assets/logotipos/'+ id +'.png', function(err) {
        if (err != null) {
            console.log("no existe")
        }
    });
    fs.unlink('../assets/logotipos/'+ id +'.jpg', function(err) {
        if (err != null) {
            console.log("no existe")
        }
    });

    con.query("SELECT logo_empresa, logo_url, url_logo FROM experiencia_laboral WHERE id_experiencia_laboral = " + id, function(error, result, fields) {
        con.on('error', function(err) {
            console.log('[MYSQL]ERROR', err);
        }) 

        con.query("UPDATE experiencia_laboral SET logo_empresa=true, logo_url=0, url_logo='."+extension+"' WHERE id_experiencia_laboral = " + id ,function(error, result, fields) {
            con.on('error', function(err) {
                console.log('[MYSQL]ERROR', err);
            }) 

            updateSwitchFileLogo(req, id);
            
            if (error == null) {
                res.json({
                    'responseOK' : 'Logotipo subido correctamente'
                })
            } else {
                res.json({
                    'responseKO' : 'Ha habido un error al subir el logotipo'
                })
            }
        })
    });
    
});

/**
 * Función que devuelve el tipo de extensión del archivo si se sube desde local
 * @param { argumento que se usa para conseguir las propiedades del logotipo } req 
 */
function extensionFileLogo(req) {
    if (req.files.logotipo.type == 'image/jpeg') {
        return "jpg";
    } else if (req.files.logotipo.type == 'image/png') {
        return "png";
    }
    return null;
}

/**
 * Función para updatear el logotipo de la empresa recogida por id
 * @param { argumento para recoger propiedades de la imagen local } req 
 * @param { argumento que se usa de identificador para renombrar el archivo } id 
 */
function updateSwitchFileLogo(req, id) {
    if (req.files.logotipo.type == 'image/png') {
        fs.rename(req.files.logotipo.path, '../assets/logotipos/'+ id +'.png', (err) => {
            if (err) return;
            console.log('¡Subido logotipo PNG!');
        });
    } else if (req.files.logotipo.type == 'image/jpeg') {
        fs.rename(req.files.logotipo.path, '../assets/logotipos/'+ id +'.jpg', (err) => {
            if (err) return;
            console.log('¡Subido logotipo JPG!');
        });
    }
}

/**
 * Función para ver el tipo de imagen y renombrarla
 * @param { argumento para recoger propiedades de la imagen local } req 
 * @param { argumento que se usa de identificador para renombrar el archivo } id 
 */
function switchFileLogo(req, id) {
    if (req.files.logotipo.type == 'image/png') {
        fs.stat('../assets/logotipos/'+ id +'.png', (err, stast) => {
            if (err != null) {
                fs.rename(req.files.logotipo.path, '../assets/logotipos/'+ id +'.png', (err) => {
                    if (err) return;
                    console.log('¡Subido logotipo PNG!');

                    con.query("UPDATE experiencia_laboral SET logo_empresa=true, logo_url=false, url_logo='.png' WHERE id_experiencia_laboral="+id),function(error, result, fields) {
                        con.on('error', function(err) {
                            console.log('[MYSQL]ERROR', err);
                        }) 
                    }
                });
            }
        });
    } else if (req.files.logotipo.type == 'image/jpeg') {
        fs.stat('../assets/logotipos/'+ id +'.jpg', (err, stast) => {
            if (err != null) {
                fs.rename(req.files.logotipo.path, '../assets/logotipos/'+ id +'.jpg', (err) => {
                    if (err) return;
                    console.log('¡Subido logotipo JPG!');

                    con.query("UPDATE experiencia_laboral SET logo_empresa=true, logo_url=false, url_logo='.jpg' WHERE id_experiencia_laboral="+id),function(error, result, fields) {
                        con.on('error', function(err) {
                            console.log('[MYSQL]ERROR', err);
                        }) 
                    }
                    });
            }
        });
    }
}

/**
 * Petición para añadir una nueva experiencia laboral
 */
 app.post("/experiencias-laborales/add", (req, res) => {
    con == true ? con.destroy() : 
    con = mysql.createConnection(configuracionMysql);
    con.connect();
    var experienciaLaboral = req.body;


    if (experienciaLaboral.fechaInicio == '') {
        experienciaLaboral.fechaInicio = null
    }

    if (experienciaLaboral.fechaFin == '') {
        experienciaLaboral.fechaFin = null
    }


    con.query("INSERT INTO experiencia_laboral(empresa, puesto, funciones_puesto, fecha_inicio, fecha_fin, observaciones, cronologia) VALUES(?,?,?,?,?,?,?)",
    [
        experienciaLaboral.nombreEmpresa,
        experienciaLaboral.nombrePuesto,
        experienciaLaboral.funcionesPuesto,
        experienciaLaboral.fechaInicio,
        experienciaLaboral.fechaFin,
        experienciaLaboral.observaciones,
        experienciaLaboral.cronologia
        
    ]
    ,function(error, result, fields) {
        con.on('error', function(err) {
            console.log('[MYSQL]ERROR', err);
        })
        if (error == null) {
            res.end(JSON.stringify({responseOK : 'Experiencia Laboral añadida.'}));
        } else {
            res.end(JSON.stringify({responseKO : 'Ha habido un error al insertar la experiencia laboral.'}));
        }
    })
})

/**
 * Petición para añadir una imagen por URL
 */
app.post('/experiencias-laborales/addImageURL/', (req, res) => {
    con == true ? con.destroy() : 
    con = mysql.createConnection(configuracionMysql);
    con.connect();
    con.query("SELECT id_experiencia_laboral as id, url_logo as url_logo FROM experiencia_laboral ORDER by id_experiencia_laboral DESC LIMIT 1" ,function(error, result, fields) {
        con.on('error', function(err) {
            console.log('[MYSQL]ERROR', err);
        }) 
        var id = result.length == 0 ? 1 : (JSON.parse(JSON.stringify(result))[0]['id']);
        var url = req.body.params.protocolo +"//"+ req.body.params.host + req.body.params.path;

        if (error == null) {
            downloadAndUPloadImgUrl(url, id);
            res.json({
                'responseOK' : 'Imagen subida correctamente.'
            })
        } else {
            res.json({
                'responseKO' : 'Ha habido un error.'
            })
        }
        
    })
});

/**
 * Petición para updatear una imagen por URL
 */
app.post('/experiencias-laborales/updateImageURL/', (req, res) => {
    con == true ? con.destroy() : 
    con = mysql.createConnection(configuracionMysql);
    con.connect();
    
    var idExperienciaLaboral = req.body.params.idExperienciaLaboral;
    var url = req.body.params.protocolo +"//"+ req.body.params.host + req.body.params.path;

    fs.unlink('../assets/logotipos/'+ idExperienciaLaboral +'.png', function(err) {
        if (err != null) {
            console.log("no existe")
        }
    });
    fs.unlink('../assets/logotipos/'+ idExperienciaLaboral +'.jpg', function(err) {
        if (err != null) {
            console.log("no existe")
        }
    });

    con.query("UPDATE experiencia_laboral SET logo_empresa=true, logo_url=true, url_logo='" + url + "' WHERE id_experiencia_laboral = " + idExperienciaLaboral ,function(error, result, fields) {
        con.on('error', function(err) {
            console.log('[MYSQL]ERROR', err);
        }) 
        if (error == null) {
            res.json({
                'responseOK' : 'Imagen subida correctamente.'
            })
        } else {
            res.json({
                'responseKO' : 'Ha habido un error.'
            })
        }
        
    })
});

/**
 * Función para recoger la URL e insertarla en la ID especificada
 * @param { objeto JSON con propiedades con todo el path completo } url 
 * @param { identificador de la experiencia laboral } id 
 */
function downloadAndUPloadImgUrl(url, id) {
    
    con.query("UPDATE experiencia_laboral SET logo_empresa=true, logo_url=true, url_logo='"+url+"' WHERE id_experiencia_laboral="+id),function(error, result, fields) {
        con.on('error', function(err) {
            console.log('[MYSQL]ERROR', err);
        })
    }
}

/**
 * Petición para eliminar la experiencia laboral dada
 */
app.post("/experiencias-laborales/removeExperienciaLaboral", (req, res) => {
    con == true ? con.destroy() : 
    con = mysql.createConnection(configuracionMysql);
    con.connect();
    var idExperienciaLaboral = req.body.params;
    con.query("SELECT logo_empresa, url_logo FROM experiencia_laboral WHERE id_experiencia_laboral = " + idExperienciaLaboral, function(error, result, fields) {
        con.on('error', function(err) {
            console.log('[MYSQL]ERROR', err);
        })
        var extension = JSON.parse(JSON.stringify(result[0]['url_logo']));
        var tieneLogo = JSON.parse(JSON.stringify(result[0]['logo_empresa']));
        
        if (tieneLogo === 1) {
            fs.stat('../assets/logotipos/' + idExperienciaLaboral + extension, (err, stat) => {
                if (err) {
                    return
                } else {
                    fs.unlink('../assets/logotipos/' + idExperienciaLaboral + extension, () => {
                    });
                }
            });
        }
        con.query("DELETE FROM experiencia_laboral WHERE id_experiencia_laboral = " + idExperienciaLaboral ,function(error, result, fields) {
            con.on('error', function(err) {
                console.log('[MYSQL]ERROR', err);
            })
    
            if (error == null) {
                res.json({
                    'responseOK' : 'Experiencia laboral eliminada'
                })
            } else {
                res.json({
                    'responseKO' : 'No se ha podido eliminar la experiencia laboral'
                })
            }
        })

    });
});

/**
 * Petición para ver una experiencia laboral en concreto por id
 */
app.get("/experiencias-laborales/view/:id", (req, res) => {
    con == true ? con.destroy() : 
    con = mysql.createConnection(configuracionMysql);
    con.connect();
    
    var idExperienciaLaboral = req.params.id;
    con.query("SELECT * FROM experiencia_laboral WHERE id_experiencia_laboral = ?", [
        idExperienciaLaboral
    ] ,function(error, result, fields) {
        con.on('error', function(err) {
            console.log('[MYSQL]ERROR', err);
        })
        
        res.end(JSON.stringify(result));
    })
});

/**
 * Petición que updatea la experiencia laboral con los campos dados
 */
app.post("/experiencias-laborales/update/", (req, res) => {
    con == true ? con.destroy() : 
    con = mysql.createConnection(configuracionMysql);
    con.connect();

    var experienciaLaboral = req.body.params.experienciaLaboral;
    var idExperienciaLaboral = req.body.params.idExperienciaLaboral;

    if (experienciaLaboral.fechaInicio == '') {
        experienciaLaboral.fechaInicio = null
    }

    if (experienciaLaboral.fechaFin == '') {
        experienciaLaboral.fechaFin = null
    }

    console.log(experienciaLaboral)

    con.query("UPDATE experiencia_laboral SET empresa=?, puesto=?, funciones_puesto=?, fecha_inicio=?, fecha_fin=?, observaciones=?, cronologia=? WHERE id_experiencia_laboral=?",
    [
        experienciaLaboral.nombreEmpresa,
        experienciaLaboral.nombrePuesto,
        experienciaLaboral.funcionesPuesto,
        experienciaLaboral.fechaInicio,
        experienciaLaboral.fechaFin,
        experienciaLaboral.observaciones,
        experienciaLaboral.cronologia,
        idExperienciaLaboral
    ]
    ,function(error, result, fields) {
        con.on('error', function(err) {
            console.log('[MYSQL]ERROR', err);
        })
        if (error == null) {
            res.end(JSON.stringify({responseOK : 'Experiencia laboral añadida.'}));
        } else {
            res.end(JSON.stringify({responseKO : 'Ha habido un error al insertar la experiencia laboral actual.'}));
        }
    })
})

/**
 * 
 * 
 * 
 * OBJETIVOS PROFESIONALES
 * 
 * 
 * 
 */

 /**
  * Petición para añadir un objetivo profesional
  */
app.post("/objetivo-profesional/add", (req, res) => {
    con == true ? con.destroy() : 
    con = mysql.createConnection(configuracionMysql);
    con.connect();
    var objetivoProfesional = req.body;
    con.query("INSERT INTO objetivos_profesionales(objetivo_profesional) VALUES(?)",
    [
        objetivoProfesional.objetivoProfesional,
    ]
    ,function(error, result, fields) {
        con.on('error', function(err) {
            console.log('[MYSQL]ERROR', err);
        })
        if (error == null) {
            res.end(JSON.stringify({responseOK : 'Objetivo Profesional añadido correctamente.'}));
        } else {
            res.end(JSON.stringify({responseKO : 'Ha habido un error al insertar el objetivo profesional.'}));
        }
    })
})

 /**
  * Petición para ver todos los objetivos profesionales
  */
app.get("/objetivo-profesional/viewAll", (req, res) => {
    con == true ? con.destroy() : 
    con = mysql.createConnection(configuracionMysql);
    con.connect();
    con.query("SELECT * FROM objetivos_profesionales ORDER BY objetivo_profesional" ,function(error, result, fields) {
        con.on('error', function(err) {
            console.log('[MYSQL]ERROR', err);
        })

        res.end(JSON.stringify(result));
    })
});

 /**
  * Petición para ver un objetivo profesional por ID
  */
app.get("/objetivo-profesional/view/:id", (req, res) => {
    con == true ? con.destroy() : 
    con = mysql.createConnection(configuracionMysql);
    con.connect();
    var idObjetivoProfesional = req.params.id;

    con.query("SELECT * FROM objetivos_profesionales WHERE id_objetivos_profesionales = ?", [ idObjetivoProfesional ] ,function(error, result, fields) {
        con.on('error', function(err) {
            console.log('[MYSQL]ERROR', err);
        })
        if (error == null) {
            res.end(JSON.stringify(result));
        } else {
            res.end(JSON.stringify({
                "responseKO" : 'Formación no encontrada.'
            }))
        }
    })
});

 /**
  * Petición para actualizar un objetivo profesional
  */
app.post("/objetivo-profesional/update" ,(req, res) => {
    con == true ? con.destroy() : 
    con = mysql.createConnection(configuracionMysql);
    con.connect();
    var objetivoProfesional = req.body.params.objetivoProfesional.objetivoProfesional;
    var idObjetivoProfesional = req.body.params.idObjetivoProfesional;

    con.query("UPDATE objetivos_profesionales SET objetivo_profesional = ? WHERE id_objetivos_profesionales = ?",
    [
        objetivoProfesional,
        idObjetivoProfesional
    ]
    ,function(error, result, fields) {
        con.on('error', function(err) {
            console.log('[MYSQL]ERROR', err);
        })

        if (error == null) {
            res.end(JSON.stringify({responseOK : 'Objetivo profesional actualizado.'}));
        } else {
            res.end(JSON.stringify({responseKO : 'Ha habido un error al actualizar el objetivo profesional.'}));
        }
    })
})

 /**
  * Petición para eliminar un objetivo profesional
  */
app.post("/objetivo-profesional/remove" ,(req, res) => {
    con == true ? con.destroy() : 
    con = mysql.createConnection(configuracionMysql);
    con.connect();

    var idObjetivoProfesional = req.body.params.idObjetivoProfesional;

    con.query("DELETE FROM objetivos_profesionales WHERE id_objetivos_profesionales = ?",
    [
        idObjetivoProfesional
    ]
    ,function(error, result, fields) {
        con.on('error', function(err) {
            console.log('[MYSQL]ERROR', err);
        })

        if (error == null) {
            res.end(JSON.stringify({responseOK : 'Objetivo profesional eliminado.'}));
        } else {
            res.end(JSON.stringify({responseKO : 'Ha habido un error al eliminar el objetivo profesional.'}));
        }
    })
})

/**
 * 
 * 
 * 
 * SKILLS
 * 
 * 
 * 
 */

  /**
  * Petición para añadir un tipo de skill
  */
app.post("/skills/addTipoSkill", (req, res) => {
    con == true ? con.destroy() : 
    con = mysql.createConnection(configuracionMysql);
    con.connect();
    var tipoSkill = req.body.nombreTipoSkill;
    con.query("INSERT INTO tipo_skills(tipo_skill) VALUES(?)",
    [
        tipoSkill,
    ]
    ,function(error, result, fields) {
        con.on('error', function(err) {
            console.log('[MYSQL]ERROR', err);
        })
        if (error == null) {
            res.end(JSON.stringify({responseOK : 'Tipo de Skill añadida correctamente.'}));
        } else {
            res.end(JSON.stringify({responseKO : 'Ha habido un error al insertar el tipo de skill.'}));
        }
    })
})

 /**
  * Petición para añadir una skill
  */
app.post("/skills/addSkill", (req, res) => {
    con == true ? con.destroy() : 
    con = mysql.createConnection(configuracionMysql);
    con.connect();
    var tipoSkill = req.body.tipoSkill;
    var nombreSkill = req.body.nombreSkill;
    var descripcionSkill = req.body.descripcionSkill;
    con.query("INSERT INTO skills(nombre_skill, descripcion, tipo_skill) VALUES(?,?,?)",
    [
        nombreSkill,
        descripcionSkill,
        tipoSkill
    ]
    ,function(error, result, fields) {
        con.on('error', function(err) {
            console.log('[MYSQL]ERROR', err);
        })
        if (error == null) {
            res.end(JSON.stringify({responseOK : 'Skill añadida correctamente.'}));
        } else {
            res.end(JSON.stringify({responseKO : 'Ha habido un error al insertar la skill.'}));
        }
    })
})

 /**
  * Petición para ver todos los tipos de skills
  */
app.get("/skills/viewAllTiposSkill", (req, res) => {
    con == true ? con.destroy() : 
    con = mysql.createConnection(configuracionMysql);
    con.connect();
    con.query("SELECT * FROM tipo_skills"
    ,function(error, result, fields) {
        con.on('error', function(err) {
            console.log('[MYSQL]ERROR', err);
        })
        if (error == null) {
            res.end(JSON.stringify(result));
        } else {
            res.end(JSON.stringify({responseKO : 'Ha habido un error al intentar extraer la información.'}));
        }
    })
})

 /**
  * Petición para ver todas las skills
  */
app.get("/skills/viewAllSkills", (req, res) => {
    con == true ? con.destroy() : 
    con = mysql.createConnection(configuracionMysql);
    con.connect();
    con.query("SELECT skills.id_skills as id_skills, skills.nombre_skill as nombre_skill, tipo_skills.tipo_skill as tipo_skill FROM skills, tipo_skills WHERE skills.tipo_skill = tipo_skills.id_tipo_skills"
    ,function(error, result, fields) {
        con.on('error', function(err) {
            console.log('[MYSQL]ERROR', err);
        })
        if (error == null) {
            res.end(JSON.stringify(result));
        } else {
            res.end(JSON.stringify({responseKO : 'Ha habido un error al insertar extraer la información.'}));
        }
    })
})

 /**
  * Petición para actualizar una skill
  */
app.post("/skills/update", (req, res) => {
    con == true ? con.destroy() : 
    con = mysql.createConnection(configuracionMysql);
    con.connect();

    var nombreSkill = req.body.params.skill.nombreSkill;
    var descripcionSkill = req.body.params.skill.descripcionSkill;
    var tipoSkill = req.body.params.skill.tipoSkill;
    var idSkill = req.body.params.idSkill;

    con.query("UPDATE skills SET nombre_skill=?, descripcion=?, tipo_skill=? WHERE id_skills = ?", 
    [
        nombreSkill,
        descripcionSkill,
        tipoSkill,
        idSkill
    ]
    ,function(error, result, fields) {
        con.on('error', function(err) {
            console.log('[MYSQL]ERROR', err);
        })
        if (error == null) {
            res.end(JSON.stringify({responseOK : 'La skill se ha actualizado correctamente.'}));
        } else {
            res.end(JSON.stringify({responseKO : 'Ha habido un error al insertar actualizar la información.'}));
        }
    })
})

 /**
  * Petición para ver una skill
  */
app.get("/skills/view/:id", (req, res) => {
    con == true ? con.destroy() : 
    con = mysql.createConnection(configuracionMysql);
    con.connect();

    var idSkill = req.params.id;

    con.query("SELECT * FROM skills WHERE id_skills = ?", [idSkill]
    ,function(error, result, fields) {
        con.on('error', function(err) {
            console.log('[MYSQL]ERROR', err);
        })
        if (error == null) {
            res.end(JSON.stringify(result));
        } else {
            res.end(JSON.stringify({responseKO : 'Ha habido un error al insertar extraer la información.'}));
        }
    })
})

 /**
  * Petición para eliminar una skill
  */
app.post("/skills/delete", (req, res) => {
    con == true ? con.destroy() : 
    con = mysql.createConnection(configuracionMysql);
    con.connect();

    var idSkill = req.body.params.idSkill;
    con.query("DELETE FROM skills WHERE id_skills = ?", [idSkill]
    ,function(error, result, fields) {
        con.on('error', function(err) {
            console.log('[MYSQL]ERROR', err);
        })
        if (error == null) {
            res.end(JSON.stringify({responseOK : 'La skill se ha eliminado correctamente.'}));
        } else {
            res.end(JSON.stringify({responseKO : 'Ha habido un error al intentar eliminar la información.'}));
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