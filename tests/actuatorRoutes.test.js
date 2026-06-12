import express from "express";
import request from "supertest";
import actuatorRoutes from "../src/routes/actuatorRoutes.js";

const app = express();

app.use(express.json());
app.use("/actuator", actuatorRoutes);

describe("Actuator routes", () => {
  test("GET /actuator/health debería responder status UP", async () => {
    const response = await request(app).get("/actuator/health");

    expect(response.statusCode).toBe(200);

    expect(response.body.status).toBe("UP");
    expect(response.body.service).toBe("AuthService");
    expect(response.body.timestamp).toEqual(expect.any(String));
    expect(response.body.uptime).toEqual(expect.any(Number));

    expect(Number.isNaN(Date.parse(response.body.timestamp))).toBe(false);
    expect(response.body.uptime).toBeGreaterThanOrEqual(0);
  });
});
