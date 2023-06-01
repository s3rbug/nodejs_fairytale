/**
 * @swagger
 * tags:
 *   name: Книги
 *   description: Маршрути для книг
 */

import { Router } from "express"
import { Book } from "./entities/Book";

const booksRouter = Router()

/**
 * @swagger
 * /books:
 *   get:
 *     tags: [Книги]
 *     summary: Отримати список всіх книг
 *     responses:
 *       200:
 *         description: Успішне отримання списку книг
 *       500:
 *         description: Помилка на сервері
 *
 *   post:
 *     tags: [Книги]
 *     summary: Створити нову книгу
 *     responses:
 *       200:
 *         description: Успішне створення книги
 *       400:
 *         description: Некоректні дані запиту
 *       500:
 *         description: Помилка на сервері
 */
booksRouter.get("", Book.getAllBooks);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     tags: [Книги]
 *     summary: Отримати книгу за ідентифікатором
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Ідентифікатор книги
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Успішне отримання книги
 *       404:
 *         description: Книга не знайдена
 *       500:
 *         description: Помилка на сервері
 *
 *   put:
 *     tags: [Книги]
 *     summary: Оновити книгу за ідентифікатором
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Ідентифікатор книги
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Назва книги
 *               author:
 *                 type: string
 *                 description: Автор книги
 *               pages:
 *                 type: integer
 *                 description: Кількість сторінок у книзі
 *               categories:
 *                 type: array
 *                 description: Список категорій книги
 *                 items:
 *                   type: string
 *               newCategories:
 *                 type: array
 *                 description: Список нових категорій книги
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Успішне оновлення книги
 *       400:
 *         description: Некоректні дані запиту
 *       404:
 *         description: Книга не знайдена
 *       500:
 *         description: Помилка на сервері
 *
 *   delete:
 *     tags: [Книги]
 *     summary: Видалити книгу за ідентифікатором
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Ідентифікатор книги
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Успішне видалення книги
 *       404:
 *         description: Книга не знайдена
 *       500:
 *         description: Помилка на сервері
 */
booksRouter.get("/:id", Book.getBookById);

booksRouter.post("", Book.createBook);

booksRouter.delete("/:id", Book.deleteBook);

booksRouter.put("/:id", Book.updateBook);

export default booksRouter
