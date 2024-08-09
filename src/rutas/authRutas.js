// src/rutas/authRutas.js
import { Router } from 'express';
import { registrar, iniciarSesion, listarUsuarios } from '../controladores/authControlador.js';

const router = Router();

router.post('/registrar', registrar);
router.post('/iniciarSesion', iniciarSesion);
router.get('/usuarios', listarUsuarios);

export default router;
