import express from "express";import mongoose from "mongoose";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import "dotenv/config";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import fairytalesRouter from "./fairytales.router";
import booksRouter from "./books.router";

const PORT = process.env.PORT || 3000;

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static("public"));

const swaggerOptions = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Fairytales API",
			description: "API documentation for fairytales website",
			version: "1.0.0",
		},
		servers: [
			{
				url: `http://localhost:${PORT}/books`,
			},
		],
	},
	apis: ["src/books.router.ts", "src/fairytales.router.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

mongoose.connect(process.env.MONGO_URI as string);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/fairytales", fairytalesRouter);
app.use("/books", booksRouter);

// Запуск сервера
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
