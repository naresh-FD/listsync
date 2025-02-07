import React from "react";
import { Text, TouchableOpacity, Image, ToastAndroid } from "react-native";
import { useRouter } from "expo-router";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { validateUserDetails } from "../util/helper";
import { createProfile, getUser } from "../firebase/controller/userController";
import { getAllNotesOfUser } from "../firebase/controller/notesController";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GoogleSignInScreen = () => {
  const router = useRouter();

  GoogleSignin.configure({
    webClientId:
      "990584278692-9pa29gpdtigbn7ftpafadlohknij05sg.apps.googleusercontent.com",
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
          await handleExistingUser(id, name, email, photo);
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

  const handleExistingUser = async (id, name, email, photo) => {
    let currentUser = await getUser(id);
    if (currentUser !== "No User Found") {
      await handleUserNotes(currentUser, name, email, photo);
    } else {
      await handleNewUser(id, name, email, photo);
    }
  };

  const handleUserNotes = async (currentUser, name, email, photo) => {
    let userNotes = await getAllNotesOfUser(JSON.parse(currentUser.notes));
    if (userNotes && userNotes.length !== 0) {
      await AsyncStorage.setItem("todos", JSON.stringify(userNotes));
    } else {
      await AsyncStorage.setItem("todos", JSON.stringify([]));
    }
    const { password, notes, uid } = currentUser;
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
  };

  const handleNewUser = async (id, name, email, photo) => {
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
  };

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
          {
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
          }
          break;
        case "failed":
          console.log("failed");
          break;
      }
    } catch (apiError) {
      console.log("apiError", apiError);
    }
  };

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "transparent",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        elevation: 0,
        shadowColor: "transparent",
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
  );
};

export default GoogleSignInScreen;
