import { Request, Response } from "express";
import { generateId, IPagination } from "../utils";
import mongoose, { Schema } from "mongoose";

// Створення схеми для автора
const authorSchema = new Schema({
	name: String,
});

// Модель автора
const AuthorModel = mongoose.model("Author", authorSchema);

// Створення схеми для категорії
const categorySchema = new Schema({
	name: String,
});

// Модель категорії
const CategoryModel = mongoose.model("Category", categorySchema);

// Створення схеми для книги
const bookSchema = new Schema({
	title: String,
	author: {
		type: Schema.Types.ObjectId,
		ref: "Author",
	},
	pages: Number,
	categories: [
		{
			type: Schema.Types.ObjectId,
			ref: "Category",
		},
	],
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
			.populate("author") // Заповнити поле "author" з моделі "Author"
			.populate("categories") // Заповнити поле "categories" з моделі "Category"
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

			const book = await BookModel.findById(id)
				.populate("author") // Заповнити поле "author" з моделі "Author"
				.populate({
					path: "categories",
					model: "Category",
				}) // Заповнити поле "categories" з моделі "Category"
				.exec();

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

			// Check if author is a valid ObjectId
			let authorId = mongoose.Types.ObjectId.isValid(author) ? author : null;

			// If author is not a valid ObjectId, create a new author
			if (!authorId) {
				const newAuthor = new AuthorModel({ name: author });
				await newAuthor.save();
				authorId = newAuthor._id;
			}

			const book = new BookModel({
				title,
				author: authorId,
				pages,
			});
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
			const { title, author, pages, categories, newCategories } = req.body;

			const book = await BookModel.findById(id);
			if (!book) {
				return res.status(404).json({ error: "Book not found" });
			}

			book.title = title;

			// Update the author
			if (mongoose.Types.ObjectId.isValid(author)) {
				book.author = author; // Assign the valid ObjectId directly
			} else {
				// If author is not a valid ObjectId, assume it's a string and find or create the corresponding author
				let authorModel = await AuthorModel.findOne({ name: author });
				if (!authorModel) {
					authorModel = new AuthorModel({ name: author });
					await authorModel.save();
				}
				book.author = authorModel._id; // Assign the ObjectId of the author
			}

			book.pages = pages || 10;

			// Update existing categories
			if (Array.isArray(categories) && categories.length > 0) {
				// Convert category names to ObjectId references
				const categoryIds = await CategoryModel.find({
					name: { $in: categories },
				}).distinct("_id");
				book.categories = categoryIds;
			} else {
				book.categories = []; // Empty the categories array if it's not provided or empty
			}

			// Add new categories
			if (newCategories && Array.isArray(newCategories)) {
				for (const categoryName of newCategories) {
					let newCategory = await CategoryModel.findOne({ name: categoryName });

					if (!newCategory) {
						// If the category does not exist, create a new category
						newCategory = new CategoryModel({ name: categoryName });
						await newCategory.save();
					}

					// Add the ObjectId of the category to the book's categories
					book.categories.push(newCategory._id);
				}
			}

			await book.save();

			res.render("book", { book });
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Internal server error" });
		}
	}
}
