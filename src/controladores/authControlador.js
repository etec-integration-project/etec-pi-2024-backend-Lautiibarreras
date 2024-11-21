// src/controladores/authControlador.js

import { pool } from '../index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config(); // Cargar variables de entorno

// Función para registrar un nuevo usuario
export const registrar = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Verificar si el usuario ya existe
        const [existingUser] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (existingUser.length > 0) {
            return res.status(409).send('Usuario existente');
        }

        // Hashear la contraseña
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
        console.log(`Intentando iniciar sesión con usuario: ${username}`);
        
        // Buscar el usuario por nombre de usuario
        const [user] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (user.length === 0) {
            console.log('Usuario no encontrado');
            return res.status(401).send('Usuario no encontrado');
        }

        // Verificar si la contraseña es válida
        const passwordIsValid = await bcrypt.compare(password, user[0].password);
        console.log(`¿Contraseña válida? ${passwordIsValid}`);

        if (!passwordIsValid) {
            console.log('Contraseña incorrecta');
            return res.status(401).send('Contraseña incorrecta');
        }

        // Asegúrate de que JWT_SECRET esté definido
        console.log('JWT_SECRET:', process.env.JWT_SECRET);

        // Generar el token JWT
        const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, {
            expiresIn: 86400, // El token expira en 24 horas
        });

        console.log('Token generado correctamente');

        // Configurar la cookie con el token JWT
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 86400000
        });

        res.status(200).json({ auth: true, ...user });
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
