import axios from 'axios';

// Obtiene un token para consumir la Management API
const getManagementToken = async () => {

  const response = await axios.post(
    `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
    {
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: process.env.AUTH0_MANAGEMENT_AUDIENCE,
      grant_type: 'client_credentials'
    }
  );

  return response.data.access_token;
};

export default getManagementToken;