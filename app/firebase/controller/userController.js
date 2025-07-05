import { setDoc, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { validateCreateProfilePayload } from "../../util/helper";
import { ToastAndroid } from "react-native";

export const createProfile = async (type, userDetails) => {
  try {
    if (validateCreateProfilePayload(userDetails, type)) {
      await setDoc(doc(db, "users", userDetails.uid), userDetails);
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log("Create Profile Error - ", err);
  }
};

export const getUser = async (uid) => {
  try {
    const userId = doc(db, "users", uid);
    const getUserResp = await getDoc(userId);
    if (getUserResp.exists()) {
      return getUserResp.data();
    } else {
      return "No User Found";
    }
  } catch (err) {
    if (err.includes("client is offline"))
      ToastAndroid.show("No Internet Connection", ToastAndroid.LONG);
    console.log("Get User Error - ", err);
  }
};

export const updateUser = async (newPayload) => {
  try {
    const { uid, notes } = newPayload;
    const userId = doc(db, "users", uid);
    await updateDoc(userId, {
      notes: notes,
    });
    return { message: "success" };
  } catch (err) {
    console.log("Update User Error - ", err);
    return { message: "error" };
  }
};

// deleteUser
export const deleteUser = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { isActive: false });
    return { message: "success" };
  } catch (err) {
    console.log("Delete User Error - ", err);
    return { message: "error" };
  }
};
