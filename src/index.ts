import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import { Fairytale } from "./entities/Fairytale";
import { Book } from "./entities/Book";
import 'dotenv/config'

// dotenv.config({ path: __dirname + '/.env' })

const PORT = 3003;

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static("public"));

mongoose.connect(process.env.MONGO_URI as string)

// Отримати список всіх казок та фільтрувати за query параметрами
app.get("/fairytales", Fairytale.getAllFairytales);

// Отримати окрему казку за ідентифікатором
app.get("/fairytales/:id", Fairytale.getFairytaleById);

// Створити нову казку
app.post("/fairytales", Fairytale.createFairytale);

// Видалити казку за ідентифікатором
app.delete("/fairytales/:id", Fairytale.deleteFairytale);

// Оновити казку за ідентифікатором
app.put("/fairytales/:id", Fairytale.updateFairytale);

// GET метод для отримання списку всіх книг та пагінації
app.get("/books", Book.getAllBooks);

// GET метод для отримання окремої книги за ідентифікатором
app.get("/books/:id", Book.getBookById);

// POST метод для створення нової книги
app.post("/books", Book.createBook);

// DELETE метод для видалення книги за ідентифікатором
app.delete("/books/:id", Book.deleteBook);

// PUT метод для оновлення книги за ідентифікатором
app.put("/books/:id", Book.updateBook);

// Запуск сервера
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
