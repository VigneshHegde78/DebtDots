import AddTransactionModal from "@/components/AddTransactionModal";
import SummaryCard from "@/components/SummaryCard";
import TransactionItem from "@/components/TransactionItem";
import {
	useActiveTransactions,
	useTransactions,
} from "@/context/TransactionContext";
import { Plus, TrendingDown, TrendingUp, Wallet } from "lucide-react-native";
import React, { useState } from "react";
import {
	Modal,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
	const { summary, toggleSettled, deleteTransaction } = useTransactions();
	const activeTransactions = useActiveTransactions();
	const [modalVisible, setModalVisible] = useState(false);
	const insets = useSafeAreaInsets();

	return (
		<View style={[styles.container, { paddingTop: insets.top }]}>
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.header}>
					<Text style={styles.headerTitle}>Balance</Text>
					<Text style={styles.headerSubtitle}>Track your debts and loans</Text>
				</View>

				<View style={styles.summaryGrid}>
					<View style={styles.summaryRow}>
						<View style={styles.summaryCardWrapper}>
							<SummaryCard
								title="You Owe"
								amount={summary.totalDebt}
								colors={["#ef4444", "#f87171"] as const}
								icon={<TrendingDown size={20} color="#fff" />}
							/>
						</View>
						<View style={styles.summaryCardWrapper}>
							<SummaryCard
								title="You're Owed"
								amount={summary.totalLent}
								colors={["#10b981", "#34d399"] as const}
								icon={<TrendingUp size={20} color="#fff" />}
							/>
						</View>
					</View>
					<SummaryCard
						title="Net Balance"
						amount={summary.netBalance}
						colors={
							summary.netBalance >= 0
								? (["#8b5cf6", "#a78bfa"] as const)
								: (["#f59e0b", "#fbbf24"] as const)
						}
						icon={<Wallet size={20} color="#fff" />}
					/>
				</View>

				<View style={styles.transactionsSection}>
					<View style={styles.transactionsHeader}>
						<Text style={styles.sectionTitle}>Active Transactions</Text>
						<Text style={styles.transactionCount}>{summary.activeCount}</Text>
					</View>

					{activeTransactions.length === 0 ? (
						<View style={styles.emptyState}>
							<Text style={styles.emptyStateText}>No active transactions</Text>
							<Text style={styles.emptyStateSubtext}>
								Tap the + button to add one
							</Text>
						</View>
					) : (
						activeTransactions.map((transaction) => (
							<TransactionItem
								key={transaction.id}
								transaction={transaction}
								onToggleSettled={toggleSettled}
								onDelete={deleteTransaction}
							/>
						))
					)}
				</View>
			</ScrollView>

			<TouchableOpacity
				style={styles.fab}
				onPress={() => setModalVisible(true)}
				activeOpacity={0.8}
			>
				<Plus size={28} color="#fff" />
			</TouchableOpacity>

			<Modal
				visible={modalVisible}
				animationType="slide"
				presentationStyle="pageSheet"
				onRequestClose={() => setModalVisible(false)}
			>
				<AddTransactionModal onClose={() => setModalVisible(false)} />
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8fafc",
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		paddingBottom: 100,
	},
	header: {
		paddingHorizontal: 20,
		paddingTop: 20,
		paddingBottom: 24,
	},
	headerTitle: {
		fontSize: 32,
		fontWeight: "700",
		color: "#1e293b",
		marginBottom: 4,
	},
	headerSubtitle: {
		fontSize: 16,
		color: "#64748b",
	},
	summaryGrid: {
		paddingHorizontal: 20,
		gap: 16,
		marginBottom: 32,
	},
	summaryRow: {
		flexDirection: "row",
		gap: 16,
	},
	summaryCardWrapper: {
		flex: 1,
	},
	transactionsSection: {
		paddingHorizontal: 20,
	},
	transactionsHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: "#1e293b",
	},
	transactionCount: {
		fontSize: 16,
		fontWeight: "600",
		color: "#64748b",
		backgroundColor: "#e2e8f0",
		paddingHorizontal: 12,
		paddingVertical: 4,
		borderRadius: 12,
	},
	emptyState: {
		alignItems: "center",
		paddingVertical: 48,
	},
	emptyStateText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#64748b",
		marginBottom: 4,
	},
	emptyStateSubtext: {
		fontSize: 14,
		color: "#94a3b8",
	},
	fab: {
		position: "absolute",
		right: 20,
		bottom: 32,
		width: 64,
		height: 64,
		borderRadius: 32,
		backgroundColor: "#3b82f6",
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#3b82f6",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 12,
		elevation: 8,
	},
});
