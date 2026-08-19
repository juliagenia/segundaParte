// favoritosRoutes.js define las rutas para gestionar los productos favoritos.
// TODAS estas rutas requieren que un cliente esté logueado.

import { Router } from 'express';
const router = Router();

import { verificarCliente } from '../middleware/auth.js';
import { obtenerMisFavoritos, agregar, eliminar } from '../controllers/favoritosController.js';

// Un solo middleware verifica token, tipo y carga el cliente.
router.use(verificarCliente);

// GET /favoritos -> ver mis productos favoritos.
router.get('/', obtenerMisFavoritos);

// POST /favoritos -> agregar un producto a favoritos (body: productoId).
router.post('/', agregar);

// DELETE /favoritos/:productoId -> eliminar un producto de favoritos.
router.delete('/:productoId', eliminar);

export default router;
