import express from 'express';
import { createPool } from 'mysql2/promise';
import { config } from 'dotenv';
import authRutas from './rutas/authRutas.js';
import appointmentRutas from './rutas/appointmentRutas.js';

config();

const app = express();

export const pool = createPool({
    host: process.env.MYSQLDB_HOST,
    user: process.env.MYSQLDB_USER,
    password: process.env.MYSQLDB_ROOT_PASSWORD,
    port: process.env.MYSQLDB_DOCKER_PORT,
    database: process.env.MYSQLDB_DATABASE
});

app.use(express.json());

const initializeDatabase = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL
            )
        `);
        console.log("Tabla 'users' creada o ya existe.");

        await pool.query(`
            CREATE TABLE IF NOT EXISTS appointments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                appointment_date DATETIME NOT NULL,
                description VARCHAR(255),
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);
        console.log("Tabla 'appointments' creada o ya existe.");
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
    }
};

app.get('/', (req, res) => {
    res.send('Hola');
});

app.get('/ping', async (req, res) => {
    const resultado = await pool.query('SELECT NOW()');
    res.json(resultado[0]);
});

app.use('/auth', authRutas);
app.use('/appointments', appointmentRutas);

app.listen(3000, async () => {
    await initializeDatabase();
    console.log(`Servidor corriendo en el puerto 3000`);
});
