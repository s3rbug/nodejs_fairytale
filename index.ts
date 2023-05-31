import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import * as uuid from "uuid";
import methodOverride from "method-override"

const PORT = 3003;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

app.set('view engine', 'ejs');

app.use('/public', express.static('public'));

interface IPagination {
	page: string;
	items_per_page: string;
}

// Сутність 1: Fairytale
class Fairytale {
	id: string;
	title: string;
	rating: number;
  description: string;

	constructor({
		id,
		title,
		rating,
    description
	}: {
		id?: string;
		title: string;
		rating: number;
    description: string;
	}) {
		this.id = id || generateId();
		this.title = title;
		this.rating = rating;
    this.description = description || ""
	}

	// Отримати список всіх казок
	static getAllFairytales(
		req: Request<never, never, never, IPagination>,
		res: Response
	) {
    const page = parseInt(req.query.page)
    const items_per_page = parseInt(req.query.items_per_page)

		const fairytales = getPaginatedResults(
			fairytalesData,
			page,
			items_per_page
		);
    
		res.render('fairytales', { fairytales: fairytales.results });
	}

	// Отримати окрему казку за ідентифікатором
	static getFairytaleById(req: Request, res: Response) {
		const { id } = req.params;
    
		const fairytale = fairytalesData.find((f) => f.id === id);
		if (!fairytale) {
			return res.status(404).json({ error: "Fairytale not found" });
		}
    
		res.render('fairytale', { fairytale });
	}

	// Створити нову казку
	static createFairytale(req: Request, res: Response) {
		const { title, rating, description } = req.body;
		if (!title || !rating) {
			return res
				.status(400)
				.json({ error: "Title and rating are required fields" });
		}
		const fairytale = new Fairytale({ title, rating, description });
		fairytalesData.push(fairytale);
    res.redirect(`/fairytales/${fairytale.id}`);
	}

	// Видалити казку за ідентифікатором
	static deleteFairytale(req: Request, res: Response) {
		const { id } = req.params;
		const index = fairytalesData.findIndex((f) => f.id === id);
		if (index === -1) {
			return res.status(404).json({ error: "Fairytale not found" });
		}
		fairytalesData.splice(index, 1);
		res.redirect("/fairytales")
	}

	// Оновити казку за ідентифікатором
	static updateFairytale(req: Request, res: Response) {
		const { id } = req.params;
		const { title, rating, description } = req.body;
		const fairytale = fairytalesData.find((f) => f.id === id);

		if (!fairytale) {
			return res.status(404).json({ error: "Fairytale not found" });
		}

		fairytale.title = title || fairytale.title;
		fairytale.rating = rating || fairytale.rating;
		fairytale.description = description || fairytale.description;

		console.log(fairytale);
		
    
    res.render('fairytale', { fairytale });
	}
}

// Мінімум три сутності
const fairytalesData = [
	new Fairytale({
		id: "22658002-9b1e-48ed-bc4e-4aaf382bb647",
		title: "Fairytale 1",
    description: "Fairytale 1 Description",
		rating: 4,
	}),
	new Fairytale({
		id: "0bee7877-bfb5-4579-8a9e-3a2d65216b1c",
		title: "Fairytale 2",
    description: "Fairytale 2 Description",
		rating: 3.1,
	}),
	new Fairytale({
		id: "c8010fc3-c0ea-434a-a2cc-8db51821672c",
		title: "Fairytale 3",
    description: "Fairytale 3 Description",
		rating: 5,
	}),
];

// Функція для генерації унікального ідентифікатора
function generateId(): string {
	return uuid.v4();
}

interface IPaginatedData {
  results: Fairytale[],
  currentPage: number,
  totalPages: number
}

// Функція для пагінації результатів
function getPaginatedResults(
	data: Fairytale[],
	page: number,
	itemsPerPage: number
): IPaginatedData {
	const currentPage = page || 1;
	const perPage = itemsPerPage || 10;
	const startIndex = (currentPage - 1) * perPage;
	const endIndex = startIndex + perPage;
	const results = data.slice(startIndex, endIndex);

	return {
		results,
		currentPage,
		totalPages: Math.ceil(data.length / perPage),
	};
}

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

// Запуск сервера
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
