const request = require("supertest");
const server = require("../index");

describe("Operaciones CRUD de cafes", () => {

    it("Devuelve status code 200, tipo de dato recibido es un arreglo por lo menos 1 objeto", async () => {
        const {body, status } = await request(server).get("/cafes").send();
        expect(status).toBe(200);
        expect(body).toBeInstanceOf(Array);
        expect(body.length).toBeGreaterThanOrEqual(1);
    });

    it("404 al intentar eliminar un café con un id que no existe", async () => {
        const jwt = "token";
        const idToDelete = 10;
        const { statusCode } = await request(server)
                                    .delete(`/cafes/${idToDelete}`)
                                    .set("Authorization", jwt)
                                    .send();
        expect(statusCode).toBe(404);
    });

    it("Agregar nuevo cafe y devolver codigo 201", async () => {
        const id = Math.floor(Math.random() * 999);
        const cafe = { id, nombre: "Nuevo Café" };
        const { body: cafes, statusCode } = await request(server)
                                                    .post("/cafes")
                                                    .send(cafe);
        expect(cafes).toContainEqual(cafe);
        expect(statusCode).toBe(201);
    });

    it("Obtener codigo 400 al intentar actualizar un café enviando id diferente al id del payload", async () => {
        const actualizarCafe = { id: 1, nombre: "Cortado" };
        const response = await request(server)
                                    .put("/cafes/2")
                                    .send(actualizarCafe);
        const statusCode = response.statusCode;
        expect(statusCode).toBe(400);
    });
});