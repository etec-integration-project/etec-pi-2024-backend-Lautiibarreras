// src/rutas/precioRutas.js

import express from 'express';
import { actualizarPrecios } from '../controladores/precioControlador.js';

const router = express.Router();

router.post('/actualizar', actualizarPrecios);

export default router;
