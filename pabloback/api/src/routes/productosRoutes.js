// productosRoutes.js define las rutas relacionadas con productos.
// Cada ruta asocia un método HTTP con una función del controller.

import { Router } from 'express';
const router = Router();

import {
    obtener,
    obtenerPorId,
    crear,
    actualizar,
    eliminar,
} from '../controllers/productosController.js';

// GET /productos -> listar todos los productos.
router.get('/', obtener);

// GET /productos/:id -> ver un producto específico.
router.get('/:id', obtenerPorId);

// POST /productos -> crear un nuevo producto.
router.post('/', crear);

// PUT /productos/:id -> actualizar un producto existente.
router.put('/:id', actualizar);

// DELETE /productos/:id -> eliminar un producto.
router.delete('/:id', eliminar);

export default router;
