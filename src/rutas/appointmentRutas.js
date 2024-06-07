import express from 'express';
import { asignarCita, obtenerCitasPorUsuario } from '../controladores/appointmentControlador.js';

const router = express.Router();

router.post('/asignar', asignarCita);
router.get('/usuario/:user_id', obtenerCitasPorUsuario);

export default router;
