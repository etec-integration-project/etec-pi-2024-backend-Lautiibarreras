import db from '../db.js'; // Asegúrate de que esta sea la conexión correcta a tu base de datos

export const getCotizacion = async (req, res) => {
  const { tipo_servicio, cantidad, id_usuario } = req.body;
  try {
    // Consultar el precio del tipo de servicio
    const [result] = await db.execute(
      'SELECT precio FROM Precios WHERE tipo_servicio = ?',
      [tipo_servicio]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: 'Tipo de servicio no encontrado' });
    }

    const precio = result[0].precio;
    const precioTotal = precio * cantidad;

    // Guardar la cotización en la base de datos
    await db.execute(
      'INSERT INTO Cotizaciones (id_usuario, tipo_servicio, cantidad, precio_total, fecha) VALUES (?, ?, ?, ?, NOW())',
      [id_usuario || null, tipo_servicio, cantidad, precioTotal]
    );

    res.json({ precioTotal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al calcular la cotización' });
  }
};
