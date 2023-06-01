import { Request, Response } from "express";import { generateId, IPagination } from "../utils";
import mongoose, { Schema } from "mongoose";

// Створення схеми для книги
const bookSchema = new Schema({
	title: String,
	author: String,
	pages: Number,
});

// Модель книги
const BookModel = mongoose.model("Book", bookSchema);

export class Book {
	id: string;
	title: string;
	author: string;
	pages: number;

	constructor({
		id,
		title,
		author,
		pages,
	}: {
		id?: string;
		title: string;
		author: string;
		pages: number;
	}) {
		this.id = id || generateId();
		this.title = title;
		this.author = author;
		this.pages = pages;
	}

	// Отримати список всіх книг
	static async getAllBooks(
		req: Request<never, never, never, IPagination>,
		res: Response
	) {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;

		const startIndex = (page - 1) * limit; // Індекс першого елемента на поточній сторінці

		const total = await BookModel.countDocuments(); // Загальна кількість казок

		const books = await BookModel.find()
			.skip(startIndex) // Пропустити елементи перед поточним індексом
			.limit(limit) // Обмежити кількість елементів на сторінці
			.exec();

		res.render("books", {
			books,
			currentPage: page,
			totalPages: Math.ceil(total / limit),
		});
	}

	// Отримати окрему книгу за ідентифікатором
	static async getBookById(req: Request, res: Response) {
		try {
			const { id } = req.params;

			const book = await BookModel.findById(id);
			if (!book) {
				return res.status(404).json({ error: "Book not found" });
			}

			res.render("book", { book });
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Internal server error" });
		}
	}

	// Створити нову книгу
	static async createBook(req: Request, res: Response) {
		try {
			const { title, author, pages } = req.body;
			if (!title || !author || !pages) {
				return res
					.status(400)
					.json({ error: "Title, author, and pages are required fields" });
			}
			const book = new BookModel({ title, author, pages });
			await book.save();
			res.redirect(`/books/${book.id}`);
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Internal server error" });
		}
	}

	// Видалити книгу за ідентифікатором
	static async deleteBook(req: Request, res: Response) {
		try {
			const { id } = req.params;
			await BookModel.findByIdAndRemove(id);
			res.redirect("/books");
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Internal server error" });
		}
	}

	// Оновити книгу за ідентифікатором
	static async updateBook(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { title, author, pages } = req.body;
			const book = await BookModel.findByIdAndUpdate(
				id,
				{ title, author, pages },
				{ new: true }
			);
			if (!book) {
				return res.status(404).json({ error: "Book not found" });
			}
			res.render("book", { book });
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Internal server error" });
		}
	}
}