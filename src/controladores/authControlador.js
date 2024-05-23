import { pool } from '../index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

export const registrar = async (req, res) => {
    const { username, password } = req.body;

    try {
        const passwordHashed = await bcrypt.hash(password, 8);
        const [results, fields] = await pool.query(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, passwordHashed]);
        res.status(201).send(results);
    } catch (error) {
        res.status(500).send(error);
    }
};


export const iniciarSesion = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(404).send('Usuario no encontrado');
        }

        const usuario = rows[0];
        const esContrasenaValida = await bcrypt.compare(password, usuario.contrasena);

        if (!esContrasenaValida) {
            return res.status(401).send('Contraseña inválida');
        }

        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).send(error);
    }
};
