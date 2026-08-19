// authRoutes.js define las rutas de autenticación.
// Aquí se hacen los logins de clientes y administradores.

import { Router } from 'express';
const router = Router();

import { registrarCliente, loginCliente, loginAdmin } from '../controllers/authController.js';

// POST /auth/cliente/registro -> registro para clientes del ecommerce.
router.post('/cliente/registro', registrarCliente);

// POST /auth/cliente/login -> login para clientes del ecommerce.
router.post('/cliente/login', loginCliente);

// POST /auth/admin/login -> login para usuarios administradores.
router.post('/admin/login', loginAdmin);

export default router;
