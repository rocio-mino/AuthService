import axios from "axios";

// Obtiene token para consumir la Management API
const getManagementToken = async () => {
  const response = await axios.post(
    `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
    {
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: process.env.AUTH0_MANAGEMENT_AUDIENCE,
      grant_type: "client_credentials",
    },
  );

  return response.data.access_token;
};

// Obtiene usuarios junto a sus roles
export const getUsersWithRoles = async () => {
  const token = await getManagementToken();

  // Obtiene usuarios
  const usersResponse = await axios.get(
    `https://${process.env.AUTH0_DOMAIN}/api/v2/users`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const users = usersResponse.data;

  // Obtiene roles por cada usuario
  const usersWithRoles = await Promise.all(
    users.map(async (user) => {
      try {
        const rolesResponse = await axios.get(
          `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(user.user_id)}/roles`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const roles = rolesResponse.data.map((role) => role.name);

        return {
          ...user,
          roles,
        };
      } catch {
        return {
          ...user,
          roles: [],
        };
      }
    }),
  );

  return usersWithRoles;
};

// Crea usuario en Auth0
export const createAuth0User = async (email, password, name) => {
  const token = await getManagementToken();

  const response = await axios.post(
    `https://${process.env.AUTH0_DOMAIN}/api/v2/users`,
    {
      email,
      password,
      name,

      connection:
        process.env.AUTH0_DB_CONNECTION || "Username-Password-Authentication",

      email_verified: false,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
};

// Actualiza completamente usuario
export const updateAuth0User = async (id, userData) => {
  const token = await getManagementToken();

  const response = await axios.patch(
    `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(id)}`,
    userData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
};

// Actualiza parcialmente usuario
export const patchAuth0User = async (id, userData) => {
  const token = await getManagementToken();

  const response = await axios.patch(
    `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(id)}`,
    userData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
};

// Elimina usuario
export const deleteAuth0User = async (id) => {
  const token = await getManagementToken();

  await axios.delete(
    `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(id)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

// busca usuario por username o nombre
export const findUsersByUsername = async (username) => {
  const token = await getManagementToken();

  const response = await axios.get(
    `https://${process.env.AUTH0_DOMAIN}/api/v2/users`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: `nickname:*${username}*`, // el * es un wildcard para buscar coincidencias parciales
        search_engine: "v3", // v3 es el motor de busqueda recomendado para consultas avanzadas
      },
    },
  );

  return response.data;
};

export default getManagementToken;
