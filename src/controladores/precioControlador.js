// src/controladores/precioControlador.js

import { pool } from '../index.js';

export const actualizarPrecios = async (req, res) => {
  const precios = [
    { tipo_servicio: 'Desinfección tradicional por metro cuadrado', precio: 25.00 },
    { tipo_servicio: 'Termoniebla por metro cuadrado', precio: 55.00 },
    { tipo_servicio: 'Termoniebla por kilómetro lineal', precio: 102000.00 },
  ];

  try {
    let reescribirTabla = false;

    for (const { tipo_servicio, precio } of precios) {
      const [result] = await pool.query(
        'SELECT * FROM Precios WHERE tipo_servicio = ?',
        [tipo_servicio]
      );

      if (result.length > 0) {
        if (result[0].precio !== precio) {
          reescribirTabla = true;
          break;
        }
      } else {
        reescribirTabla = true;
        break;
      }
    }

    if (reescribirTabla) {
      console.log("Reescribiendo la tabla 'Precios' con nuevos valores...");
      await pool.query('DELETE FROM Precios');
      for (const { tipo_servicio, precio } of precios) {
        await pool.query(
          'INSERT INTO Precios (tipo_servicio, precio) VALUES (?, ?)',
          [tipo_servicio, precio]
        );
        console.log(`Insertado: ${tipo_servicio} con precio ${precio}`);
      }
      if (res) res.status(200).json({ message: 'Tabla reescrita con nuevos precios' });
    } else {
      console.log("No se realizaron cambios; los precios ya estaban actualizados.");
      if (res) res.status(200).json({ message: 'No se realizaron cambios; los precios ya estaban actualizados' });
    }
  } catch (error) {
    console.error('Error al actualizar precios:', error);
    if (res) res.status(500).json({ message: 'Error al actualizar precios' });
  }
};
