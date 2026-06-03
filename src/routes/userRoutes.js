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

import {
  validateCreateUser,
  validateSearchUser,
  validateUserId,
} from "../validations/userValidation.js";

const router = express.Router();

router.get("/search", checkJwt, validateSearchUser, searchUsers);

router.get("/", checkJwt, getUsers);

router.post("/", checkJwt, validateCreateUser, createUser);

router.put("/:id", checkJwt, validateUserId, updateUser);

router.patch("/:id", checkJwt, validateUserId, patchUser);

router.delete("/:id", checkJwt, validateUserId, deleteUser);

export default router;
