// clientesRoutes.js define las rutas relacionadas con los clientes.
// Cada ruta asocia un método HTTP con una función del controller.

import { Router } from 'express';
const router = Router();

import {
    obtener,
    obtenerPorId,
    crear,
    actualizar,
    eliminar,
} from '../controllers/clientesController.js';

// GET /clientes -> listar todos los clientes.
router.get('/', obtener);

// GET /clientes/:id -> ver un cliente específico.
router.get('/:id', obtenerPorId);

// POST /clientes -> crear un nuevo cliente.
router.post('/', crear);

// PUT /clientes/:id -> actualizar un cliente existente.
router.put('/:id', actualizar);

// DELETE /clientes/:id -> eliminar un cliente.
router.delete('/:id', eliminar);

export default router;
