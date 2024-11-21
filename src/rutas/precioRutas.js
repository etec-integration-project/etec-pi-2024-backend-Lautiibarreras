import express from 'express';
import { actualizarPrecios, agregarPrecio } from '../controladores/precioControlador.js';
import { verificarAdmin } from '../middlewares/authMiddleware.js';
import { pool } from '../index.js';
const router = express.Router();

router.post('/actualizar', actualizarPrecios);
router.post('/agregar', verificarAdmin, agregarPrecio);

// Nueva ruta para obtener los tipos de servicio
router.get('/servicios', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT tipo_servicio FROM Precios'); // Consulta la tabla Precios
        res.status(200).json(results); // Devuelve los servicios como JSON
    } catch (error) {
        console.error('Error al obtener los servicios:', error);
        res.status(500).send('Error al obtener los servicios');
    }
});

export default router;
