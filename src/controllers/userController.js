import {
  getUsersWithRoles,
  createAuth0User,
  updateAuth0User,
  patchAuth0User,
  deleteAuth0User,
  findUsersByUsername,
} from "../services/auth0ManagementService.js";

// Obtiene usuarios desde Auth0 junto a sus roles
export const getUsers = async (req, res) => {
  try {
    const users = await getUsersWithRoles();

    res.json(users);
  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      message: "Error obteniendo usuarios",
      error: error.response?.data || error.message,
    });
  }
};

// Crea un nuevo usuario en Auth0
export const createUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validaciones básicas
    if (!email || !password || !name) {
      return res.status(400).json({
        message: "email, password y name son obligatorios",
      });
    }

    const user = await createAuth0User(email, password, name);

    return res.status(201).json({
      message: "Usuario creado correctamente",

      user: {
        user_id: user.user_id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    const details = error.response?.data || error.message;

    const status = error.response?.status || 500;

    console.error(details);

    return res.status(status).json({
      message: "Error creando usuario",

      error: details,
    });
  }
};

// Actualiza completamente usuario
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedUser = await updateAuth0User(id, req.body);

    return res.json({
      message: "Usuario actualizado correctamente",

      user: updatedUser,
    });
  } catch (error) {
    const details = error.response?.data || error.message;

    const status = error.response?.status || 500;

    console.error(details);

    return res.status(status).json({
      message: "Error actualizando usuario",

      error: details,
    });
  }
};

// Actualiza parcialmente usuario
export const patchUser = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedUser = await patchAuth0User(id, req.body);

    return res.json({
      message: "Usuario actualizado parcialmente",

      user: updatedUser,
    });
  } catch (error) {
    const details = error.response?.data || error.message;

    const status = error.response?.status || 500;

    console.error(details);

    return res.status(status).json({
      message: "Error actualizando usuario",

      error: details,
    });
  }
};

// Elimina usuario
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteAuth0User(id);

    return res.json({
      message: "Usuario eliminado correctamente",
    });
  } catch (error) {
    const details = error.response?.data || error.message;

    const status = error.response?.status || 500;

    console.error(details);

    return res.status(status).json({
      message: "Error eliminando usuario",

      error: details,
    });
  }
};

// busca usuarios por username
export const searchUsers = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username?.trim()) {
      return res.status(400).json({
        message: "username es requerido",
      });
    }

    const users = await findUsersByUsername(username);

    return res.json(users);
  } catch (error) {
    const details = error.response?.data || error.message;

    const status = error.response?.status || 500;

    console.error(details);

    return res.status(status).json({
      message: "Error buscando usuarios",
      error: details,
    });
  }
};
