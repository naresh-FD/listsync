import AsyncStorage from "@react-native-async-storage/async-storage";
import { defaultItems } from "./constants";
import { updateNotesData } from "../firebase/controller/notesController";

export const getLocalStorageItem = async (object) => {
  let itemFromLocalStorage = await AsyncStorage.getItem(object);
  if (itemFromLocalStorage !== null) {
    return itemFromLocalStorage;
  } else {
    return null;
  }
};

export const getDefaultItems = (admin) => {
  defaultItems.forEach((item) => {
    item.author = admin;
  });
  return defaultItems;
};

export const updateItemDataToCloud = async (dataPayload) => {
  try {
    if (dataPayload.uid && dataPayload.data.length !== 0) {
      let updateResp = await updateNotesData(dataPayload);
      return updateResp;
    }
  } catch (err) {
    console.log("updateItemDataToCloud", err);
  }
};

export const setToLocalStorage = async (list, listMetaData) => {
  try {
    const storedTodos = await AsyncStorage.getItem("todos");
    let parsedAllData = JSON.parse(storedTodos);

    const { uid } = listMetaData;
    const selectedData = parsedAllData.find((item) => item.uid === uid);
    selectedData.data = JSON.parse(list);

    const indexOfSelectedList = parsedAllData.findIndex(
      (listItem) => listItem === selectedData
    );
    parsedAllData[indexOfSelectedList] = selectedData;

    console.log("33", selectedData);

    //Update the Notes data to cloud
    let cloudPayload = {
      uid: selectedData.uid,
      data: JSON.stringify(selectedData.data),
    };
    let updateResp = await updateItemDataToCloud(cloudPayload);
    console.log("Upload to cloud", updateResp.message);

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
