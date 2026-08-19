// statusRoutes.js define una ruta simple para verificar que el servidor está activo.

import { Router } from 'express';
const router = Router();

// GET /status/estado -> responde con { estado: true }.
router.get('/estado', (req, res) => {
    res.json({
        estado: true
    });
});

export default router;
