// clientes.model.js define el modelo de datos para la tabla "clientes".
// Representa a las personas que compran en el ecommerce.

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { encriptarPassword } from '../utils/auth.js';

const Cliente = sequelize.define('Cliente', {
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
    apellido: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,      // Campo obligatorio.
        unique: true,          // No puede haber dos clientes con el mismo email.
    },
    telefono: {
        type: DataTypes.STRING,
    },
    direccion: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,      // Campo obligatorio para iniciar sesión.
        // Se encripta automáticamente antes de guardar con bcrypt.
    },
}, {
    tableName: 'clientes',     // Nombre exacto de la tabla en la base de datos.
    timestamps: false,         // No agregamos columnas createdAt ni updatedAt.
    hooks: {
        // Antes de crear un cliente, encriptamos la contraseña.
        beforeCreate: async (cliente) => {
            if (cliente.password) {
                cliente.password = await encriptarPassword(cliente.password);
            }
        },
        // Antes de actualizar, encriptamos la contraseña solo si fue modificada.
        beforeUpdate: async (cliente) => {
            if (cliente.changed('password')) {
                cliente.password = await encriptarPassword(cliente.password);
            }
        },
    },
});

export default Cliente;


 