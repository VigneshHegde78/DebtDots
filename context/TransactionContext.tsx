import { Transaction, TransactionType } from "@/types/transaction";
import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "transactions";

export const [TransactionProvider, useTransactions] = createContextHook(() => {
	const queryClient = useQueryClient();
	const [transactions, setTransactions] = useState<Transaction[]>([]);

	const transactionsQuery = useQuery({
		queryKey: ["transactions"],
		queryFn: async () => {
			const stored = await AsyncStorage.getItem(STORAGE_KEY);
			return stored ? JSON.parse(stored) : [];
		},
	});

	const syncMutation = useMutation({
		mutationFn: async (transactions: Transaction[]) => {
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
			return transactions;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
		},
	});

	const { mutate: syncTransactions } = syncMutation;

	useEffect(() => {
		if (transactionsQuery.data) {
			setTransactions(transactionsQuery.data);
		}
	}, [transactionsQuery.data]);

	const addTransaction = useCallback(
		(
			type: TransactionType,
			personName: string,
			amount: number,
			description: string,
			date: string
		) => {
			const newTransaction: Transaction = {
				id: Date.now().toString(),
				type,
				personName,
				amount,
				description,
				date,
				settled: false,
				createdAt: new Date().toISOString(),
			};
			const updated = [...transactions, newTransaction];
			setTransactions(updated);
			syncTransactions(updated);
		},
		[transactions, syncTransactions]
	);

	const toggleSettled = useCallback(
		(id: string) => {
			const updated = transactions.map((t) =>
				t.id === id ? { ...t, settled: !t.settled } : t
			);
			setTransactions(updated);
			syncTransactions(updated);
		},
		[transactions, syncTransactions]
	);

	const deleteTransaction = useCallback(
		(id: string) => {
			const updated = transactions.filter((t) => t.id !== id);
			setTransactions(updated);
			syncTransactions(updated);
		},
		[transactions, syncTransactions]
	);

	const summary = useMemo(() => {
		const active = transactions.filter((t) => !t.settled);
		const totalDebt = active
			.filter((t) => t.type === "debt")
			.reduce((sum, t) => sum + t.amount, 0);
		const totalLent = active
			.filter((t) => t.type === "lent")
			.reduce((sum, t) => sum + t.amount, 0);
		const netBalance = totalLent - totalDebt;

		return {
			totalDebt,
			totalLent,
			netBalance,
			activeCount: active.length,
			settledCount: transactions.filter((t) => t.settled).length,
		};
	}, [transactions]);

	return useMemo(
		() => ({
			transactions,
			addTransaction,
			toggleSettled,
			deleteTransaction,
			summary,
			isLoading: transactionsQuery.isLoading,
		}),
		[
			transactions,
			addTransaction,
			toggleSettled,
			deleteTransaction,
			summary,
			transactionsQuery.isLoading,
		]
	);
});

export function useActiveTransactions() {
	const { transactions } = useTransactions();
	return useMemo(
		() =>
			transactions
				.filter((t) => !t.settled)
				.sort(
					(a, b) =>
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				),
		[transactions]
	);
}

export function useSettledTransactions() {
	const { transactions } = useTransactions();
	return useMemo(
		() =>
			transactions
				.filter((t) => t.settled)
				.sort(
					(a, b) =>
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				),
		[transactions]
	);
}
