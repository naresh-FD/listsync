import { View, Text, Image, Pressable, ToastAndroid } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { CreateItemDrawerStyles as styles } from "./createItemDrawerStyles";

import closeButton from "../../assets/icons/closeIcon.png";
import starUnFilled from "../../assets/icons/unFilledStarIcon.png";
import starFilled from "../../assets/icons/filledStarIcon.png";
import { useState, useEffect } from "react";
import Button from "../../reusables/Button/Button";
import InputField from "../../reusables/InputField/index";
import collaboratorImage from "../../assets/icons/collaboratorImage.png";
import { setToLocalStorage } from "../../app/util/helper";
import { getDefaultItems } from "../../app/util/helper";
import {
  createNotes,
  updateNotesMetaData,
  updateNotesData,
} from "../../app/firebase/controller/notesController";
import { updateUser } from "../../app/firebase/controller/userController";

const CreateItemDrawerModal = ({
  setIsModalOpen,
  type,
  fields,
  mode,
  setListData,
}) => {
  const [formField, setFormField] = useState(fields);

  //Meta Data - Item
  const [itemTitle, setItemTitle] = useState(fields?.title ? fields.title : "");
  const [itemDescription, setItemDescription] = useState(
    fields?.description ? fields.description : ""
  );
  const [itemAuthor, setItemAuthor] = useState(
    fields?.author ? fields.author : ""
  );
  const [isItemFavourite, setIsItemFavourite] = useState(formField?.favourite);

  //Meta Data - List
  const [listTitle, setListTitle] = useState(fields?.title ?? "");
  const [listNotes, setListNotes] = useState(fields?.description ?? "");

  //Handlers
  const handleFavourite = () => {
    setIsItemFavourite(!isItemFavourite);
  };

  const closeHandler = () => {
    setIsModalOpen(null);
  };

  const getModalTypeAndMode = () => {
    return `${mode === "edit" ? "Edit " : "Create New "}${
      type === "List" ? "List" : "Item"
    }`;
  };

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
  useEffect(() => {
    getAuthor();
  }, []);

  //List Item Actions
  const addListItem = async () => {
    try {
      if (isFieldValid()) {
        let { listData } = formField;
        const { uid } = listData;
        let itemObject = {
          uid: Date.now().toString(),
          title: itemTitle,
          description: itemDescription,
          favourite: false,
          category: "others",
          author: itemAuthor,
        };

        let parsedListData =
          typeof listData === "string" ? JSON.parse(listData) : listData;
        let existingListCopy =
          typeof parsedListData.data === "string"
            ? JSON.parse(parsedListData.data)
            : parsedListData.data;

        existingListCopy.push(itemObject);

        existingListCopy = JSON.stringify(existingListCopy);

        listData.data = existingListCopy;
        setListData(JSON.parse(JSON.stringify(listData)));
        if (
          typeof listData === "string"
            ? JSON.parse(listData).title.includes("Favourite")
            : listData.title.includes("Favourite")
        ) {
          const favouriteList = await AsyncStorage.getItem("favouriteList");
          const favouriteListObject = JSON.parse(favouriteList);
          favouriteListObject.data = existingListCopy;
          await AsyncStorage.setItem(
            "favouriteList",
            JSON.stringify(favouriteListObject)
          );
          closeHandler();
        } else {
          let updateNotesResp = await updateNotesData({
            uid: uid,
            data: existingListCopy,
          });
          if (updateNotesResp ?? updateNotesResp.message === "Success") {
            ToastAndroid.show("Item Created", ToastAndroid.SHORT);
            setToLocalStorage(existingListCopy, listData);
            closeHandler();
          } else {
            ToastAndroid.show(
              "Error Saving to Cloud - Check Internet Connection",
              ToastAndroid.SHORT
            );
          }
        }
      }
    } catch (err) {
      console.log("Error adding item:", err);
    }
  };

  const editListItem = async () => {
    try {
      const { listData, uid } = formField;
      let existingitems = listData;
      if (existingitems) {
        let listItems =
          typeof existingitems.data === "string"
            ? JSON.parse(existingitems.data)
            : existingitems.data;

        let thisItem = listItems.find((items) => items.uid === uid);
        thisItem.title = itemTitle;
        thisItem.description = itemDescription;

        const index = listItems.findIndex((listItem) => listItem === thisItem);
        listItems[index] = thisItem;

        listItems = JSON.stringify(listItems);

        existingitems.data = listItems;
        setListData(JSON.parse(JSON.stringify(existingitems)));

        const updateNotesResp = await updateNotesData({
          uid: existingitems.uid,
          data: listItems,
        });
        if (updateNotesResp ?? updateNotesResp.message === "Success") {
          setToLocalStorage(listItems, existingitems);
          ToastAndroid.show("Item Updated", ToastAndroid.SHORT);
          closeHandler();
        } else {
          ToastAndroid.show(
            "Error Saving to Cloud - Check Internet Connection",
            ToastAndroid.SHORT
          );
        }
      }
    } catch (err) {
      console.error("Save Item Error -", err);
    }
  };

  //List Actions
  const addList = async () => {
    try {
      if (listTitle.length !== 0 && listNotes.length !== 0) {
        const storedTodos = await AsyncStorage.getItem("todos");
        const savedUser = await AsyncStorage.getItem("user");

        let todos = storedTodos ? JSON.parse(storedTodos) : [];

        // If user is not found, just save locally
        if (!savedUser) {
          const newTodo = {
            uid: Date.now().toString(),
            title: listTitle,
            notes: listNotes,
            data: JSON.stringify([]),
            admin: null,
            collaborators: [],
          };
          todos.push(newTodo);
          await AsyncStorage.setItem("todos", JSON.stringify(todos));
          setIsModalOpen(false);
          ToastAndroid.show("Created List (local only)", ToastAndroid.SHORT);
          return;
        }

        let userObject = JSON.parse(savedUser);
        if (userObject) {
          const { uid, email } = userObject;
          let defaultItems = getDefaultItems(email);

          const newTodo = {
            uid: Date.now().toString(),
            title: listTitle,
            notes: listNotes,
            data: JSON.stringify(defaultItems),
            admin: email,
            collaborators: [email],
          };

          //Create the Notes in Cloud
          let createNotesResp = await createNotes(newTodo);

          if (createNotesResp?.message === "Success") {
            //update the notes Id to user in Cloud
            if (typeof userObject.notes === "string") {
              userObject.notes = JSON.parse(userObject.notes);
            }
            if (!Array.isArray(userObject.notes)) {
              userObject.notes = [];
            }
            userObject.notes.push(newTodo.uid);

            let updateNoteIdToUserResp = await updateUser({
              uid: uid,
              notes: JSON.stringify(userObject.notes),
            });

            if (updateNoteIdToUserResp?.message === "success") {
              todos.push(newTodo);

              await AsyncStorage.setItem("todos", JSON.stringify(todos));
              await AsyncStorage.setItem("user", JSON.stringify(userObject));
              setIsModalOpen(false);
              ToastAndroid.show("Created List", ToastAndroid.SHORT);
            } else {
              ToastAndroid.show(
                "Error Adding Notes to User Profile, Try Again after sometime..",
                ToastAndroid.SHORT
              );
            }
          } else {
            ToastAndroid.show(
              "Error creating Notes on Cloud, Try Again after sometime..",
              ToastAndroid.SHORT
            );
          }
        }
      } else {
        alert("Please enter all fields");
      }
    } catch (err) {
      console.log("Save to do Error", err);
    }
  };

  const editList = async (id) => {
    try {
      let updatedTodos;
      const storedTodos = await AsyncStorage.getItem("todos");
      let todos = storedTodos ? JSON.parse(storedTodos) : [];
      if (formField.id) {
        //Update to Cloud
        let updateNotesPayload = {
          uid: formField.id,
          title: listTitle,
          notes: listNotes,
        };
        let updateNotesResp = await updateNotesMetaData(updateNotesPayload);
        if (updateNotesResp) {
          // Edit existing todo
          updatedTodos = todos.map((todo) =>
            todo.uid === id ? { ...todo, title, notes } : todo
          );
          ToastAndroid.show("Changes saved", ToastAndroid.SHORT);
        }
      } else {
        // Add new todo
        const newTodo = { id: Date.now().toString(), title, notes };
        updatedTodos = [...todos, newTodo];
        ToastAndroid.show("New Item created", ToastAndroid.SHORT);
      }
    } catch (err) {
      console.log("Edit List Err", err);
    } finally {
      await AsyncStorage.setItem("todos", JSON.stringify(updatedTodos));
      closeHandler();
    }
  };

  const handleModalAction = () => {
    switch (type) {
      case "List":
        switch (mode) {
          case "edit":
            editList();
            break;
          case "create":
            addList();
            break;
          default:
            break;
        }
        break;
      case "Item":
        switch (mode) {
          case "edit":
            editListItem();
            break;
          case "create":
            addListItem();
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.drawerWrapper}>
      <View style={styles.drawerContainer}>
        <View style={styles.headerSection}>
          <View style={styles.titleSection}>
            <Text style={styles.headerSectionTitle}>
              {getModalTypeAndMode()}
            </Text>
            {mode === "edit" && type === "Item" ? (
              <Pressable onPress={handleFavourite}>
                <Image
                  source={isItemFavourite ? starFilled : starUnFilled}
                  style={styles.starIcon}
                />
              </Pressable>
            ) : null}
          </View>
          <Pressable onPress={closeHandler}>
            <Image source={closeButton} style={styles.closeButton} />
          </Pressable>
        </View>
        <View style={styles.bodySection}>
          {type === "List" ? (
            <>
              <InputField
                type="text"
                name="title"
                label="Title"
                value={listTitle}
                placeholder="Enter List Title"
                onchange={(value) => setListTitle(value)}
              />
              <InputField
                type="text"
                name="description"
                label="Description (optional)"
                value={listNotes}
                placeholder="Enter List Description"
                onchange={(value) => setListNotes(value)}
              />
            </>
          ) : (
            <>
              <InputField
                type="text"
                name="title"
                label="Title"
                value={itemTitle}
                placeholder="Enter Item Title"
                onchange={(value) => setItemTitle(value)}
              />
              <InputField
                type="text"
                name="description"
                label="Notes"
                value={itemDescription}
                placeholder="Enter Item Notes"
                onchange={(value) => setItemDescription(value)}
              />
            </>
          )}
          {mode === "edit" && type === "list" ? (
            <View style={styles.collaboratorSection}>
              <Text style={styles.collaboratorTitle}>Collaborators</Text>
              <View style={styles.collaborator}>
                <View style={styles.leftSection}>
                  <Image
                    source={collaboratorImage}
                    alt="collaborator-profile"
                    style={styles.collaboratorImage}
                  />
                  <Text>{itemAuthor}</Text>
                </View>
                <View style={styles.rightSection}>
                  <Text>admin</Text>
                </View>
              </View>
            </View>
          ) : null}
        </View>
        <View style={styles.footerSection}>
          <Button
            onPress={() => handleModalAction()}
            label="Done"
            theme="dark"
          />
        </View>
      </View>
    </View>
  );
};

export default CreateItemDrawerModal;
