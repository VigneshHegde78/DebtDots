import { TransactionProvider } from "@/context/TransactionContext";
import { trpc, trpcClient } from "@/lib/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
	return (
		<Stack screenOptions={{ headerBackTitle: "Back" }}>
			<Stack.Screen name="index" options={{ headerShown: false }} />
		</Stack>
	);
}

export default function RootLayout() {
	useEffect(() => {
		SplashScreen.hideAsync();
	}, []);

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>
				<TransactionProvider>
					<GestureHandlerRootView>
						<RootLayoutNav />
					</GestureHandlerRootView>
				</TransactionProvider>
			</QueryClientProvider>
		</trpc.Provider>
	);
}
