// productos.model.js define el modelo de datos para la tabla "productos".
// Un modelo en Sequelize representa una tabla de la base de datos.
// Las categorías NO son un campo de este modelo; se relacionan mediante
// la relación MUCHOS A MUCHOS con Categoria a través de ProductoCategoria.

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Producto = sequelize.define('Producto', {
    // Cada propiedad representa una columna de la tabla.
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,      // Es la clave primaria.
        autoIncrement: true,   // Se incrementa automáticamente por MySQL.
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,      // Campo obligatorio.
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2), // Número con 10 dígitos en total, 2 decimales.
        allowNull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
    },
    peso: {
        type: DataTypes.INTEGER,
    },
    descripcion: {
        type: DataTypes.TEXT, // TEXT permite guardar textos más largos.
    },
    
}, {
    tableName: 'productos',    // Nombre exacto de la tabla en la base de datos.
    timestamps: false,        // No agregamos columnas createdAt ni updatedAt.
});

export default Producto;
