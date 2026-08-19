// roles.model.js define el modelo de datos para la tabla "roles".
// Representa los roles que puede tener un usuario administrador del sistema.

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Rol = sequelize.define('Rol', {
    // Cada propiedad representa una columna de la tabla.
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,      // Es la clave primaria.
        autoIncrement: true,   // Se incrementa automáticamente por MySQL.
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,      // Campo obligatorio.
        // Ejemplos de roles: 'administrador', 'vendedor', 'repositor'.
    },
    descripcion: {
        type: DataTypes.TEXT,  // TEXT permite guardar textos más largos.
    },
}, {
    tableName: 'roles',        // Nombre exacto de la tabla en la base de datos.
    timestamps: false,         // No agregamos columnas createdAt ni updatedAt.
});

export default Rol;
