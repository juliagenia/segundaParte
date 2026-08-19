// usuariosRoutes.js define las rutas relacionadas con usuarios.
// Cada ruta asocia un método HTTP con una función del controller.

import { Router } from 'express';
const router = Router();

import { verificarAdmin } from '../middleware/auth.js';
import {
    obtener,
    obtenerPorId,
    crear,
    actualizar,
    eliminar,
} from '../controllers/usuariosController.js';

// Un solo middleware verifica token, tipo, rol y carga el usuario.
router.use(verificarAdmin);

// GET /usuarios -> listar todos los usuarios.
router.get('/', obtener);

// GET /usuarios/:id -> ver un usuario específico.
router.get('/:id', obtenerPorId);

// POST /usuarios -> crear un nuevo usuario.
router.post('/', crear);

// PUT /usuarios/:id -> actualizar un usuario existente.
router.put('/:id', actualizar);

// DELETE /usuarios/:id -> eliminar un usuario.
router.delete('/:id', eliminar);

export default router;
