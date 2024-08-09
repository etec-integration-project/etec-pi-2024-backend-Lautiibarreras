import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import appointmentRoutes from './src/rutas/appointmentRutas.js';
import authRoutes from './src/rutas/authRutas.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(cors({ origin: process.env.FRONTEND_URL}));

app.use('/api/appointments', appointmentRoutes);
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Algo salió mal, intente nuevamente más tarde.' });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
