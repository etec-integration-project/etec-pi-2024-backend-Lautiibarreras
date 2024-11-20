// src/controladores/cotizacionControlador.js

import { pool } from '../index.js'; // Asegúrate de que esta sea la conexión correcta al pool de la base de datos

// Controlador para calcular una nueva cotización
export const getCotizacion = async (req, res) => {
  const { tipo_servicio, cantidad, id_usuario } = req.body;
  try {
    // Consultar el precio del tipo de servicio
    const [result] = await pool.query(
      'SELECT precio FROM Precios WHERE tipo_servicio = ?',
      [tipo_servicio]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: 'Tipo de servicio no encontrado' });
    }

    const precio = result[0].precio;
    const precioTotal = precio * cantidad;

    // Guardar la cotización en la base de datos
    await pool.query(
      'INSERT INTO Cotizaciones (id_usuario, tipo_servicio, cantidad, precio_total, fecha) VALUES (?, ?, ?, ?, NOW())',
      [id_usuario || null, tipo_servicio, cantidad, precioTotal]
    );

    res.json({ precioTotal });
  } catch (error) {
    console.error('Error al calcular la cotización:', error);
    res.status(500).json({ message: 'Error al calcular la cotización' });
  }
};

// Controlador para obtener cotizaciones anteriores de un usuario (solo cantidades)
export const getCotizacionesAnteriores = async (req, res) => {
  const { id_usuario } = req.params;
  try {
    // Obtener las cotizaciones anteriores solo con la cantidad
    const [rows] = await pool.query(
      'SELECT cantidad FROM Cotizaciones WHERE id_usuario = ?',
      [id_usuario]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener cotizaciones anteriores:', error);
    res.status(500).json({ message: 'Error al obtener cotizaciones anteriores' });
  }
};
