# AdminCv

Proyecto de administración del panel de CV, hecho con AngujarJS

## Pre-requisitos

Tener instalado: npm.

`sudo apt install npm`

Instalación de: AngujarJS, NodeJS, TypeScript, MYSQL como BD (opcional Apache)

AngularJS: `npm install -g @angular/cli`

NodeJS: `sudo apt install nodejs`

TypeScript: `npm install -g typescript`


(Configuración de MYSQL para Ubuntu 20.04 [AQUÍ](https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-20-04-es "Configuración MYSQL").)



MYSQL: `sudo apt install mysql-server`

(opcional)
Apache: `sudo apt install apache2`

## Pre-requisitos con el usuario de la base de datos a la hora de desplegarlo en producción

Antes de desplegar la App en producción, en MySQL tendremos que crear un usuario específico para la App del back-end que está implementada con NodeJS.

Para ello se deja la siguiente traza de código:

``` 
CREATE USER 'usuario-back-end-node'@'%' IDENTIFIED BY 'password';
GRANT ALL ON base_datos_cv.* TO 'usuario-back-end-node'@'%';
FLUSH PRIVILEGES;
```

Posteriormente, se tendrá que poner la nueva configuración en el archivo **index.js** en la ruta ***back-end***.

## Aspectos a tener en cuenta

El proyecto se abrirá en un subdirectorio, en este caso en dominio.com/admin-cv, para cambiar esta regla tendremos que quitar de *angular.json* el parámetro `"baseHref": "/admin-cv/"`.

