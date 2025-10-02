import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface SummaryCardProps {
	title: string;
	amount: number;
	colors: readonly [string, string, ...string[]];
	icon: React.ReactNode;
}

export default function SummaryCard({
	title,
	amount,
	colors,
	icon,
}: SummaryCardProps) {
	const formattedAmount = new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		minimumFractionDigits: 2,
	}).format(Math.abs(amount));

	return (
		<LinearGradient
			colors={colors}
			style={styles.card}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
		>
			<View style={styles.iconContainer}>
				<Text>{icon}</Text>
			</View>
			<Text style={styles.title}>{title}</Text>
			<Text style={styles.amount}>{formattedAmount}</Text>
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	card: {
		borderRadius: 20,
		padding: 20,
		minHeight: 140,
		justifyContent: "space-between",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 12,
		elevation: 5,
	},
	iconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "rgba(255, 255, 255, 0.3)",
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 14,
		color: "rgba(255, 255, 255, 0.9)",
		fontWeight: "600",
		marginTop: 8,
	},
	amount: {
		fontSize: 28,
		color: "#fff",
		fontWeight: "700",
		marginTop: 4,
	},
});
