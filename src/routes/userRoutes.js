import express from "express";

import checkJwt from "../middlewares/authMiddleware.js";

import {
  getUsers,
  createUser,
  updateUser,
  patchUser,
  deleteUser,
  searchUsers,
} from "../controllers/userController.js";

const router = express.Router();

// Endpoint para listar usuarios
router.get("/", checkJwt, getUsers);
router.post("/", checkJwt, createUser);
router.put("/:id", checkJwt, updateUser);
router.patch("/:id", checkJwt, patchUser);
router.delete("/:id", checkJwt, deleteUser);
router.get("/search", checkJwt, searchUsers);

export default router;
