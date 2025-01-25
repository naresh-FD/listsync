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

    await AsyncStorage.setItem("todos", JSON.stringify(parsedAllData));
    console.log("Saved to local storage");
  } catch (err) {
    console.error("Error saving to local storage:", err);
  }
};
