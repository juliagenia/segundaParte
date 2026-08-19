// usuariosController.js contiene la lógica de negocio para los usuarios.
// Cada función atiende una petición HTTP y devuelve una respuesta JSON.

import Usuario from '../models/usuarios.model.js';

// GET /usuarios -> devuelve todos los usuarios.
export const obtener = async (req, res) => {
    try {
        // findAll() trae todos los registros de la tabla usuarios.
        const data = await Usuario.findAll();
        res.json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al obtener usuarios',
            error: error.message,
        });
    }
};

// GET /usuarios/:id -> devuelve un usuario por su id.
export const obtenerPorId = async (req, res) => {
    try {
        // req.params.id es el id que viene en la URL.
        const id = parseInt(req.params.id, 10);

        // findByPk busca un registro por su clave primaria.
        const data = await Usuario.findByPk(id);

        if (!data) {
            // 404 significa "no encontrado".
            return res.status(404).json({
                estado: false,
                mensaje: 'Usuario no encontrado',
            });
        }

        res.json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al obtener usuario',
            error: error.message,
        });
    }
};

// POST /usuarios -> crea un nuevo usuario con los datos del body.
export const crear = async (req, res) => {
    try {
        // req.body contiene los datos enviados desde el frontend.
        const data = await Usuario.create(req.body);

        // 201 significa "creado correctamente".
        res.status(201).json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(400).json({
            estado: false,
            mensaje: 'Error al crear usuario',
            error: error.message,
        });
    }
};

// PUT /usuarios/:id -> actualiza un usuario existente.
export const actualizar = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Usuario no encontrado',
            });
        }

        // update() modifica los campos del registro con los datos recibidos.
        await usuario.update(req.body);
        res.json({
            estado: true,
            data: usuario,
        });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(400).json({
            estado: false,
            mensaje: 'Error al actualizar usuario',
            error: error.message,
        });
    }
};

// DELETE /usuarios/:id -> elimina un usuario.
export const eliminar = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Usuario no encontrado',
            });
        }

        // destroy() borra el registro de la base de datos.
        await usuario.destroy();
        res.json({
            estado: true,
            mensaje: 'Usuario eliminado correctamente',
        });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al eliminar usuario',
            error: error.message,
        });
    }
};
