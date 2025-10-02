import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
	return (
		<>
			<Stack.Screen options={{ title: "Oops!" }} />
			<View style={styles.container}>
				<Text style={styles.title}>This screen doesn&apos;t exist.</Text>

				<Link href="/" style={styles.link}>
					<Text style={styles.linkText}>Go to home screen</Text>
				</Link>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 20,
		backgroundColor: "#f8fafc",
	},
	title: {
		fontSize: 20,
		fontWeight: "700",
		color: "#1e293b",
		marginBottom: 8,
	},
	link: {
		marginTop: 15,
		paddingVertical: 15,
	},
	linkText: {
		fontSize: 16,
		color: "#3b82f6",
		fontWeight: "600",
	},
});
