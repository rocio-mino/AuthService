import { getUsersWithRoles } from '../services/auth0ManagementService.js';

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