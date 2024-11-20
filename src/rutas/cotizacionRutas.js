import express from 'express';
import { getCotizacion, getCotizacionesAnteriores } from '../controladores/cotizacionControlador.js';

const router = express.Router();

// Ruta para calcular y registrar una nueva cotización
router.post('/cotizacion', getCotizacion);

// Ruta para obtener cotizaciones anteriores de un usuario
router.get('/cotizaciones/:id_usuario', getCotizacionesAnteriores);

export default router;
