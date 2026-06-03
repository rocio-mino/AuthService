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

export const validateUserId = (req, res, next) => {
  const { id } = req.params;

  if (!regex.auth0Id.test(id)) {
    return res.status(400).json({
      message: "ID inválido",
    });
  }

  next();
};
