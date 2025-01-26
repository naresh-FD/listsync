import { setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { validateCreateProfilePayload } from "../../util/helper";

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
