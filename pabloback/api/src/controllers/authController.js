// authController.js maneja el inicio de sesión.
// Hay dos logins separados:
// - /auth/cliente/login para clientes del ecommerce.
// - /auth/admin/login para usuarios administradores del sistema.
// Cada uno genera un JWT distinto, por eso un token de cliente
// no sirve para acceder a rutas de admin, y viceversa.

import { compararPassword, generarToken, JWT_SECRET_CLIENT, JWT_SECRET_ADMIN } from '../utils/auth.js';
import Cliente from '../models/clientes.model.js';
import Usuario from '../models/usuarios.model.js';
import Rol from '../models/roles.model.js';

/**
 * loginCliente
 * Recibe email y password, valida contra el modelo Cliente y
 * devuelve un token JWT con tipo 'cliente'.
 */
export const loginCliente = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validamos que vengan los datos mínimos.
        if (!email || !password) {
            return res.status(400).json({
                estado: false,
                mensaje: 'Debe proporcionar email y password',
            });
        }

        // Buscamos el cliente por email.
        const cliente = await Cliente.findOne({ where: { email } });

        if (!cliente) {
            return res.status(401).json({
                estado: false,
                mensaje: 'Credenciales inválidas',
            });
        }

        // Comparamos la contraseña enviada con el hash guardado.
        const passwordValido = await compararPassword(password, cliente.password);

        if (!passwordValido) {
            return res.status(401).json({
                estado: false,
                mensaje: 'Credenciales inválidas',
            });
        }

        // Generamos el token con datos públicos del cliente.
        // Usamos el secreto de cliente para que no sirva en rutas de admin.
        const token = generarToken({
            id: cliente.id,
            email: cliente.email,
            tipo: 'cliente',
        }, JWT_SECRET_CLIENT);

        res.json({
            estado: true,
            mensaje: 'Login de cliente exitoso',
            token,
            cliente: {
                id: cliente.id,
                nombre: cliente.nombre,
                email: cliente.email,
            },
        });
    } catch (error) {
        console.error('Error en loginCliente:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al iniciar sesión',
            error: error.message,
        });
    }
};

/**
 * registrarCliente
 * Recibe nombre, email y password, crea el cliente y devuelve un token JWT.
 * La contraseña se encripta automáticamente con el hook del modelo Cliente.
 */
export const registrarCliente = async (req, res) => {
    try {
        const { nombre, apellido, email, password } = req.body;

        // Validamos que vengan los datos mínimos.
        if (!nombre || !email || !password) {
            return res.status(400).json({
                estado: false,
                mensaje: 'Debe proporcionar nombre, email y password',
            });
        }

        // Verificamos que el email no esté registrado.
        const existe = await Cliente.findOne({ where: { email } });

        if (existe) {
            return res.status(400).json({
                estado: false,
                mensaje: 'El email ya está registrado',
            });
        }

        // Creamos el cliente. El hook beforeCreate encripta la contraseña.
        const cliente = await Cliente.create({ nombre, apellido, email, password });

        // Generamos el token con datos públicos del cliente.
        const token = generarToken({
            id: cliente.id,
            email: cliente.email,
            tipo: 'cliente',
        }, JWT_SECRET_CLIENT);

        res.status(201).json({
            estado: true,
            mensaje: 'Registro de cliente exitoso',
            token,
            cliente: {
                id: cliente.id,
                nombre: cliente.nombre,
                apellido: cliente.apellido,
                email: cliente.email,
            },
        });
    } catch (error) {
        console.error('Error en registrarCliente:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al registrar cliente',
            error: error.message,
        });
    }
};

/**
 * loginAdmin
 * Recibe email y password, valida contra el modelo Usuario y
 * verifica que el rol sea 'administrador'. Devuelve un token JWT
 * con tipo 'admin'.
 */
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validamos que vengan los datos mínimos.
        if (!email || !password) {
            return res.status(400).json({
                estado: false,
                mensaje: 'Debe proporcionar email y password',
            });
        }

        // Buscamos el usuario incluyendo su rol.
        const usuario = await Usuario.findOne({
            where: { email },
            include: {
                model: Rol,
                as: 'rol',
            },
        });

        // Si no existe o no tiene rol, rechazamos.
        if (!usuario || !usuario.rol) {
            return res.status(401).json({
                estado: false,
                mensaje: 'Credenciales inválidas o rol no asignado',
            });
        }

        // Solo permitimos el login si el rol es 'administrador'.
        if (usuario.rol.nombre.toLowerCase() !== 'administrador') {
            return res.status(403).json({
                estado: false,
                mensaje: 'Acceso solo para administradores',
            });
        }

        // Comparamos la contraseña enviada con el hash guardado.
        const passwordValido = await compararPassword(password, usuario.password);

        if (!passwordValido) {
            return res.status(401).json({
                estado: false,
                mensaje: 'Credenciales inválidas',
            });
        }

        // Generamos el token con datos públicos del admin y su rol.
        // Usamos el secreto de admin para que no sirva en rutas de cliente.
        const token = generarToken({
            id: usuario.id,
            email: usuario.email,
            tipo: 'admin',
            rolId: usuario.rolId,
            rolNombre: usuario.rol.nombre,
        }, JWT_SECRET_ADMIN);

        res.json({
            estado: true,
            mensaje: 'Login de administrador exitoso',
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol.nombre,
            },
        });
    } catch (error) {
        console.error('Error en loginAdmin:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al iniciar sesión',
            error: error.message,
        });
    }
};
