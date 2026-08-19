// database.js configura la conexión a la base de datos usando Sequelize.
// Los datos de conexión se leen desde variables de entorno definidas en el archivo .env.

import { Sequelize } from 'sequelize';

// Creamos una instancia de Sequelize con los datos del .env.
// DB_NAME: nombre de la base de datos.
// DB_USER: usuario de MySQL.
// DB_PASSWORD: contraseña de MySQL.
// DB_HOST y DB_PORT: dónde está corriendo el servidor de MySQL.
// DB_DIALECT: tipo de base de datos (en este caso mysql).
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: console.log, // Muestra en consola las consultas SQL que se ejecutan.
  }
);

export default sequelize;
