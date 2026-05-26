import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// Endpoint de prueba del servicio
app.get('/', (req, res) => {
  res.json({
    message: 'Auth Service running'
  });
});

export default app;