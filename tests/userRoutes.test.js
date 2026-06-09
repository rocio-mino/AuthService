import { jest } from "@jest/globals";

// Mock del middleware JWT
jest.unstable_mockModule("../src/middlewares/authMiddleware.js", () => ({
  default: (req, res, next) => next(),
}));

// Mock del servicio Auth0
jest.unstable_mockModule("../src/services/auth0ManagementService.js", () => ({
  getUsersWithRoles: jest.fn().mockResolvedValue({
    users: [
      {
        user_id: "auth0|123",
        email: "rocio@test.com",
        name: "Rocio",
        roles: ["Admin"],
      },
    ],
    pagination: {
      page: 0,
      limit: 10,
      total: 1,
      totalPages: 1,
    },
  }),

  createAuth0User: jest.fn(),
  updateAuth0User: jest.fn(),
  patchAuth0User: jest.fn(),
  deleteAuth0User: jest.fn(),
  findUsersByUsername: jest.fn(),
}));

const { default: request } = await import("supertest");
const { default: app } = await import("../src/app.js");

// Función real para obtener usuarios con roles (sin mock)
describe("GET /api/users", () => {
  test("debe obtener una lista de usuarios", async () => {
    const response = await request(app).get("/api/users");

    expect(response.statusCode).toBe(200);

    expect(response.body).toHaveProperty("users");

    expect(response.body).toHaveProperty("pagination");

    expect(Array.isArray(response.body.users)).toBe(true);

    expect(response.body.users).toHaveLength(1);

    expect(response.body.users[0].email).toBe("rocio@test.com");
  });
});

describe("POST /api/users", () => {
  test("debe crear un usuario correctamente", async () => {
    const { createAuth0User } =
      await import("../src/services/auth0ManagementService.js");
    // Simula la creación del usuario en Auth0
    createAuth0User.mockResolvedValue({
      user_id: "auth0|999",
      email: "nuevo@test.com",
      name: "Nuevo Usuario",
    });

    const response = await request(app).post("/api/users").send({
      email: "nuevo@test.com",
      password: "Password123*",
      name: "Nuevo Usuario",
    });

    expect(response.statusCode).toBe(201);

    expect(response.body.message).toBe("Usuario creado correctamente");

    expect(response.body.user.email).toBe("nuevo@test.com");
  });
});

describe("POST /api/users - validaciones", () => {
  test("debe rechazar datos inválidos", async () => {
    // No se envían datos o se envían datos vacíos
    const response = await request(app).post("/api/users").send({
      email: "",
      password: "",
      name: "",
    });

    expect(response.statusCode).toBe(400);
  });
});

describe("POST /api/users - email inválido", () => {
  test("debe rechazar un email inválido", async () => {
    // Se envía un email con formato inválido
    const response = await request(app).post("/api/users").send({
      email: "correoinvalido",
      password: "Password123",
      name: "Rocio",
    });

    expect(response.statusCode).toBe(400);

    expect(response.body.message).toBe("Email inválido");
  });
});

describe("POST /api/users - error", () => {
  test("debe retornar 500 cuando falla la creaciÃ³n del usuario", async () => {
    const { createAuth0User } =
      await import("../src/services/auth0ManagementService.js");

    createAuth0User.mockRejectedValue(new Error("Error interno"));

    const response = await request(app).post("/api/users").send({
      email: "nuevo@test.com",
      password: "Password123*",
      name: "Nuevo Usuario",
    });

    expect(response.statusCode).toBe(500);

    expect(response.body.message).toBe("Error creando usuario");
  });
});

describe("GET /api/users - paginación", () => {
  test("debe rechazar un page negativo", async () => {
    const response = await request(app).get("/api/users?page=-1&limit=10");

    expect(response.statusCode).toBe(400);

    expect(response.body.message).toBe(
      "page debe ser un numero mayor o igual a 0",
    );
  });
});

describe("GET /api/users - error", () => {
  test("debe retornar 500 cuando ocurre un error obteniendo usuarios", async () => {
    const { getUsersWithRoles } =
      await import("../src/services/auth0ManagementService.js");

    getUsersWithRoles.mockRejectedValue(new Error("Error interno"));

    const response = await request(app).get("/api/users");

    expect(response.statusCode).toBe(500);

    expect(response.body.message).toBe("Error obteniendo usuarios");
  });
});

describe("PUT /api/users/:id", () => {
  test("debe actualizar un usuario", async () => {
    const { updateAuth0User } =
      await import("../src/services/auth0ManagementService.js");
    // Simula la actualización del usuario en Auth0
    updateAuth0User.mockResolvedValue({
      user_id: "auth0|123",
      email: "actualizado@test.com",
      name: "Usuario Actualizado",
    });
    // Se actualizan email y nombre
    const response = await request(app).put("/api/users/auth0|123").send({
      email: "actualizado@test.com",
      name: "Usuario Actualizado",
    });

    expect(response.statusCode).toBe(200);

    expect(response.body.message).toBe("Usuario actualizado correctamente");

    expect(response.body.user.email).toBe("actualizado@test.com");
  });
});

