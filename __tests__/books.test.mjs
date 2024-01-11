import request from "supertest";
import app from "../app.mjs";
import sequelize from "../database/connection.mjs";

describe("BooksController", () => {
  let token;
  let bookId;
  beforeAll(async () => {
    const mockBorrower = {
      name: "testBorrower",
      email: "testBorrower1@example.com",
      password: "Test@1234",
    };

    let res = await request(app).post("/borrowers").send(mockBorrower);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("data");

    res = await request(app).post("/auth/login").send({
      email: "testBorrower1@example.com",
      password: "Test@1234",
    });

    expect(res.status).toBe(200);
    token = res.body.data.token;
  });

  describe("createBook", () => {
    it("should throw an error if the schema validation fails", async () => {
      const mockBook = {
        title: "book 1",
        author: "Esraa",
        availableQuantity: 0,
        shelfLocation: "1st",
      };

      const res = await request(app)
        .post("/books")
        .send(mockBook)
        .set("Authorization", "Bearer " + token);

      expect(res.status).toBe(400);
    });

    it("should create a new book ", async () => {
      const mockBook = {
        title: "book 1",
        author: "Esraa",
        ISBN: "0",
        availableQuantity: 0,
        shelfLocation: "1st",
      };

      const res = await request(app)
        .post("/books")
        .send(mockBook)
        .set("Authorization", "Bearer " + token);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("data");
    });
  });

  describe("getBooks", () => {
    it("should get the last 20 (default) books for the current user", async () => {
      const res = await request(app)
        .get("/books")
        .send(null)
        .set("Authorization", "Bearer " + token);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("data");

      bookId = res.body.data.rows[0].id;
    });
  });

  describe("getBook", () => {
    it("should throw an error if the id is invalid", async () => {
      const bookId = "1234";

      const res = await request(app)
        .get(`/books/${bookId}`)
        .send(null)
        .set("Authorization", "Bearer " + token);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("should throw an error if the book not found", async () => {
      const bookId = "a91c6e5c-2c58-4794-b68d-b39a249cc08a";

      const res = await request(app)
        .get(`/books/${bookId}`)
        .send(null)
        .set("Authorization", "Bearer " + token);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error");
    });

    it("should return the book", async () => {
      const res = await request(app)
        .get(`/books/${bookId}`)
        .send(null)
        .set("Authorization", "Bearer " + token);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("data");
    });
  });

  describe("updateBook", () => {
    it("should throw an error if the id is invalid", async () => {
      const bookId = "1234";
      const mockBook = {
        title: "book 1",
        author: "Esraa",
        ISBN: "0",
        availableQuantity: 0,
        shelfLocation: "1st",
      };

      const res = await request(app)
        .put(`/books/${bookId}`)
        .send(mockBook)
        .set("Authorization", "Bearer " + token);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("should throw an error if the book not found", async () => {
      const bookId = "a91c6e5c-2c58-4794-b68d-b39a249cc08a";
      const mockBook = {
        title: "book 1",
        author: "Esraa",
        ISBN: "1",
        availableQuantity: 10,
        shelfLocation: "1st",
      };

      const res = await request(app)
        .put(`/books/${bookId}`)
        .send(mockBook)
        .set("Authorization", "Bearer " + token);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error");
    });

    it("should throw an error if the schema validation fails", async () => {
      const mockBook = {
        title: "book 1",
        author: 0,
        ISBN: "0",
        availableQuantity: 0,
        shelfLocation: "1st",
      };

      const res = await request(app)
        .put(`/books/${bookId}`)
        .send(mockBook)
        .set("Authorization", "Bearer " + token);

      expect(res.status).toBe(400);
    });

    it("should update book by id ", async () => {
      const mockBook = {
        title: "book 1",
        author: "Esraa",
        ISBN: "0",
        availableQuantity: 0,
        shelfLocation: "1st",
      };

      const res = await request(app)
        .put(`/books/${bookId}`)
        .send(mockBook)
        .set("Authorization", "Bearer " + token);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("data");
    });
  });

  describe("deleteBook", () => {
    it("should throw an error if the id is invalid", async () => {
      const bookId = "1234";

      const res = await request(app)
        .delete(`/books/${bookId}`)
        .send(null)
        .set("Authorization", "Bearer " + token);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("should throw an error if the book not found", async () => {
      const bookId = "a91c6e5c-2c58-4794-b68d-b39a249cc08a";

      const res = await request(app)
        .delete(`/books/${bookId}`)
        .send(null)
        .set("Authorization", "Bearer " + token);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error");
    });

    it("should delete book by id ", async () => {
      const res = await request(app)
        .delete(`/books/${bookId}`)
        .send(null)
        .set("Authorization", "Bearer " + token);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("data");
    });
  });
});

afterAll(() => {
  sequelize.close();
});
