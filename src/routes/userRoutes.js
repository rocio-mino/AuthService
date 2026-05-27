import express from 'express';

import checkJwt from '../middlewares/authMiddleware.js';

import { getUsers, createUser } from '../controllers/userController.js';

const router = express.Router();

// Endpoint para listar usuarios
router.get('/', checkJwt, getUsers);
router.post('/', checkJwt, createUser);

export default router;