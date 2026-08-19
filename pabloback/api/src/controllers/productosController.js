// productosController.js contiene la lógica de negocio para los productos.
// Cada función atiende una petición HTTP y devuelve una respuesta JSON.
// Ahora exportamos cada función por separado en lugar de agruparlas en un objeto.

import Producto from '../models/productos.model.js';

// GET /productos -> devuelve todos los productos.
export const obtener = async (req, res) => {
    try {
        // findAll() trae todos los registros de la tabla productos.
        const data = await Producto.findAll();
        res.json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al obtener productos',
            error: error.message,
        });
    }
};

// GET /productos/:id -> devuelve un producto por su id.
export const obtenerPorId = async (req, res) => {
    try {
        // req.params.id es el id que viene en la URL.
        const id = parseInt(req.params.id, 10);

        // findByPk busca un registro por su clave primaria.
        const data = await Producto.findByPk(id);

        if (!data) {
            // 404 significa "no encontrado".
            return res.status(404).json({
                estado: false,
                mensaje: 'Producto no encontrado',
            });
        }

        res.json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al obtener producto',
            error: error.message,
        });
    }
};

// POST /productos -> crea un nuevo producto con los datos del body.
export const crear = async (req, res) => {
    try {
        // req.body contiene los datos enviados desde el frontend.
        const data = await Producto.create(req.body);

        // 201 significa "creado correctamente".
        res.status(201).json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(400).json({
            estado: false,
            mensaje: 'Error al crear producto',
            error: error.message,
        });
    }
};

// PUT /productos/:id -> actualiza un producto existente.
export const actualizar = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Producto no encontrado',
            });
        }

        // update() modifica los campos del registro con los datos recibidos.
        await producto.update(req.body);
        res.json({
            estado: true,
            data: producto,
        });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(400).json({
            estado: false,
            mensaje: 'Error al actualizar producto',
            error: error.message,
        });
    }
};

// DELETE /productos/:id -> elimina un producto.
export const eliminar = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Producto no encontrado',
            });
        }

        // destroy() borra el registro de la base de datos.
        await producto.destroy();
        res.json({
            estado: true,
            mensaje: 'Producto eliminado correctamente',
        });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al eliminar producto',
            error: error.message,
        });
    }
};
