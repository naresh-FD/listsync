import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNotes } from "../firebase/controller/notesController";
// import { defaultItems } from "./constants";

export const getLocalStorageItem = async (object) => {
  let itemFromLocalStorage = await AsyncStorage.getItem(object);
  if (itemFromLocalStorage !== null) {
    return itemFromLocalStorage;
  } else {
    return null;
  }
};

export const getDefaultItems = (admin) => {
  // defaultItems.forEach((item) => {
  //   item.author = admin;
  // });
  return [];
};

export const setToLocalStorage = async (list, listMetaData) => {
  try {
    const storedTodos = await AsyncStorage.getItem("todos");
    let parsedAllData = JSON.parse(storedTodos);

    const { uid } = listMetaData;
    const selectedData = parsedAllData.find((item) => item.uid === uid);
    selectedData.data = typeof list !== "string" ? JSON.stringify(list) : list;

    const indexOfSelectedList = parsedAllData.findIndex(
      (listItem) => listItem === selectedData
    );
    parsedAllData[indexOfSelectedList] = selectedData;

    await AsyncStorage.setItem("todos", JSON.stringify(parsedAllData));
    console.log("Saved to local storage");
  } catch (err) {
    console.error("Error saving to local storage:", err);
  }
};

export const validateUserDetails = (email, id) => {
  if (email && id) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email) && id) {
      return true;
    } else {
      return false;
    }
  }
};

export const validateCreateProfilePayload = (paylaod, type) => {
  switch (type) {
    case "google":
      return (
        paylaod.uid &&
        paylaod.name &&
        paylaod.email &&
        paylaod.photo &&
        paylaod.notes
      );
      break;
    default:
      return paylaod.uid && paylaod.email && paylaod.password && paylaod.notes;
      break;
  }
};

export const checkSourceListInFavouriteList = async (uid) => {
  try {
    const userFavouriteList = await AsyncStorage.getItem("favouriteList");
    let userFavObject = JSON.parse(userFavouriteList);
    return userFavObject.source.includes(uid);
  } catch (err) {
    console.log(err);
  }
};

export const validateForm = (form) => {
  const errors = {};

  // First Name
  if (!form.firstName || form.firstName.trim().length < 3) {
    errors.firstName = "First name must be at least 3 characters.";
  }

  // Second Name
  if (!form.lastName || form.lastName.trim().length < 3) {
    errors.lastName = "Last name must be at least 3 characters.";
  }

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email || !emailRegex.test(form.email)) {
    errors.email = "Please enter a valid email address.";
  }

  // Password
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  if (!form.password || !passwordRegex.test(form.password)) {
    errors.password =
      "Password must be at least 6 characters, include letters and numbers.";
  }

  // Checkbox
  if (!form.acceptedTerms) {
    errors.acceptedTerms = "You must accept the terms and conditions.";
  }

  return errors;
};

export const getNavbarIconImage = (icon, type) => {
  switch (type) {
    case "filled":
      switch (icon) {
        case "Home":
          return require("../../assets/icons/HomeIconFilled.png");
        case "Lists":
          return require("../../assets/icons/ListsIconFilled.png");
        case "Bills":
          return require("../../assets/icons/BillsIconFilled.png");
        case "Favourite":
          return require("../../assets/icons/FavouriteIconFilled.png");
        case "Settings":
          return require("../../assets/icons/SettingsIconFilled.png");
      }
    default:
    case "unfilled":
      switch (icon) {
        case "Home":
          return require("../../assets/icons/HomeIconUnfilled.png");
        case "Lists":
          return require("../../assets/icons/ListsIconUnfilled.png");
        case "Bills":
          return require("../../assets/icons/BillsIconUnfilled.png");
        case "Favourite":
          return require("../../assets/icons/FavouriteIconUnfilled.png");
        case "Settings":
          return require("../../assets/icons/SettingsIconUnfilled.png");
      }
  }
};

export const goToRoute = (router, type, route) => {
  switch (type) {
    case "push":
      router.push(route);
      break;
    case "replace":
      router.replace(route);
      break;
    default:
      router.push(route);
      break;
  }
};

/**
 * Name - Default List
 * Objective - To Initialize defaultList Object in asyncStorage if not available
 * params - null
 * returns - null
 * type - async
 */
export const initializeDefaultListOnLoad = async (defaultListPayload) => {
  try {
    const defaultListObject = await AsyncStorage.getItem("defaultList");
    if (defaultListObject === null) {
      await AsyncStorage.setItem(
        "defaultList",
        JSON.stringify(defaultListPayload)
      );
      console.log("Default List Initialization - success");
      return true;
    }
  } catch (err) {
    console.log("Err - On Initialize Default List");
  }
};

export const saveDefaultListToCloud = async (payload) => {
  try {
    console.log("save default list to cloud - debug", payload);
    let saveDefaultListToCloudResp = await createNotes(payload);
    console.log("188", saveDefaultListToCloudResp);
    if (
      saveDefaultListToCloudResp?.message === "Invalid payload" ||
      saveDefaultListToCloudResp?.message === "Error"
    )
      return false;
    return true;
  } catch (err) {
    console.log(err);
  }
};

export const initializeFavouriteList = async (userPayload) => {
  try {
    const newListPayload = {
      uid: `favouriteList${userPayload.uid}`,
      title: "Favourite List",
      notes: "Personal Favourite List",
      data: [],
      source: [],
      admin: userPayload.email,
      collaborators: [userPayload.email],
    };
    await AsyncStorage.setItem("favouriteList", JSON.stringify(newListPayload));
  } catch (err) {
    console.log("initializeFavouriteList", err);
  }
};
