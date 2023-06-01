/**
 * @swagger
 * tags:
 *   name: Казки
 *   description: Маршрути для казок
 */

import { Router } from "express";
import { Fairytale } from "./entities/Fairytale";

/**
 * @swagger
 * /fairytales:
 *   get:
 *     tags: [Казки]
 *     summary: Отримати список всіх казок
 *     responses:
 *       200:
 *         description: Успішне отримання списку казок
 *       500:
 *         description: Помилка на сервері
 *
 *   post:
 *     tags: [Казки]
 *     summary: Створити нову казку
 *     responses:
 *       200:
 *         description: Успішне створення казки
 *       400:
 *         description: Некоректні дані запиту
 *       500:
 *         description: Помилка на сервері
 */
const fairytalesRouter = Router()

/**
 * @swagger
 * /fairytales/{id}:
 *   get:
 *     tags: [Казки]
 *     summary: Отримати казку за ідентифікатором
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Ідентифікатор казки
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Успішне отримання казки
 *       404:
 *         description: Казка не знайдена
 *       500:
 *         description: Помилка на сервері
 *
 *   put:
 *     tags: [Казки]
 *     summary: Оновити казку за ідентифікатором
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Ідентифікатор казки
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
 *                 description: Назва казки
 *               author:
 *                 type: string
 *                 description: Автор казки
 *               pages:
 *                 type: integer
 *                 description: Кількість сторінок у казці
 *     responses:
 *       200:
 *         description: Успішне оновлення казки
 *       400:
 *         description: Некоректні дані запиту
 *       404:
 *         description: Казка не знайдена
 *       500:
 *         description: Помилка на сервері
 *
 *   delete:
 *     tags: [Казки]
 *     summary: Видалити казку за ідентифікатором
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Ідентифікатор казки
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Успішне видалення казки
 *       404:
 *         description: Казка не знайдена
 *       500:
 *         description: Помилка на сервері
 */
// Отримати список всіх казок та фільтрувати за query параметрами
fairytalesRouter.get("/", Fairytale.getAllFairytales);

// Отримати окрему казку за ідентифікатором
fairytalesRouter.get("/:id", Fairytale.getFairytaleById);

// Створити нову казку
fairytalesRouter.post("/", Fairytale.createFairytale);

// Видалити казку за ідентифікатором
fairytalesRouter.delete("/:id", Fairytale.deleteFairytale);

// Оновити казку за ідентифікатором
fairytalesRouter.put("/:id", Fairytale.updateFairytale);

export default fairytalesRouter