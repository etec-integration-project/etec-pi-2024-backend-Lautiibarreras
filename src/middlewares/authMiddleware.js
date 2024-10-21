import jwt from 'jsonwebtoken';

// Middleware para verificar el token JWT
export const verificarToken = (req, res, next) => {
    const token = req.cookies.token; // Obtener el token de las cookies

    if (!token) {
        return res.status(403).send('No token provided');
    }

    // Verificar el token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(500).send('Failed to authenticate token');
        }

        // Si el token es válido, se añade el id del usuario al request para usarlo en las rutas protegidas
        req.userId = decoded.id;
        next(); // Pasar al siguiente middleware o ruta
    });
};
