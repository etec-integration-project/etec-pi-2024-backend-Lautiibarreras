const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importar el middleware cors
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3001' // Permitir solicitudes desde el frontend en localhost:3001
}));

// Endpoint para recibir datos
app.post('/data', (req, res) => {
  const { data } = req.body;
  console.log('Datos recibidos:', data);
  // Aquí puedes agregar la lógica para guardar los datos en la base de datos
  res.status(200).send('Datos recibidos correctamente');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
