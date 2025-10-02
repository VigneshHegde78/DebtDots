import { Transaction } from "@/types/transaction";
import { CheckCircle2, Circle, Trash2 } from "lucide-react-native";
import React from "react";
import {
	Animated,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

interface TransactionItemProps {
	transaction: Transaction;
	onToggleSettled: (id: string) => void;
	onDelete: (id: string) => void;
}

export default function TransactionItem({
	transaction,
	onToggleSettled,
	onDelete,
}: TransactionItemProps) {
	const scaleAnim = React.useRef(new Animated.Value(1)).current;

	const handlePressIn = () => {
		Animated.spring(scaleAnim, {
			toValue: 0.97,
			useNativeDriver: true,
		}).start();
	};

	const handlePressOut = () => {
		Animated.spring(scaleAnim, {
			toValue: 1,
			useNativeDriver: true,
		}).start();
	};

	const formattedAmount = new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		minimumFractionDigits: 2,
	}).format(transaction.amount);

	const formattedDate = new Date(transaction.date).toLocaleDateString("en-IN", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});

	const isDebt = transaction.type === "debt";
	const amountColor = isDebt ? "#ef4444" : "#10b981";

	return (
		<Animated.View
			style={[styles.container, { transform: [{ scale: scaleAnim }] }]}
		>
			<TouchableOpacity
				style={styles.checkButton}
				onPress={() => onToggleSettled(transaction.id)}
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				activeOpacity={0.7}
			>
				{transaction.settled ? (
					<CheckCircle2 size={24} color="#10b981" />
				) : (
					<Circle size={24} color="#94a3b8" />
				)}
			</TouchableOpacity>

			<View style={styles.content}>
				<View style={styles.header}>
					<Text
						style={[
							styles.personName,
							transaction.settled && styles.settledText,
						]}
					>
						{transaction.personName}
					</Text>
					<Text
						style={[
							styles.amount,
							{ color: amountColor },
							transaction.settled && styles.settledText,
						]}
					>
						{isDebt ? "-" : "+"}
						{formattedAmount}
					</Text>
				</View>
				{transaction.description ? (
					<Text
						style={[
							styles.description,
							transaction.settled && styles.settledText,
						]}
						numberOfLines={1}
					>
						{transaction.description}
					</Text>
				) : null}
				<Text style={styles.date}>{formattedDate}</Text>
			</View>

			<TouchableOpacity
				style={styles.deleteButton}
				onPress={() => onDelete(transaction.id)}
				activeOpacity={0.7}
			>
				<Trash2 size={20} color="#94a3b8" />
			</TouchableOpacity>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		borderRadius: 16,
		padding: 16,
		marginBottom: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	checkButton: {
		marginRight: 12,
	},
	content: {
		flex: 1,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 4,
	},
	personName: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1e293b",
		flex: 1,
	},
	amount: {
		fontSize: 16,
		fontWeight: "700",
		marginLeft: 8,
	},
	description: {
		fontSize: 14,
		color: "#64748b",
		marginBottom: 4,
	},
	date: {
		fontSize: 12,
		color: "#94a3b8",
	},
	settledText: {
		opacity: 0.5,
		textDecorationLine: "line-through",
	},
	deleteButton: {
		marginLeft: 12,
		padding: 4,
	},
});
