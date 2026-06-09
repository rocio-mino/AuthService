import { jest } from "@jest/globals";

import {
  validateCreateUser,
  validateSearchUser,
  validateUsersPagination,
  validateUserId,
} from "../src/validations/userValidation.js";

describe("validateCreateUser", () => {
  test("debe llamar next() cuando los datos son válidos", () => {
    const req = {
      body: {
        email: "rocio@test.com",
        password: "Password123",
        name: "Rocio",
      },
    };

    const res = {};

    const next = jest.fn();

    validateCreateUser(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test("debe retornar 400 cuando faltan campos", () => {
    const req = {
      body: {},
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    validateCreateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      message: "email, password y name son obligatorios",
    });

    expect(next).not.toHaveBeenCalled();
  });

  test("debe retornar 400 cuando el email es inválido", () => {
    const req = {
      body: {
        email: "correo",
        password: "Password123",
        name: "Rocio",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    validateCreateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      message: "Email inválido",
    });
  });

  test("debe retornar 400 cuando la password es inválida", () => {
    const req = {
      body: {
        email: "rocio@test.com",
        password: "123",
        name: "Rocio",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    validateCreateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      message:
        "Password debe tener 8 caracteres, mayúscula, minúscula y número",
    });
  });

  test("debe retornar 400 cuando el nombre es inválido", () => {
    const req = {
      body: {
        email: "rocio@test.com",
        password: "Password123",
        name: "1",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    validateCreateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      message: "Nombre inválido",
    });
  });
});

describe("validateSearchUser", () => {
  test("debe llamar next() cuando username es válido", () => {
    const req = {
      query: {
        username: "rocio",
      },
    };

    const res = {};

    const next = jest.fn();

    validateSearchUser(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test("debe retornar 400 cuando username está vacío", () => {
    const req = {
      query: {},
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    validateSearchUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      message: "username requerido",
    });
  });

  test("debe retornar 400 cuando username es inválido", () => {
    const req = {
      query: {
        username: "@@@",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    validateSearchUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      message: "username inválido",
    });
  });
});

describe("validateUsersPagination", () => {
  test("debe llamar next() cuando page y limit son válidos", () => {
    const req = {
      query: {
        page: "0",
        limit: "10",
      },
    };

    const res = {};

    const next = jest.fn();

    validateUsersPagination(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test("debe retornar 400 cuando page es negativo", () => {
    const req = {
      query: {
        page: "-1",
        limit: "10",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    validateUsersPagination(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      message: "page debe ser un numero mayor o igual a 0",
    });
  });

  test("debe retornar 400 cuando limit es inválido", () => {
    const req = {
      query: {
        page: "0",
        limit: "200",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    validateUsersPagination(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      message: "limit debe ser un numero entre 1 y 100",
    });
  });
});

describe("validateUserId", () => {
  test("debe llamar next() cuando el id es válido", () => {
    const req = {
      params: {
        id: "auth0|123456",
      },
    };

    const res = {};

    const next = jest.fn();

    validateUserId(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test("debe retornar 400 cuando el id es inválido", () => {
    const req = {
      params: {
        id: "@@@",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    validateUserId(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      message: "ID inválido",
    });

    expect(next).not.toHaveBeenCalled();
  });
});