describe("PUT /api/users/:id - id inválido", () => {
  test("debe rechazar un id inválido", async () => {
    const response = await request(app).put("/api/users/@@@").send({
      name: "Nuevo Nombre",
    });

    expect(response.statusCode).toBe(400);

    expect(response.body.message).toBe("ID inválido");
  });
});

describe("PUT /api/users/:id - error", () => {
  test("debe retornar 500 cuando falla la actualizaciÃ³n", async () => {
    const { updateAuth0User } =
      await import("../src/services/auth0ManagementService.js");

    updateAuth0User.mockRejectedValue(new Error("Error interno"));

    const response = await request(app).put("/api/users/auth0|123").send({
      name: "Nuevo Nombre",
    });

    expect(response.statusCode).toBe(500);

    expect(response.body.message).toBe("Error actualizando usuario");
  });
});

describe("PATCH /api/users/:id", () => {
  test("debe actualizar parcialmente un usuario", async () => {
    const { patchAuth0User } =
      await import("../src/services/auth0ManagementService.js");
    // Simula la actualización parcial del usuario en Auth0
    patchAuth0User.mockResolvedValue({
      user_id: "auth0|123",
      name: "Nuevo Nombre",
    });
    // Solo se actualiza el nombre
    const response = await request(app).patch("/api/users/auth0|123").send({
      name: "Nuevo Nombre",
    });

    expect(response.statusCode).toBe(200);

    expect(response.body.message).toBe("Usuario actualizado parcialmente");

    expect(response.body.user.name).toBe("Nuevo Nombre");
  });
});

describe("PATCH /api/users/:id - error", () => {
  test("debe retornar 500 cuando falla la actualizaciÃ³n parcial", async () => {
    const { patchAuth0User } =
      await import("../src/services/auth0ManagementService.js");

    patchAuth0User.mockRejectedValue(new Error("Error interno"));

    const response = await request(app).patch("/api/users/auth0|123").send({
      name: "Nuevo Nombre",
    });

    expect(response.statusCode).toBe(500);

    expect(response.body.message).toBe("Error actualizando usuario");
  });
});

describe("DELETE /api/users/:id", () => {
  test("debe eliminar un usuario", async () => {
    const { deleteAuth0User } =
      await import("../src/services/auth0ManagementService.js");

    //simula la eliminación del usuario en Auth0
    deleteAuth0User.mockResolvedValue();

    const response = await request(app).delete("/api/users/auth0|123");

    expect(response.statusCode).toBe(200);

    expect(response.body.message).toBe("Usuario eliminado correctamente");
  });
});

describe("DELETE /api/users/:id - error", () => {
  test("debe retornar 500 cuando falla la eliminaciÃ³n", async () => {
    const { deleteAuth0User } =
      await import("../src/services/auth0ManagementService.js");

    deleteAuth0User.mockRejectedValue(new Error("Error interno"));

    const response = await request(app).delete("/api/users/auth0|123");

    expect(response.statusCode).toBe(500);

    expect(response.body.message).toBe("Error eliminando usuario");
  });
});

describe("GET /api/users/search", () => {
  test("debe buscar usuarios por username", async () => {
    const { findUsersByUsername } =
      await import("../src/services/auth0ManagementService.js");
    // Simula la búsqueda de usuarios en Auth0
    findUsersByUsername.mockResolvedValue([
      {
        user_id: "auth0|123",
        email: "rocio@test.com",
        name: "Rocio",
      },
    ]);

    // Se busca por username "rocio"
    const response = await request(app).get("/api/users/search?username=rocio");

    expect(response.statusCode).toBe(200);

    expect(Array.isArray(response.body)).toBe(true);

    expect(response.body[0].email).toBe("rocio@test.com");
  });

  test("debe rechazar la búsqueda sin username", async () => {
    const response = await request(app).get("/api/users/search");

    expect(response.statusCode).toBe(400);

    expect(response.body).toHaveProperty("message");
  });
});

describe("GET /api/users/search - error", () => {
  test("debe retornar 500 cuando falla la bÃºsqueda", async () => {
    const { findUsersByUsername } =
      await import("../src/services/auth0ManagementService.js");

    findUsersByUsername.mockRejectedValue(new Error("Error interno"));

    const response = await request(app).get("/api/users/search?username=rocio");

    expect(response.statusCode).toBe(500);

    expect(response.body.message).toBe("Error buscando usuarios");
  });
});
