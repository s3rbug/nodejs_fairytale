import * as uuid from "uuid";

export interface IPagination {
	page: string;
	limit: string;
}

// Функція для генерації унікального ідентифікатора
export function generateId(): string {
	return uuid.v4();
}