import { useTransactions } from "@/context/TransactionContext";
import { TransactionType } from "@/types/transaction";
import { TrendingDown, TrendingUp, X } from "lucide-react-native";
import React, { useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AddTransactionModalProps {
	onClose: () => void;
}

export default function AddTransactionModal({
	onClose,
}: AddTransactionModalProps) {
	const { addTransaction } = useTransactions();
	const [type, setType] = useState<TransactionType>("debt");
	const [personName, setPersonName] = useState("");
	const [amount, setAmount] = useState("");
	const [description, setDescription] = useState("");

	const handleSubmit = () => {
		if (!personName.trim() || !amount.trim()) {
			return;
		}

		const numAmount = parseFloat(amount);
		if (isNaN(numAmount) || numAmount <= 0) {
			return;
		}

		addTransaction(
			type,
			personName.trim(),
			numAmount,
			description.trim(),
			new Date().toISOString()
		);

		onClose();
	};

	return (
		<SafeAreaView style={styles.container} edges={["top", "bottom"]}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.keyboardView}
			>
				<View style={styles.header}>
					<Text style={styles.headerTitle}>Add Transaction</Text>
					<TouchableOpacity onPress={onClose} style={styles.closeButton}>
						<X size={24} color="#64748b" />
					</TouchableOpacity>
				</View>

				<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
					<View style={styles.typeSelector}>
						<TouchableOpacity
							style={[
								styles.typeButton,
								type === "debt" && styles.typeButtonActiveDebt,
							]}
							onPress={() => setType("debt")}
							activeOpacity={0.7}
						>
							<TrendingDown
								size={20}
								color={type === "debt" ? "#fff" : "#ef4444"}
							/>
							<Text
								style={[
									styles.typeButtonText,
									type === "debt" && styles.typeButtonTextActive,
								]}
							>
								I Owe
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[
								styles.typeButton,
								type === "lent" && styles.typeButtonActiveLent,
							]}
							onPress={() => setType("lent")}
							activeOpacity={0.7}
						>
							<TrendingUp
								size={20}
								color={type === "lent" ? "#fff" : "#10b981"}
							/>
							<Text
								style={[
									styles.typeButtonText,
									type === "lent" && styles.typeButtonTextActive,
								]}
							>
								I&apos;m Owed
							</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Person Name</Text>
						<TextInput
							style={styles.input}
							value={personName}
							onChangeText={setPersonName}
							placeholder="Enter name"
							placeholderTextColor="#94a3b8"
							autoCapitalize="words"
						/>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Amount</Text>
						<View style={styles.amountInputContainer}>
							<Text style={styles.currencySymbol}>₹</Text>
							<TextInput
								style={styles.amountInput}
								value={amount}
								onChangeText={setAmount}
								placeholder="0.00"
								placeholderTextColor="#94a3b8"
								keyboardType="decimal-pad"
							/>
						</View>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Description (Optional)</Text>
						<TextInput
							style={[styles.input, styles.textArea]}
							value={description}
							onChangeText={setDescription}
							placeholder="What's this for?"
							placeholderTextColor="#94a3b8"
							multiline
							numberOfLines={3}
							textAlignVertical="top"
						/>
					</View>
				</ScrollView>

				<View style={styles.footer}>
					<TouchableOpacity
						style={[
							styles.submitButton,
							(!personName.trim() || !amount.trim()) &&
								styles.submitButtonDisabled,
						]}
						onPress={handleSubmit}
						disabled={!personName.trim() || !amount.trim()}
						activeOpacity={0.8}
					>
						<Text style={styles.submitButtonText}>Add Transaction</Text>
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	keyboardView: {
		flex: 1,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#e2e8f0",
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: "#1e293b",
	},
	closeButton: {
		padding: 4,
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 24,
	},
	typeSelector: {
		flexDirection: "row",
		gap: 12,
		marginBottom: 32,
	},
	typeButton: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		paddingVertical: 16,
		borderRadius: 16,
		borderWidth: 2,
		borderColor: "#e2e8f0",
		backgroundColor: "#fff",
	},
	typeButtonActiveDebt: {
		backgroundColor: "#ef4444",
		borderColor: "#ef4444",
	},
	typeButtonActiveLent: {
		backgroundColor: "#10b981",
		borderColor: "#10b981",
	},
	typeButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#64748b",
	},
	typeButtonTextActive: {
		color: "#fff",
	},
	inputGroup: {
		marginBottom: 24,
	},
	label: {
		fontSize: 14,
		fontWeight: "600",
		color: "#475569",
		marginBottom: 8,
	},
	input: {
		backgroundColor: "#f8fafc",
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 14,
		fontSize: 16,
		color: "#1e293b",
		borderWidth: 1,
		borderColor: "#e2e8f0",
	},
	amountInputContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#f8fafc",
		borderRadius: 12,
		paddingHorizontal: 16,
		borderWidth: 1,
		borderColor: "#e2e8f0",
	},
	currencySymbol: {
		fontSize: 20,
		fontWeight: "600",
		color: "#64748b",
		marginRight: 8,
	},
	amountInput: {
		flex: 1,
		paddingVertical: 14,
		fontSize: 16,
		color: "#1e293b",
	},
	textArea: {
		minHeight: 80,
		paddingTop: 14,
	},
	footer: {
		paddingHorizontal: 20,
		paddingVertical: 16,
		borderTopWidth: 1,
		borderTopColor: "#e2e8f0",
	},
	submitButton: {
		backgroundColor: "#3b82f6",
		borderRadius: 16,
		paddingVertical: 16,
		alignItems: "center",
		shadowColor: "#3b82f6",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 4,
	},
	submitButtonDisabled: {
		backgroundColor: "#cbd5e1",
		shadowOpacity: 0,
	},
	submitButtonText: {
		fontSize: 16,
		fontWeight: "700",
		color: "#fff",
	},
});
