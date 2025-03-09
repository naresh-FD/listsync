import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import WelcomeScreen from "../auth/WelcomeScreen";
import LoginScreen from "../auth/login/index";
import GoogleSignInScreen from "../auth/GoogleSignInScreen";
import ListManagerScreen from "../ListManager/index";
import BillsScreen from "../BillsScreen/index";
import SettingsScreen from "../Settings/index";
import AuthGuard from "./AuthGuard";

const Stack = createStackNavigator();

const withAuthGuard = (Component) => (props) => (
  <AuthGuard {...props}>
    <Component {...props} />
  </AuthGuard>
);

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="GoogleSignIn" component={GoogleSignInScreen} />
        <Stack.Screen name="ListManager" component={withAuthGuard(ListManagerScreen)} />
        <Stack.Screen name="BillsScreen" component={withAuthGuard(BillsScreen)} />
        <Stack.Screen name="Settings" component={withAuthGuard(SettingsScreen)} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
