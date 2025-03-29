import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  View,
  TextInput,
  Pressable,
  Modal,
  StyleSheet,
  Text,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import { setToLocalStorage } from "../../util/helper";

const NewListItemField = ({ listData, setListData, visible, onClose }) => {
  const [itemTitle, setItemTitle] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemAuthor, setItemAuthor] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isFieldValid = () => itemTitle.length !== 0;

  const getAuthor = async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      if (user) {
        let userObject = JSON.parse(user);
        setItemAuthor(userObject.email);
      }
    } catch (error) {
      console.error("Error fetching user from AsyncStorage:", error);
    }
  };

  useEffect(() => {
    getAuthor();
  }, []);

  const addItem = async (title, description) => {
    if (!isFieldValid()) {
      ToastAndroid.show("Item title cannot be empty.", ToastAndroid.SHORT);
      return;
    }

    setIsLoading(true);

    try {
      let existingListCopy = listData.data;
      if (typeof existingListCopy === "string") {
        existingListCopy = JSON.parse(existingListCopy);
      }

      const isDuplicate = existingListCopy.some(
        (item) => item.title.toLowerCase() === title.toLowerCase()
      );

      if (isDuplicate) {
        Alert.alert(
          "Duplicate Item",
          `An item with the name "${title}" already exists. Do you want to add it again?`,
          [
            {
              text: "Cancel",
              onPress: () => setIsLoading(false),
              style: "cancel",
            },
            {
              text: "Add Anyway",
              onPress: () => {
                // Proceed without returning
              },
            },
          ],
          { cancelable: false }
        );
        return;
      }

      let itemObject = {
        uid: Date.now().toString(),
        title,
        description,
        favourite: false,
        category: "others",
        author: itemAuthor,
      };

      existingListCopy.push(itemObject);
      existingListCopy = JSON.stringify(existingListCopy);

      setListData((prevListData) => ({
        ...prevListData,
        data: existingListCopy,
      }));

      await setToLocalStorage(existingListCopy, listData);

      ToastAndroid.show(
        `Item "${title}" added successfully!`,
        ToastAndroid.SHORT
      );

      setItemTitle("");
      setItemDescription("");
      onClose();
    } catch (err) {
      console.log("Error adding item:", err);
      ToastAndroid.show(
        "Failed to add item. Please try again.",
        ToastAndroid.SHORT
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.dragHandle} />
          <Pressable style={styles.closeIcon} onPress={onClose}>
            <Ionicons name="close" size={24} color="#333" />
          </Pressable>
          <Text style={styles.modalTitle}>Add item</Text>
          <View style={styles.fieldsSection}>
            <TextInput
              style={[styles.modalInputField, styles.modalInputFieldTitle]}
              placeholder="Item Name"
              value={itemTitle}
              onChangeText={setItemTitle}
              placeholderTextColor="#999"
            />
            <TextInput
              style={[
                styles.modalInputField,
                styles.modalInputFieldDescription,
              ]}
              placeholder="Description"
              value={itemDescription}
              onChangeText={setItemDescription}
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.validateSection}>
            <Pressable
              onPress={() => addItem(itemTitle, itemDescription)}
              style={styles.modalSubmitButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Add</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
  },
  dragHandle: {
    width: 50,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 3,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "#333",
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 15,
  },
  fieldsSection: {
    width: "100%",
    marginTop: 10,
  },
  modalInputField: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    width: "100%",
    backgroundColor: "#F7F9FC",
  },
  validateSection: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    width: "100%",
  },
  modalSubmitButton: {
    padding: 14,
    backgroundColor: "#2979FF",
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
  },
});

NewListItemField.propTypes = {
  listData: PropTypes.shape({
    data: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  }).isRequired,
  setListData: PropTypes.func.isRequired,
  visible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

export default NewListItemField;
