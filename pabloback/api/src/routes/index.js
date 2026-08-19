// index.js (dentro de routes) agrupa todas las rutas de la API.
// Cada grupo de rutas se importa y se asigna a un path específico.

import { Router } from 'express';
const router = Router();

import statusRoutes from './statusRoutes.js';
import usuariosRoutes from './usuariosRoutes.js';
import productosRoutes from './productosRoutes.js';
import authRoutes from './authRoutes.js';
import favoritosRoutes from './favoritosRoutes.js';
import categoriasRoutes from './categoriasRoutes.js';
import clientesRoutes from './clientesRoutes.js';

// Todas las rutas de statusRoutes estarán disponibles bajo /status.
router.use('/status', statusRoutes);

// Todas las rutas de usuariosRoutes estarán disponibles bajo /usuarios.
router.use('/usuarios', usuariosRoutes);

// Todas las rutas de productosRoutes estarán disponibles bajo /productos.
router.use('/productos', productosRoutes);

// Rutas de autenticación: /auth/cliente/login y /auth/admin/login.
router.use('/auth', authRoutes);

// Rutas de favoritos: protegidas para clientes.
router.use('/favoritos', favoritosRoutes);

// Rutas de categorías: protegidas para administradores.
router.use('/categorias', categoriasRoutes);

// Rutas de clientes.
router.use('/clientes', clientesRoutes);

// Ejemplo de ruta de prueba que suma dos números recibidos por query.
router.get('/sumar', (req, res) => {
    const n1 = req.query.num1;
    const n2 = req.query.num2;

    console.log("numeros: ", req.query)
    const suma = parseInt(n1) + parseInt(n2);

    res.json({
        resultado: suma
    });
});

// Ejemplo de ruta de prueba con POST.
router.post('/pedido', (req, res) => {
    res.json({
        estado: true
    });
});

export default router;
