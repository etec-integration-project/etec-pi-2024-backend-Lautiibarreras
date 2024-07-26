import express from 'express';
import cors from 'cors';
import { pool } from '../index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

const app = express();
app.use(cors({ origin: 'http://localhost:3001' })); // Permitir solicitudes desde el frontend
app.use(express.json());

const registrar = async (req, res) => {
    const { username, password } = req.body;

    console.log('Datos recibidos para registro:', username, password); // Log para depuración

    try {
        const [existingUser] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (existingUser.length > 0) {
            return res.status(409).send('Usuario existente');
        }

        const passwordHashed = await bcrypt.hash(password, 8);
        const [results] = await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, passwordHashed]);
        res.status(201).send('Usuario registrado con éxito');
    } catch (error) {
        console.error('Error al registrar usuario:', error); // Log de error
        res.status(500).send('Error al registrar usuario');
    }
};

app.post('/api/registrar', registrar);

app.listen(3000, () => {
    console.log('Backend running on port 3000');
});
