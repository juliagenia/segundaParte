// usuarios.model.js define el modelo de datos para la tabla "usuarios".
// Un modelo en Sequelize representa una tabla de la base de datos.
// Ahora incluye la relación con Rol (1 a muchos): un usuario puede tener un rol.

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { encriptarPassword } from '../utils/auth.js';

const Usuario = sequelize.define('Usuario', {
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
        allowNull: false,      // Campo obligatorio para poder iniciar sesión.
        unique: true,          // El email debe ser único para identificar al usuario.
    },
    edad: {
        type: DataTypes.INTEGER,
    },
    peso: {
        type: DataTypes.INTEGER,
    },
    telefono: {
        type: DataTypes.STRING,
    },
    direccion: {
        type: DataTypes.STRING,
    },
    rolId: {
        type: DataTypes.INTEGER,
        // Clave foránea hacia la tabla roles.
        // Relación 1 a muchos: un usuario pertenece a un solo rol,
        // y un rol puede tener muchos usuarios.
        // Es opcional para no romper registros de usuarios ya existentes.
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,      // Campo obligatorio para iniciar sesión.
        // Se encripta automáticamente antes de guardar con bcrypt.
    },
}, {
    tableName: 'usuarios',   // Nombre exacto de la tabla en la base de datos.
    timestamps: false,        // No agregamos columnas createdAt ni updatedAt.
    hooks: {
        // Antes de crear un usuario, encriptamos la contraseña.
        beforeCreate: async (usuario) => {
            if (usuario.password) {
                usuario.password = await encriptarPassword(usuario.password);
            }
        },
        // Antes de actualizar, encriptamos la contraseña solo si fue modificada.
        beforeUpdate: async (usuario) => {
            if (usuario.changed('password')) {
                usuario.password = await encriptarPassword(usuario.password);
            }
        },
    },
});

export default Usuario;
