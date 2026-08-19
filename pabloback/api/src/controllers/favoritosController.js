// favoritosController.js gestiona los productos favoritos de un cliente.
// Requiere que el cliente haya iniciado sesión.

import Cliente from '../models/clientes.model.js';
import Producto from '../models/productos.model.js';
import Favorito from '../models/favoritos.model.js';

/**
 * obtenerMisFavoritos
 * Devuelve todos los productos marcados como favoritos por el cliente
 * que está logueado.
 */
export const obtenerMisFavoritos = async (req, res) => {
    try {
        // Buscamos el cliente logueado e incluimos sus productos favoritos.
        const cliente = await Cliente.findByPk(req.cliente.id, {
            include: {
                model: Producto,
                as: 'productosFavoritos',
            },
        });

        res.json({
            estado: true,
            data: cliente.productosFavoritos || [],
        });
    } catch (error) {
        console.error('Error al obtener favoritos:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al obtener favoritos',
            error: error.message,
        });
    }
};

/**
 * agregar
 * Agrega un producto a los favoritos del cliente logueado.
 * Recibe productoId en el body.
 */
export const agregar = async (req, res) => {
    try {
        const { productoId } = req.body;
        const clienteId = req.cliente.id;

        if (!productoId) {
            return res.status(400).json({
                estado: false,
                mensaje: 'Debe proporcionar productoId',
            });
        }

        // Verificamos que el producto exista.
        const producto = await Producto.findByPk(productoId);

        if (!producto) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Producto no encontrado',
            });
        }

        // Usamos findOrCreate para evitar duplicados.
        const [favorito, created] = await Favorito.findOrCreate({
            where: { clienteId, productoId },
            defaults: { clienteId, productoId },
        });

        res.status(created ? 201 : 200).json({
            estado: true,
            mensaje: created
                ? 'Producto agregado a favoritos'
                : 'El producto ya estaba en favoritos',
            data: favorito,
        });
    } catch (error) {
        console.error('Error al agregar favorito:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al agregar favorito',
            error: error.message,
        });
    }
};

/**
 * eliminar
 * Elimina un producto de los favoritos del cliente logueado.
 * Recibe productoId por params.
 */
export const eliminar = async (req, res) => {
    try {
        const { productoId } = req.params;
        const clienteId = req.cliente.id;

        // Eliminamos el registro de la tabla intermedia.
        const eliminados = await Favorito.destroy({
            where: { clienteId, productoId },
        });

        if (eliminados === 0) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Favorito no encontrado',
            });
        }

        res.json({
            estado: true,
            mensaje: 'Favorito eliminado correctamente',
        });
    } catch (error) {
        console.error('Error al eliminar favorito:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al eliminar favorito',
            error: error.message,
        });
    }
};
