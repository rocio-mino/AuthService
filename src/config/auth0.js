import { auth } from 'express-oauth2-jwt-bearer';

// Middleware para verificar el token JWT en las solicitudes protegidas
const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: 'RS256'
});

export default checkJwt;