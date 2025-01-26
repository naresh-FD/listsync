import React, { useState } from "react";
import PropTypes from "prop-types";
import { View, TextInput, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import { setToLocalStorage } from "../../util/helper";
import styles from "../styles/ToDoManagerStyles";

const NewListItemField = ({ listData, setListData }) => {
  const [itemTitle, setItemTitle] = useState("");

  const [itemDescription, setItemDescription] = useState("");

  const [itemAuthor, setItemAuthor] = useState("");

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

  // Fetch author when the component mounts.
  React.useEffect(() => {
    getAuthor();
  }, []);

  const addItem = (title, description) => {
    try {
      if (isFieldValid()) {
        let itemObject = {
          uid: Date.now().toString(),
          title: title,
          description: description,
          favourite: false,
          category: "others",
          author: itemAuthor,
        };

        let existingListCopy = listData.data;
        if (typeof existingListCopy === "string") {
          existingListCopy = JSON.parse(existingListCopy);
        }
        existingListCopy.push(itemObject);
        existingListCopy = JSON.stringify(existingListCopy);

        setListData((listData) => ({
          ...listData,
          data: existingListCopy,
        }));
        setToLocalStorage(existingListCopy, listData);
      }
    } catch (err) {
      console.log("Error adding item:", err);
    }
  };

  return (
    <View style={styles.listModalContainer}>
      <View style={styles.fieldsSection}>
        <TextInput
          style={[styles.modalInputField, styles.modalInputFieldTitle]}
          placeholder="Title"
          value={itemTitle}
          onChangeText={setItemTitle}
        />
        <TextInput
          style={[styles.modalInputField, styles.modalInputFieldDescription]}
          placeholder="Description"
          value={itemDescription}
          onChangeText={setItemDescription}
        />
      </View>
      <View style={styles.validateSection}>
        <Pressable
          onPress={() => addItem(itemTitle, itemDescription)}
          style={styles.modalSubmitButton}
        >
          {isFieldValid() ? (
            <Ionicons name="checkmark" size={24} color="green" />
          ) : (
            <Ionicons name="close" size={24} color="red" />
          )}
        </Pressable>
      </View>
    </View>
  );
};
NewListItemField.propTypes = {
  listData: PropTypes.shape({
    data: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  }).isRequired,
  setListData: PropTypes.func.isRequired,
};

export default NewListItemField;
