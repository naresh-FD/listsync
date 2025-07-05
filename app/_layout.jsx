import React from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { Provider as PaperProvider } from "react-native-paper";
import AuthGuard from "./navigation/AuthGuard";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Rubik: require("../assets/fonts/Rubik-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return;
  }

  return (
    <PaperProvider>
      <AuthGuard>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="auth/WelcomeScreen/index" />
          <Stack.Screen name="index" />
          <Stack.Screen name="auth/login/index" />
          <Stack.Screen name="auth/SignUp/index" />
          <Stack.Screen
            name="ListManager/index"
            options={{ title: "List Manager", headerShown: false }}
          />
          <Stack.Screen
            name="ToDoManager/index"
            options={{ title: "To Do List", headerShown: false }}
          />
          <Stack.Screen
            name="Settings/index"
            options={{ title: "Settings", headerShown: false }}
          />
          <Stack.Screen
            name="BillsScreen/index"
            options={{ title: "BillsScreen", headerShown: false }}
          />
        </Stack>
      </AuthGuard>
    </PaperProvider>
  );
}
