import express from 'express';

import checkJwt from '../middlewares/authMiddleware.js';

import { getUsers } from '../controllers/userController.js';

const router = express.Router();

// Endpoint para listar usuarios
router.get('/', checkJwt, getUsers);

export default router;