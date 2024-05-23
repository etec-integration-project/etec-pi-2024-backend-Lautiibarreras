import express from 'express';
import { createPool } from 'mysql2/promise';
import { config } from 'dotenv';
import authRutas from './rutas/authRutas.js';

config();

const app = express();

export const pool = createPool({
    host: process.env.MYSQLDB_HOST,
    user: 'root',
    password: process.env.MYSQLDB_ROOT_PASSWORD,
    port: process.env.MYSQLDB_DOCKER_PORT,
    database: process.env.MYSQLDB_DATABASE // Añadir esta línea para especificar la base de datos
});

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hola');
});

app.get('/ping', async (req, res) => {
    const resultado = await pool.query('SELECT NOW()');
    res.json(resultado[0]);
});

app.use('/auth', authRutas);

app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto', 3000);
});
