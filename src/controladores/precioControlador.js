import { pool } from '../index.js';

// Actualizar precios predefinidos
export const actualizarPrecios = async (req, res) => {
    const { tipo_servicio, precio } = req.body;

    await pool.query('UPDATE Precios SET precio = ? WHERE tipo_servicio = ?', [precio, tipo_servicio]);


};

// Agregar o actualizar precios manualmente
export const agregarPrecio = async (req, res) => {
    const { tipo_servicio, precio } = req.body;

    if (!tipo_servicio || !precio) {
        return res.status(400).send('Faltan datos requeridos');
    }

    try {
        const query = 'INSERT INTO Precios (tipo_servicio, precio) VALUES (?, ?) ON DUPLICATE KEY UPDATE precio = ?';
        await pool.query(query, [tipo_servicio, precio, precio]);
        res.status(200).send('Precio actualizado exitosamente');
    } catch (error) {
        console.error('Error al agregar precio:', error);
        res.status(500).send('Error al agregar precio');
    }
}
