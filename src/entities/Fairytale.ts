import { Request, Response } from "express";
import { generateId, IPagination } from "../utils";
import mongoose, { Schema } from "mongoose";

// Створення схеми для казки
const fairytaleSchema = new Schema({
	title: String,
	rating: Number,
	description: String,
});

// Модель казки
const FairytaleModel = mongoose.model("Fairytale", fairytaleSchema);

// Сутність 1: Fairytale
export class Fairytale {
	id: string;
	title: string;
	rating: number;
	description: string;

	constructor({
		id,
		title,
		rating,
		description,
	}: {
		id?: string;
		title: string;
		rating: number;
		description: string;
	}) {
		this.id = id || generateId();
		this.title = title;
		this.rating = rating;
		this.description = description || "";
	}

	// Отримати список всіх казок
	static async getAllFairytales(
		req: Request<never, never, never, IPagination>,
		res: Response
	) {
		try {
			const page = parseInt(req.query.page) || 1;
			const limit = parseInt(req.query.limit) || 10;

			const startIndex = (page - 1) * limit; // Індекс першого елемента на поточній сторінці

			const total = await FairytaleModel.countDocuments(); // Загальна кількість казок

			const fairytales = await FairytaleModel.find()
				.skip(startIndex) // Пропустити елементи перед поточним індексом
				.limit(limit) // Обмежити кількість елементів на сторінці
				.exec();

			res.render("fairytales", {
				fairytales,
				currentPage: page,
				totalPages: Math.ceil(total / limit),
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Internal server error" });
		}
	}

	// Отримати окрему казку за ідентифікатором
	static async getFairytaleById(req: Request, res: Response) {
		try {
			const { id } = req.params;

			const fairytale = await FairytaleModel.findById(id);
			if (!fairytale) {
				return res.status(404).json({ error: "Fairytale not found" });
			}

			res.render("fairytale", { fairytale });
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Internal server error" });
		}
	}

	// Створити нову казку
	static async createFairytale(req: Request, res: Response) {
		try {
			const { title, rating, description } = req.body;
			if (!title || !rating) {
				return res
					.status(400)
					.json({ error: "Title and rating are required fields" });
			}
			const fairytale = new FairytaleModel({ title, rating, description });
			await fairytale.save();
			res.redirect(`/fairytales/${fairytale.id}`);
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Internal server error" });
		}
	}

	// Видалити казку за ідентифікатором
	static async deleteFairytale(req: Request, res: Response) {
		try {
			const { id } = req.params;
			await FairytaleModel.findByIdAndRemove(id);
			res.redirect("/fairytales");
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Internal server error" });
		}
	}

	// Оновити казку за ідентифікатором
	static async updateFairytale(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { title, rating, description } = req.body;
			const fairytale = await FairytaleModel.findByIdAndUpdate(
				id,
				{ title, rating, description },
				{ new: true }
			);
			if (!fairytale) {
				return res.status(404).json({ error: "Fairytale not found" });
			}

			res.render("fairytale", { fairytale });
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Internal server error" });
		}
	}
}