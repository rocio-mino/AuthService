import {
  getUsersWithRoles,
  createAuth0User
} from '../services/auth0ManagementService.js';

// Obtiene usuarios desde Auth0 junto a sus roles
export const getUsers = async (req, res) => {

  try {

    const users = await getUsersWithRoles();

    res.json(users);

  } catch (error) {

    console.error(
      error.response?.data || error.message
    );

    res.status(500).json({
      message: 'Error obteniendo usuarios',
      error: error.response?.data || error.message
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
        message:
          'email, password y name son obligatorios'
      });

    }

    const user = await createAuth0User(
      email,
      password,
      name
    );

    return res.status(201).json({

      message: 'Usuario creado correctamente',

      user: {
        user_id: user.user_id,
        email: user.email,
        name: user.name
      }

    });

  } catch (error) {

    const details =
      error.response?.data || error.message;

    const status =
      error.response?.status || 500;

    console.error(details);

    return res.status(status).json({

      message: 'Error creando usuario',

      error: details

    });

  }

};