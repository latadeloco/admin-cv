DROP TABLE IF EXISTS datos_personales;
DROP TABLE IF EXISTS formacion;
DROP TABLE IF EXISTS experiencia_laboral;
DROP TABLE IF EXISTS objetivos_profesionales;
DROP TABLE IF EXISTS tipo_skills;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS proyectos;

CREATE TABLE datos_personales(
    `id_datos_personales` int(50) not null primary key auto_increment
  , `nombre` varchar(50) not null
  , `apellidos` varchar (60) not null
  , `fecha_nacimiento` date
  , `telefono` varchar(12)
  , `email` varchar(100)
  , `direccion` varchar(100)
  , `poblacion` varchar(50)
  , `provincia` varchar(20)
  , `codigo_postal` int(10)
  , `descripcion_breve` text
  , `descripcion_sobre_mi` text
  , `imagen` text
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE formacion(
    `id_formacion` int (50) not null primary key auto_increment
  , `nombre_titulacion` varchar(100) not null
  , `nombre_institucion` varchar(100)
  , `fecha_inicio` date
  , `fecha_fin` date
  , `certificacion` boolean not null default false 
  , `descripcion_formacion` text
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE experiencia_laboral(
    `id_experiencia_laboral` int (50) not null primary key auto_increment
  , `empresa` varchar(100) not null 
  , `logo_empresa` boolean not null default false
  , `puesto` text not null
  , `funciones_puesto` text
  , `fecha_inicio` date
  , `fecha_fin` date
  , `observaciones` text
  , `cronologia` text
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE objetivos_profesionales(
    `id_objetivos_profesionales` int (50) not null primary key auto_increment
  , `objetivo_profesional` text not null
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE tipo_skills (
    `id_tipo_skills` int (50) not null primary key auto_increment
  , `tipo_skill` varchar(200) not null
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE skills (
    `id_skills` int (50) not null primary key auto_increment
  , `nombre_skill` varchar(255) not null
  , `descripcion` text
  , `tipo_skill` int (50)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

ALTER TABLE skills ADD CONSTRAINT fk_tipo_skills_skills FOREIGN KEY (tipo_skill) REFERENCES tipo_skills(id_tipo_skills);

CREATE TABLE proyectos (
    `id_proyecto` int (50) not null primary key auto_increment
  , `nombre` varchar(255) not null
  , `link` text
) ENGINE=MyISAM DEFAULT CHARSET=utf8;