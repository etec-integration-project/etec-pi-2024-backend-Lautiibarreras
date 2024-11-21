import express from 'express';
import { asignarCita, obtenerCitasPorUsuario } from '../controladores/appointmentControlador.js';
import { verificarToken } from '../middlewares/authMiddleware.js'; // Importar el middleware

const router = express.Router();

// Proteger la ruta para asignar una cita con el middleware verificarToken
router.post('/asignar', verificarToken, asignarCita);

// Proteger la ruta para obtener las citas de un usuario con el middleware verificarToken
router.get('/usuario/:user_id', verificarToken, obtenerCitasPorUsuario);


export default router;
