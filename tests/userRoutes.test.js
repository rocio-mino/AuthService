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