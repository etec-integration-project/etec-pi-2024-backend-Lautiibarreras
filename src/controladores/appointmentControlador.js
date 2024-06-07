import { pool } from '../index.js';

export const asignarCita = async (req, res) => {
    const { user_id, appointment_date, description } = req.body;

    try {
        const [result] = await pool.query(
            'INSERT INTO appointments (user_id, appointment_date, description) VALUES (?, ?, ?)', 
            [user_id, appointment_date, description]
        );
        res.status(201).send('Cita asignada con éxito');
    } catch (error) {
        res.status(500).send('Error al asignar la cita');
    }
};

export const obtenerCitasPorUsuario = async (req, res) => {
    const { user_id } = req.params;

    try {
        const [rows] = await pool.query('SELECT * FROM appointments WHERE user_id = ?', [user_id]);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).send('Error al obtener las citas');
    }
};
