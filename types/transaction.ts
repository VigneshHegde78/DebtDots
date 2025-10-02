export type TransactionType = "debt" | "lent";

export interface Transaction {
	id: string;
	type: TransactionType;
	personName: string;
	amount: number;
	description: string;
	date: string;
	settled: boolean;
	createdAt: string;
}
