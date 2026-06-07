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
    const page = Number.parseInt(req.query.page ?? "0", 10);
    const limit = Number.parseInt(req.query.limit ?? "10", 10);

    const { users, pagination } = await getUsersWithRoles({
      page: Number.isNaN(page) ? 0 : page,
      limit: Number.isNaN(limit) ? 10 : limit,
    });

    return res.json({
      users,
      pagination,
    });
  } catch (error) {
    const details = error.response?.data || error.message;
    const status = error.response?.status || 500;

    return res.status(status).json({
      message: "Error obteniendo usuarios",
      error: details,
    });
  }
};

// Crea un nuevo usuario en Auth0
export const createUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

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
      user: updatedUser,
    });
  } catch (error) {
    const details = error.response?.data || error.message;
    const status = error.response?.status || 500;

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
      user: updatedUser,
    });
  } catch (error) {
    const details = error.response?.data || error.message;
    const status = error.response?.status || 500;

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

    const users = await findUsersByUsername(username);

    return res.json(users);
  } catch (error) {
    const details = error.response?.data || error.message;
    const status = error.response?.status || 500;

    return res.status(status).json({
      message: "Error buscando usuarios",
      error: details,
    });
  }
};
