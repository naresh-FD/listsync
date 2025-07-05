import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ToastAndroid,
  ImageBackground,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../../../constants/Colors";
import { getAllNotesOfUser } from "../../firebase/controller/notesController";
import { getUser } from "../../firebase/controller/userController";

import loginBackground from "../../../assets/images/loginBg.png";
import { theme } from "../../util/theme";
import InputField from "../../../reusables/InputField";

import Button from "../../../reusables/Button/Button";
import { Ionicons } from "@expo/vector-icons";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const saveUserLogin = async (userLogin) => {
    if (userLogin) {
      await AsyncStorage.setItem("user", JSON.stringify(userLogin));
    }
  };

  const validateCredentials = (email, password) => {
    if (email && password) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(email)) {
        // Check password availability and criteria
        if (password && typeof password === "string" && password.length >= 6) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  };

  //Replace this function with GCC UID
  const generateUserId = (email) => {
    if (email) {
      if (!email || typeof email !== "string") {
        throw new Error("A valid email is required to generate a user ID.");
      }
      const emailPrefix = email.split("@")[0];

      const randomNumber = Math.floor(10000 + Math.random() * 90000);

      const userId = `${emailPrefix}${randomNumber}`;

      return userId;
    }
  };

  const handleLogin = async () => {
    try {
      if (email && password) {
        if (validateCredentials(email, password)) {
          //call firebase method to set this if new user
          //Login User
          let currentUser = await getUser("VQdX2v9h6n4AOhwY06lg");

          if (currentUser) {
            let userNotes = await getAllNotesOfUser(
              JSON.parse(currentUser.notes)
            );
            if (userNotes && userNotes?.length !== 0) {
              await AsyncStorage.setItem("todos", JSON.stringify(userNotes));
            } else {
              await AsyncStorage.setItem("todos", JSON.stringify([]));
            }
            const { email, password, notes, uid } = currentUser;
            await saveUserLogin({
              email: email,
              password: password,
              uid: uid,
              notes: JSON.parse(notes),
            });
            router.replace("ListManager");
          }
        } else {
          alert("Please enter credentials");
        }
      } else {
        alert("Please enter credentials");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const checkIsUserAvailable = async () => {
      let userObject = await AsyncStorage.getItem("user");
      if (userObject) {
        ToastAndroid.show("Welcome", ToastAndroid.SHORT);
        router.replace("ListManager");
        // console.log("user available", userObject);
      }
    };
    // checkIsUserAvailable();
  }, []);

  const goToRoute = (route) => {
    router.push(route);
  };

  return (
    <ImageBackground
      source={loginBackground}
      resizeMode="cover"
      style={styles.container}
    >
      <View style={styles.routerContainer}>
        <TouchableOpacity onPress={() => goToRoute("/auth/WelcomeScreen")}>
          {/* <Image
            source={require("../../../assets/icons/backLight.png")}
            style={styles.backButton}
          /> */}
          <Ionicons name="arrow-back" size={34} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Hello there, sign in to continue!</Text>

        <View style={styles.fieldsContainer}>
          <InputField
            type="text"
            label="Email"
            placeholder="jondeo@gmail.com"
            value={email}
            onchange={setEmail}
          />

          <InputField
            type="password"
            label="Password"
            placeholder="********"
            value={password}
            onchange={setPassword}
          />

          <Pressable
            onPress={router.push("/auth/forgotPassword")}
            style={styles.forgotpasswordContainer}
          >
            <Text style={styles.forgotpassword}>Forgot Password?</Text>
          </Pressable>

          <Button
            label="Don’t have an account? Sign up"
            textTheme="light"
            onPress={() => goToRoute("/auth/SignUp")}
            theme={null}
          />
          <View style={styles.signInButtonContainer}>
            <Button label="Sign in" onPress={handleLogin} theme="dark" />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
    display: "flex",
    flexDirection: "column",
  },
  content: {
    width: "90%",
    height: "100%",
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-start",
    marginBottom: 50,
    paddingLeft: 20,
    marginTop: 20,
  },
  title: {
    fontFamily: "Poppins",
    fontSize: 28,
    fontWeight: "bold",
    color: theme.black,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: theme.black,
    width: "90%",
    marginBottom: 20,
  },
  fieldsContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  forgotpasswordContainer: {
    width: 310,
    height: 40,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  forgotpassword: {
    textAlign: "right",
  },
  signInButtonContainer: {
    width: 340,
  },
  signInButton: {
    width: "100%",
    backgroundColor: Colors.light.buttonText,
    borderRadius: 25,
    paddingVertical: 12,
    marginBottom: 20,
    boxShadow: "0px 2px 3.84px rgba(0, 0, 0, 0.25)",
    elevation: 5,
    alignItems: "center",
  },
  signInButtonGoogle: {
    width: "100%",
    backgroundColor: Colors.light.buttonText,
    borderRadius: 25,
    // paddingVertical: 12,
    marginBottom: 20,
    boxShadow: "0px 2px 3.84px rgba(0, 0, 0, 0.25)",
    color: Colors.light.text,
    elevation: 5,
    alignItems: "center",
  },
  signInButtonText: {
    color: Colors.light.buttonBackground,
    fontSize: 16,
    fontWeight: "bold",
  },
  inputField: {
    width: "100%",
    borderColor: Colors.light.buttonText,
    borderWidth: 0.5,
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#ffffff90",
    color: "black",
    fontWeight: "700",
    paddingLeft: 20,
    marginBottom: 20,
  },
  loginButton: {
    width: "100%",
    borderColor: Colors.light.buttonText,
    borderWidth: 0.5,
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#ffffff",
    color: "black",
    fontWeight: "700",
    marginBottom: 20,
  },
  createAccountButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomLink: {
    marginTop: 30,
    marginRight: 20,
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  bottomLinkText: {
    fontSize: 14,
    color: Colors.light.buttonText,
  },
  signInLink: {
    fontWeight: "bold",
    color: Colors.light.buttonText,
  },
  // title: {
  //   fontSize: 24,
  //   textAlign: "center",
  //   marginBottom: 20,
  // },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 10,
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: "#007BFF",
  },
  routerContainer: {
    marginTop: 15,
    width: "85%",
  },
  backButton: {
    height: 25,
    width: 30,
    color: "white",
  },
});

export default LoginScreen;
