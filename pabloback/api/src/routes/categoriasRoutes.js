// categoriasRoutes.js define las rutas para el CRUD de categorías.
// TODAS estas rutas requieren que un administrador esté logueado.

import { Router } from 'express';
const router = Router();

import { verificarAdmin } from '../middleware/auth.js';
import {
    obtener,
    obtenerPorId,
    crear,
    actualizar,
    eliminar,
} from '../controllers/categoriasController.js';

// Un solo middleware verifica token, tipo, rol y carga el usuario.
router.use(verificarAdmin);

// GET /categorias -> listar todas las categorías.
router.get('/', obtener);

// GET /categorias/:id -> ver una categoría específica.
router.get('/:id', obtenerPorId);

// POST /categorias -> crear una categoría.
router.post('/', crear);

// PUT /categorias/:id -> actualizar una categoría.
router.put('/:id', actualizar);

// DELETE /categorias/:id -> eliminar una categoría.
router.delete('/:id', eliminar);

export default router;
