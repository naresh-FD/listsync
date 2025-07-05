import React from "react";
import { Text, TouchableOpacity, Image, ToastAndroid } from "react-native";
import { useRouter } from "expo-router";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  initializeDefaultListOnLoad,
  initializeFavouriteList,
  saveDefaultListToCloud,
  validateUserDetails,
} from "../util/helper";
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
    try {
      let userNotes = await getAllNotesOfUser(JSON.parse(currentUser.notes));
      if (userNotes && userNotes?.length !== 0) {
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
    } catch (err) {
      console.log(err);
    }
  };

  const handleNewUser = async (id, name, email, photo) => {
    //Create Default List
    const defaultListPayload = {
      uid: `defaultList${id}`,
      title: "My List",
      notes: "Your Default List",
      data: JSON.stringify([]),
      admin: email,
      collaborators: [email],
    };

    let userPayload = {
      uid: id,
      name: name,
      email: email,
      photo: photo,
      notes: JSON.stringify([`defaultList${id}`]),
    };
    try {
      const createUser = await createProfile("google", userPayload);
      const isDefaultListInitiated = await initializeDefaultListOnLoad(
        defaultListPayload
      );
      const isDefaultListInitiatedToCloud = await saveDefaultListToCloud(
        defaultListPayload
      );
      initializeFavouriteList(userPayload);
      if (
        createUser &&
        isDefaultListInitiated &&
        isDefaultListInitiatedToCloud
      ) {
        await AsyncStorage.setItem(
          "todos",
          JSON.stringify([defaultListPayload])
        );
        await saveUserLogin(userPayload);
        router.replace("ListManager");
      } else {
        if (!createUser) console.log("User creation - failed", createUser);
        if (!isDefaultListInitiated)
          console.log("Default List loaded - failed", isDefaultListInitiated);
        if (!isDefaultListInitiatedToCloud)
          console.log("Default List save to Cloud - failed");
      }
    } catch (err) {
      console.log(err);
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

      console.log("Google Sign In Response", response);

      const { type, data } = response;
      switch (type) {
        case "success":
          {
            const { idToken, user } = data;
            if (idToken?.length !== 0) {
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
        display: "flex",
        justifyContent: "center",
        flexDirection: "row",
        alignItems: "center",
      }}
      onPress={handleGoogleSignInMobile}
    >
      <Image
        source={{
          uri: "https://developers.google.com/identity/images/g-logo.png",
        }}
        style={{ width: 20, height: 20, marginRight: 10 }}
      />
      <Text style={{ color: "#000", fontWeight: "bold", fontSize: 18 }}>
        Sign in with Google
      </Text>
    </TouchableOpacity>
  );
};

export default GoogleSignInScreen;
