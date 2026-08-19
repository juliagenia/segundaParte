// auth.js contiene los middlewares que protegen las rutas del backend.
// Un middleware es una función que se ejecuta antes de llegar al controlador.
// Aquí verificamos que el token JWT sea válido y que el usuario tenga
// el rol correcto (cliente o administrador).

import jwt from 'jsonwebtoken';
import { JWT_SECRET_CLIENT, JWT_SECRET_ADMIN } from '../utils/auth.js';
import Usuario from '../models/usuarios.model.js';
import Cliente from '../models/clientes.model.js';
import Rol from '../models/roles.model.js';

/**
 * verificarToken
 * Recibe el secreto con el que debe estar firmado el token y devuelve
 * un middleware que:
 * - Lee el token del header Authorization.
 * - Lo verifica con el secreto recibido.
 * - Guarda el payload en req.user.
 *
 * Usamos secretos distintos para clientes y administradores. Así, incluso
 * si alguien cambia el campo "tipo" del token, no podrá usar un token de
 * cliente en una ruta de admin (o viceversa) porque no fue firmado con el
 * secreto correcto.
 */
export const verificarToken = (secret) => (req, res, next) => {
    try {
        // El token viene en el header: Authorization: Bearer <token>
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                estado: false,
                mensaje: 'No se proporcionó un token de autenticación',
            });
        }

        // Separamos la palabra "Bearer" del token propiamente dicho.
        const token = authHeader.split(' ')[1];

        // Verificamos que el token esté bien firmado con el secreto adecuado
        // y que no haya expirado.
        const payload = jwt.verify(token, secret);

        // Guardamos el payload en el objeto req para usarlo después.
        req.user = payload;

        // Continuamos con el siguiente middleware o controlador.
        next();
    } catch (error) {
        return res.status(401).json({
            estado: false,
            mensaje: 'Token inválido o expirado',
            error: error.message,
        });
    }
};

/**
 * verificarCliente
 * Middleware único para rutas de clientes.
 * Verifica el token con el secreto de cliente, comprueba que el tipo sea
 * 'cliente' y carga el objeto del cliente desde la base de datos.
 */
export const verificarCliente = (req, res, next) => {
    // Reusamos verificarToken con el secreto de cliente.
    verificarToken(JWT_SECRET_CLIENT)(req, res, async (err) => {
        if (err) return next(err);

        try {
            if (!req.user || req.user.tipo !== 'cliente') {
                return res.status(403).json({
                    estado: false,
                    mensaje: 'Acceso solo para clientes',
                });
            }

            const cliente = await Cliente.findByPk(req.user.id);

            if (!cliente) {
                return res.status(403).json({
                    estado: false,
                    mensaje: 'Cliente no encontrado',
                });
            }

            req.cliente = cliente;
            next();
        } catch (error) {
            console.error('Error en verificarCliente:', error);
            return res.status(500).json({
                estado: false,
                mensaje: 'Error al verificar cliente',
                error: error.message,
            });
        }
    });
};

/**
 * verificarAdmin
 * Middleware único para rutas de administradores.
 * Verifica el token con el secreto de admin, comprueba que el tipo sea
 * 'admin', busca el usuario en la base de datos e incluye su rol.
 */
export const verificarAdmin = (req, res, next) => {
    // Reusamos verificarToken con el secreto de admin.
    verificarToken(JWT_SECRET_ADMIN)(req, res, async (err) => {
        if (err) return next(err);

        try {
            if (!req.user || req.user.tipo !== 'admin') {
                return res.status(403).json({
                    estado: false,
                    mensaje: 'Acceso solo para administradores',
                });
            }

            const usuario = await Usuario.findByPk(req.user.id, {
                include: {
                    model: Rol,
                    as: 'rol',
                },
            });

            if (!usuario || !usuario.rol) {
                return res.status(403).json({
                    estado: false,
                    mensaje: 'Usuario o rol no encontrado',
                });
            }

            if (usuario.rol.nombre.toLowerCase() !== 'administrador') {
                return res.status(403).json({
                    estado: false,
                    mensaje: 'El usuario no tiene permisos de administrador',
                });
            }

            req.usuario = usuario;
            next();
        } catch (error) {
            console.error('Error en verificarAdmin:', error);
            return res.status(500).json({
                estado: false,
                mensaje: 'Error al verificar administrador',
                error: error.message,
            });
        }
    });
};
