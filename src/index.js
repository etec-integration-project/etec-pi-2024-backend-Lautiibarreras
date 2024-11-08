import express from 'express';
import cors from 'cors';
import { createPool } from 'mysql2/promise';
import { config } from 'dotenv';

config();

const app = express();
app.use(cors());  // Permitir solicitudes desde http://localhost:3001

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
        // Crear tabla de usuarios
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL
            )
        `);
        console.log("Tabla 'users' creada o ya existe.");

        // Crear tabla de citas
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

        // Crear tabla de precios
        await pool.query(`
            CREATE TABLE IF NOT EXISTS Precios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                tipo_servicio VARCHAR(50) NOT NULL,
                precio DECIMAL(10, 2) NOT NULL
            );
        `);
        console.log("Tabla 'Precios' creada o ya existe.");

        // Insertar precios iniciales en la tabla Precios
        await pool.query(`
            INSERT IGNORE INTO Precios (tipo_servicio, precio) VALUES
            ('Desinfección tradicional por metro cuadrado', 25.00),
            ('Termoniebla por metro cuadrado', 55.00),
            ('Termoniebla por kilómetro lineal', 102000.00);
        `);
        console.log("Valores iniciales insertados en la tabla 'Precios'.");

        // Crear tabla de cotizaciones
        await pool.query(`
            CREATE TABLE IF NOT EXISTS Cotizaciones (
                id INT AUTO_INCREMENT PRIMARY KEY,
                id_usuario INT NULL,
                tipo_servicio VARCHAR(50) NOT NULL,
                cantidad DECIMAL(10, 2) NOT NULL,
                precio_total DECIMAL(10, 2) NOT NULL,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Tabla 'Cotizaciones' creada o ya existe.");

    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
    }
};

const initializeServer = async () => {
    const port = process.env.PORT || 5000;
    try {
        await initializeDatabase();

        // Importa y usa las rutas solo después de que la base de datos esté inicializada
        const authRutas = (await import('./rutas/authRutas.js')).default;
        const appointmentRutas = (await import('./rutas/appointmentRutas.js')).default;

        app.get('/', (req, res) => {
            res.send('Hola');
        });

        app.get('/api/ping', async (req, res) => {
            const resultado = await pool.query('SELECT NOW()');
            res.json(resultado[0]);
        });

        app.use('/api/auth', authRutas);
        app.use('/api/appointments', appointmentRutas);

        app.listen(port, () => {
            console.log(`Servidor corriendo en puerto ${port}`);
        });
    } catch (error) {
        console.error('Error al inicializar el servidor:', error);
    }
};

initializeServer();
