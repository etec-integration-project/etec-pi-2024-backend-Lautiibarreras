import express from 'express';
import { registrar, iniciarSesion } from '../controladores/authControlador.js';

const router = express.Router();

router.post('/registrar', registrar);
router.post('/iniciar-sesion', iniciarSesion);

export default router;
