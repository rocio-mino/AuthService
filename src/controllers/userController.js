import axios from 'axios';

import getManagementToken from '../services/auth0ManagementService.js';

// Obtiene la lista de usuarios desde Auth0
export const getUsers = async (req, res) => {

  try {

    // Token interno para Management API
    const token = await getManagementToken();

    // Consulta usuarios en Auth0
    const response = await axios.get(
      `https://${process.env.AUTH0_DOMAIN}/api/v2/users`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    res.json(response.data);

  } catch (error) {

    console.error(error.response?.data || error.message);

    res.status(500).json({
      message: 'Error obteniendo usuarios',
      error: error.response?.data || error.message
    });

  }

};