import React, { useState } from "react";
import { View, Text, ImageBackground, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import GoogleSignInScreen from "../GoogleSignInScreen";
import { AuthFlowStyles as styles } from "../../../constants/AuthFlowStyles";

import welcomeBg from "../../../assets/images/welcomeBg.png";
import Button from "../../../reusables/Button/Button";
import BottomDrawerModal from "../../../components/BottomDrawerModal/BottomDrawerModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WelcomeScreen = () => {
  const router = useRouter();
  const [continueAsGuest, setContinueAsGuest] = useState(false);

  const continueAsGuestHandler = async () => {
    await AsyncStorage.setItem("isGuest", "true");
    setContinueAsGuest(!continueAsGuest);
  };

  const handleRouter = (route, type) => {
    switch (type) {
      case "push":
        router.push(route);
      default:
      case "replace":
        router.replace(route);
    }
  };

  return (
    <SafeAreaView style={{ position: "relative" }}>
      <ImageBackground
        style={styles.container}
        source={welcomeBg}
        resizeMode="cover"
      >
        <View style={styles.content}>
          <View style={styles.logoSection}>
            <Text style={styles.logoTitle}>Todo List</Text>
            <Text style={styles.logoDescription}>
              Manage your expenses seamlessly and intuitively
            </Text>
          </View>
          <Text style={styles.title}>Welcome</Text>

          <View style={styles.loginActionContainer}>
            <Button theme="light">
              <GoogleSignInScreen />
            </Button>

            <Button
              label="Create new Account"
              onPress={() => handleRouter("/auth/SignUp", "push")}
              theme="dark"
            />
            <Button
              label="Continue as Guest"
              onPress={continueAsGuestHandler}
              theme="light"
            />
          </View>
          <Button
            label="Already have an account? Sign in "
            onPress={() => router.push("/auth/login", "push")}
            theme={null}
          />
        </View>
        {continueAsGuest ? <BottomDrawerModal /> : null}
      </ImageBackground>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
