// favoritos.model.js define el modelo de datos para la tabla "favoritos".
// Esta tabla es INTERMEDIA y representa la relación MUCHOS A MUCHOS
// entre Cliente y Producto:
// - Un cliente puede marcar muchos productos como favoritos.
// - Un producto puede ser favorito de muchos clientes.

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Favorito = sequelize.define('Favorito', {
    // Cada propiedad representa una columna de la tabla.
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,      // Es la clave primaria.
        autoIncrement: true,   // Se incrementa automáticamente por MySQL.
    },
    clienteId: {
        type: DataTypes.INTEGER,
        allowNull: false,      // Campo obligatorio.
        // FK hacia la tabla clientes.
    },
    productoId: {
        type: DataTypes.INTEGER,
        allowNull: false,      // Campo obligatorio.
        // FK hacia la tabla productos.
    },
}, {
    tableName: 'favoritos',    // Nombre exacto de la tabla en la base de datos.
    timestamps: false,         // No agregamos columnas createdAt ni updatedAt.
    indexes: [
        {
            // Evitamos que un cliente marque el mismo producto dos veces como favorito.
            unique: true,
            fields: ['clienteId', 'productoId'],
        },
    ],
});

export default Favorito;
