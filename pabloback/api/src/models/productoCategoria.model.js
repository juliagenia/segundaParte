// productoCategoria.model.js define el modelo de datos para la tabla "productos_categorias".
// Esta tabla es INTERMEDIA y representa la relación MUCHOS A MUCHOS
// entre Producto y Categoria:
// - Un producto puede tener muchas categorías.
// - Una categoría puede contener muchos productos.

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ProductoCategoria = sequelize.define('ProductoCategoria', {
    // Cada propiedad representa una columna de la tabla.
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,      // Es la clave primaria.
        autoIncrement: true,   // Se incrementa automáticamente por MySQL.
    },
    productoId: {
        type: DataTypes.INTEGER,
        allowNull: false,      // Campo obligatorio.
        // FK hacia la tabla productos.
    },
    categoriaId: {
        type: DataTypes.INTEGER,
        allowNull: false,      // Campo obligatorio.
        // FK hacia la tabla categorias.
    },
}, {
    tableName: 'productos_categorias', // Nombre exacto de la tabla en la base de datos.
    timestamps: false,                 // No agregamos columnas createdAt ni updatedAt.
    indexes: [
        {
            // Evitamos asociar el mismo producto dos veces con la misma categoría.
            unique: true,
            fields: ['productoId', 'categoriaId'],
        },
    ],
});

export default ProductoCategoria;
