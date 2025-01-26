import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  ToastAndroid,
} from "react-native";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useRouter } from "expo-router";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { validateUserDetails } from "../util/helper";
import { createProfile, getUser } from "../firebase/controller/userController";
import { getAllNotesOfUser } from "../firebase/controller/notesController";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GoogleSignInScreen = () => {
  // const isWeb = Platform.OS === "web";
  const router = useRouter();
  let webClientId =
    "897556668261-a3vlt5bsp7r5i6u92j48nu1g7uksl1va.apps.googleusercontent.com";

  GoogleSignin.configure({
    webClientId: webClientId,
    scopes: ["profile", "email"],
  });

  const saveUserLogin = async (userLogin) => {
    if (userLogin) {
      await AsyncStorage.setItem("user", JSON.stringify(userLogin));
    }
  };

  const validateUserAndLogin = async (userDetails) => {
    try {
      const { email, id, name, photo } = userDetails;
      if (email && id) {
        if (validateUserDetails(email, id)) {
          //call firebase method to set this if new user

          //Login User
          //replace the id to check user
          let currentUser = await getUser(id);

          if (currentUser !== "No User Found") {
            //User Available
            let userNotes = await getAllNotesOfUser(
              JSON.parse(currentUser.notes)
            );
            if (userNotes && userNotes.length !== 0) {
              await AsyncStorage.setItem("todos", JSON.stringify(userNotes));
            } else {
              await AsyncStorage.setItem("todos", JSON.stringify([]));
            }
            const { email, password, notes, uid } = currentUser;
            await saveUserLogin({
              uid: uid,
              name: name,
              email: email,
              password: password,
              notes: JSON.parse(notes),
              photo: photo,
            });
            ToastAndroid.show(`Welcome, ${name}`, ToastAndroid.SHORT);
            router.replace("ListManager");
          } else {
            //new User
            let payload = {
              uid: id,
              name: name,
              email: email,
              photo: photo,
              notes: JSON.stringify([]),
            };
            let createUser = await createProfile("google", payload);
            if (createUser) {
              await saveUserLogin(payload);
              router.replace("ListManager");
            }
          }
        } else {
          alert("Please enter credentials");
        }
      } else {
        alert("Please enter credentials");
      }
    } catch (err) {
      console.log("validate User and Login", err);
    }
  };

  // const handleGoogleSignInWeb = async () => {
  //   const provider = new GoogleAuthProvider();
  //   try {
  //     const result = await signInWithPopup(auth, provider);
  //     const user = result.user;
  //     console.log("Signed in user (Web):", user);
  //   } catch (error) {
  //     console.error("Error signing in with Google on Web:", error);
  //   }
  // };

  const GoogleLogin = async () => {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    return userInfo;
  };

  const handleGoogleSignInMobile = async () => {
    try {
      const response = await GoogleLogin();

      const { type, data } = response;

      switch (type) {
        case "success":
          const { idToken, user } = data;
          if (idToken.length !== 0) {
            const { id, name, email, photo } = user;
            const payload = {
              id: id,
              name: name,
              email: email,
              photo: photo,
            };
            validateUserAndLogin(payload);
          }
          break;
        case "failed":
          console.log("failed");
          break;
      }
    } catch (apiError) {
      console.log(
        apiError?.response?.data?.error?.message || "Something went wrong"
      );
    }
  };

  // async function handleGoogleLogout() {
  //   try {
  //     await GoogleSignin.signOut();
  //     // Perform additional cleanup and logout operations.
  //   } catch (error) {
  //     console.log("Google Sign-Out Error: ", error);
  //   }
  // }

  return (
    <>
      {/* <TouchableOpacity
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={handleGoogleSignInWeb}
        >
          <Image
            source={{
              uri: "https://developers.google.com/identity/images/g-logo.png",
            }}
            style={{ width: 20, height: 20, marginRight: 10 }}
          />
          <Text style={{ color: "#000", fontWeight: "bold" }}>
            Sign in with Google
          </Text>
        </TouchableOpacity> */}
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "transparent", // Transparent background
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 5,
          elevation: 0, // Remove shadow (Android)
          shadowColor: "transparent", // Remove shadow (iOS)
        }}
        onPress={handleGoogleSignInMobile}
      >
        <Image
          source={{
            uri: "https://developers.google.com/identity/images/g-logo.png",
          }}
          style={{ width: 20, height: 20, marginRight: 10 }}
        />
        <Text style={{ color: "#000", fontWeight: "bold" }}>
          Sign in with Google
        </Text>
      </TouchableOpacity>
    </>
  );
};

export default GoogleSignInScreen;
