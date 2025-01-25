import AsyncStorage from "@react-native-async-storage/async-storage";
import { defaultItems } from "./constants";
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
