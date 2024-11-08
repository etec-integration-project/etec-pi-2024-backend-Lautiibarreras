import express from 'express';
import { getCotizacion } from '../controladores/cotizacionControlador.js';
const router = express.Router();

// Endpoint para calcular la cotización
router.post('/cotizacion', getCotizacion);

export default router;
