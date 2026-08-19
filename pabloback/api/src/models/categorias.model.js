// categorias.model.js define el modelo de datos para la tabla "categorias".
// Representa las categorías en las que se pueden clasificar los productos.

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Categoria = sequelize.define('Categoria', {
    // Cada propiedad representa una columna de la tabla.
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,      // Es la clave primaria.
        autoIncrement: true,   // Se incrementa automáticamente por MySQL.
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,      // Campo obligatorio.
        unique: true,          // No puede haber dos categorías con el mismo nombre.
    },
    descripcion: {
        type: DataTypes.TEXT,  // TEXT permite guardar textos más largos.
    },
}, {
    tableName: 'categorias',   // Nombre exacto de la tabla en la base de datos.
    timestamps: false,         // No agregamos columnas createdAt ni updatedAt.
});

export default Categoria;
