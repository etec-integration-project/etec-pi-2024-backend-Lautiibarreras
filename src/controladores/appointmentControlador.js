// src/controladores/appointmentControlador.js

import { pool } from '../index.js';

// Asignar una cita
export const asignarCita = async (req, res) => {

    const { appointment_date, description } = req.body;

    const user_id = req.userId

    try {
        const [result] = await pool.query(
            'INSERT INTO appointments (user_id, appointment_date, description) VALUES (?, ?, ?)', 
            [user_id, appointment_date, description]
        );
        
        // Devuelve el ID de la cita creada
        res.status(201).json({
            message: 'Cita asignada con éxito',
            appointmentId: result.insertId,
        });
    } catch (error) {
        console.error('Error al asignar la cita:', error);
        res.status(500).send('Error al asignar la cita');
    }
};

// Obtener citas por usuario
export const obtenerCitasPorUsuario = async (req, res) => {
    const { user_id } = req.params;

    try {
        const [rows] = await pool.query('SELECT * FROM appointments WHERE user_id = ?', [user_id]);

        if (rows.length === 0) {
            return res.status(404).send('No se encontraron citas para este usuario');
        }

        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener las citas:', error);
        res.status(500).send('Error al obtener las citas');
    }
};
