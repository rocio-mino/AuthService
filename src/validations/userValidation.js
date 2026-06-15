export const regex = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,

  name: /^[a-zA-ZÀ-ÿ\s]{2,50}$/,

  username: /^[a-zA-Z0-9._-]{1,30}$/,

  auth0Id: /^[a-zA-Z0-9|_-]+$/,
};

export const validateCreateUser = (req, res, next) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({
      message: "email, password y name son obligatorios",
    });
  }

  if (!regex.email.test(email)) {
    return res.status(400).json({
      message: "Email inválido",
    });
  }

  if (!regex.password.test(password)) {
    return res.status(400).json({
      message:
        "Password debe tener 8 caracteres, mayúscula, minúscula y número",
    });
  }

  if (!regex.name.test(name)) {
    return res.status(400).json({
      message: "Nombre inválido",
    });
  }

  next();
};

export const validateSearchUser = (req, res, next) => {
  const { username } = req.query;

  if (!username?.trim()) {
    return res.status(400).json({
      message: "username requerido",
    });
  }

  if (!regex.username.test(username)) {
    return res.status(400).json({
      message: "username inválido",
    });
  }

  next();
};

export const validateUsersPagination = (req, res, next) => {
  const { page = "0", limit = "10" } = req.query; // limite 10 pero en el front se puede cambiar

  const parsedPage = Number.parseInt(page, 10);
  const parsedLimit = Number.parseInt(limit, 10);

  if (Number.isNaN(parsedPage) || parsedPage < 0) {
    return res.status(400).json({
      message: "page debe ser un numero mayor o igual a 0",
    });
  }

  if (Number.isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
    return res.status(400).json({
      message: "limit debe ser un numero entre 1 y 100",
    });
  }

  next(); // next() es para continuar con la siguiente funcion de middleware
};

export const validateUserId = (req, res, next) => {
  const { id } = req.params;

  if (!regex.auth0Id.test(id)) {
    return res.status(400).json({
      message: "ID inválido",
    });
  }

  next();
};
