import jwt from 'jsonwebtoken';

// Middleware para verificar si el usuario es administrador
export const verificarAdmin = (req, res, next) => {
    const { username, password } = req.headers;

    if (username === 'admin' && password === 'admin123') {
        return next(); // Usuario es administrador
    }

    res.status(403).send('No tienes permisos para realizar esta acción');
};

// Middleware para verificar el token JWT
export const verificarToken = (req, res, next) => {
    const token = req.cookies['token']; // Obtener el token de las cookies

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
