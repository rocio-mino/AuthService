import dotenv from 'dotenv';

dotenv.config();// Carga variables de entorno

const { default: app } = await import('./src/app.js');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});