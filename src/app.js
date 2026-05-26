import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import checkJwt from './middlewares/authMiddleware.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

app.use(helmet());

app.use(express.json());

app.use(morgan('dev'));

// Endpoint de prueba para verificar que el servicio está corriendo
app.get('/', checkJwt, (req, res) => {
  res.json({
    message: 'Auth Service running'
  });
});

// Rutas de usuarios
app.use('/api/users', userRoutes);

export default app;