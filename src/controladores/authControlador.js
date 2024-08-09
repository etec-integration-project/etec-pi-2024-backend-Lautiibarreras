// src/controladores/authControlador.js

import { pool } from '../index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

// Función para registrar un nuevo usuario
export const registrar = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [existingUser] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (existingUser.length > 0) {
            return res.status(409).send('Usuario existente');
        }

        const passwordHashed = await bcrypt.hash(password, 8);
        await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, passwordHashed]);

        res.status(201).send('Usuario registrado con éxito');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).send('Error al registrar usuario');
    }
};

// Función para iniciar sesión
export const iniciarSesion = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [user] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (user.length === 0) {
            return res.status(401).send('Usuario no encontrado');
        }

        const passwordIsValid = await bcrypt.compare(password, user[0].password);

        if (!passwordIsValid) {
            return res.status(401).send('Contraseña incorrecta');
        }

        const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, {
            expiresIn: 86400, // 24 horas
        });

        res.status(200).send({ auth: true, token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).send('Error al iniciar sesión');
    }
};

// Función para listar usuarios
export const listarUsuarios = async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, username FROM users');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error al listar usuarios:', error);
        res.status(500).send('Error al listar usuarios');
    }
};
