import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Pressable,
  TextInput,
  Image,
} from "react-native";
import { Checkbox } from "react-native-paper";
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import styles from "../styles/ToDoManagerStyles";
import { setToLocalStorage } from "../../util/helper";
const FlatListItem = ({
  item,
  listData,
  setListData,
  selectedItems,
  setSelectedItems,
  allItems,
  setAllItems,
  isSelectionOn,
  setIsSectionOn,
  isEditModeOn,
  // setToLocalStorage,
}) => {
  const { uid, title, description, favourite, category, author } = item;
  const [itemTitle, setItemTitle] = useState(title);
  const [itemDescription, setItemDescription] = useState(description);
  const [isFieldsEditable, setisFieldsEditable] = useState(false);
  const [isItemFavourite, setIsItemFavourite] = useState(
    favourite !== undefined ? favourite : true
  );
  const [itemCategory, setItemCategory] = useState(
    category !== undefined ? category : "No Category"
  );
  const [itemAuthor, setItemAuthor] = useState(author);
  const [checked, setChecked] = useState(selectedItems.includes(item));
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setEditMode(isEditModeOn);
  }, [isEditModeOn]);

  const addAllItemsToList = () => {
    let allItemsTemp = allItems;
    allItemsTemp.push(item);
    setAllItems(allItemsTemp);
  };
  useEffect(() => {
    addAllItemsToList();
  }, []);

  const editSaveToggle = () => {
    setisFieldsEditable(!isFieldsEditable);
  };

  // const saveItem = (uid) => {
  //   try {
  //     let existingitems = listData;
  //     if (existingitems) {
  //       let listItems =
  //         typeof existingitems.data === "string"
  //           ? JSON.parse(existingitems.data)
  //           : existingitems.data;

  //       let thisItem = listItems.find((items) => items.uid === uid);
  //       thisItem.title = itemTitle;
  //       thisItem.description = itemDescription;
  //       thisItem.category = itemCategory;

  //       const index = listItems.findIndex((listItem) => listItem === thisItem);
  //       listItems[index] = thisItem;

  //       listItems = JSON.stringify(listItems);

  //       setToLocalStorage(listItems, existingitems);
  //       editSaveToggle();
  //     }
  //   } catch (err) {
  //     console.log("Save Item Error -", err);
  //   }
  // };

  const saveItem = (uid) => {
    try {
      let existingitems = listData;
      if (existingitems) {
        let listItems =
          typeof existingitems.data === "string"
            ? JSON.parse(existingitems.data)
            : existingitems.data;

        let thisItem = listItems.find((items) => items.uid === uid);
        thisItem.title = itemTitle;
        thisItem.description = itemDescription;
        thisItem.category = itemCategory;

        const index = listItems.findIndex((listItem) => listItem === thisItem);
        listItems[index] = thisItem;

        listItems = JSON.stringify(listItems);

        setToLocalStorage(listItems, existingitems);
        editSaveToggle();
      }
    } catch (err) {
      console.error("Save Item Error -", err);
    }
  };

  const deleteItem = (uid) => {
    try {
      let existingItems = listData;
      if (existingItems) {
        let listItems =
          typeof existingItems.data === "string"
            ? JSON.parse(existingItems.data)
            : existingItems.data;

        if (listItems.length === 1) {
          setListData((prev) => ({ ...prev, data: [] }));
        } else {
          let thisItem = listItems.find((items) => items.uid === uid);
          const index = listItems.findIndex(
            (listItem) => listItem === thisItem
          );
          listItems.splice(index, 1);
          setListData((prev) => ({ ...prev, data: listItems }));
        }
        listItems = JSON.stringify(listItems);
        setToLocalStorage(listItems, listData);
      }
    } catch (err) {
      console.log("Delete Item Error -", err);
    }
  };

  const setFavouriteItem = (uid) => {
    setIsItemFavourite(!isItemFavourite);

    let allItems = listData;
    let existingitems =
      typeof allItems.data === "string"
        ? JSON.parse(allItems.data)
        : allItems.data;

    let thisItem = existingitems.find((items) => items.uid === uid);
    thisItem.favourite = !isItemFavourite;

    const index = existingitems.findIndex((listItem) => listItem === thisItem);
    existingitems[index] = thisItem;

    existingitems = JSON.stringify(existingitems);
    setToLocalStorage(existingitems, allItems);
  };

  const onLongPress = () => {
    setIsSectionOn(true);
  };

  const selectItem = (item) => {
    let templist = selectedItems;
    const tempCheck = !checked;
    if (tempCheck) {
      const exists = selectedItems.some(
        (existingItem) => existingItem.uid === item.uid
      );
      if (!exists) {
        templist.push(item);
      }
    } else {
      const index = templist.findIndex((listItem) => listItem === item);
      templist.splice(index, 1);
    }
    setSelectedItems(templist);
    setChecked(!checked);
  };

  useEffect(() => {
    if (!setToLocalStorage) {
      console.error("setToLocalStorage is undefined in FlatListItem");
    }
  }, [setToLocalStorage]);

  return (
    <Pressable onLongPress={onLongPress} onPress={() => setFavouriteItem(uid)}>
      <View
        style={[
          styles.listItemWrapper,
          isFieldsEditable
            ? styles.listItemEditable
            : styles.listItemUnEditable,
          isFieldsEditable ? styles.onEditlistItem : "",
          {
            borderWidth: 1,
            borderColor: "#cccccc",
            margin: 2,
            minHeight: 50,
            padding: 5,
          },
        ]}
      >
        {isSelectionOn ? (
          <View style={styles.selectionSection}>
            <Checkbox
              color="#007BFF"
              status={checked ? "checked" : "unchecked"}
              onPress={() => selectItem(item)}
            />
          </View>
        ) : null}
        <View style={styles.textSection}>
          <TextInput
            style={styles.listItemTitle}
            placeholder="title"
            editable={isFieldsEditable}
            value={itemTitle}
            onChangeText={setItemTitle}
          />
          {editMode || itemDescription?.length !== 0 ? (
            <TextInput
              style={styles.listItemDescription}
              editable={isFieldsEditable}
              placeholder="description..."
              value={itemDescription}
              onChangeText={setItemDescription}
            />
          ) : null}
          {/* {itemAuthor?.length !== 0 && (
            <Text style={styles.authorTitle}>
              Author - {itemAuthor.length === 0 ? "unknown" : itemAuthor}
            </Text>
          )} */}
          {isFieldsEditable && (
            <View style={styles.categoryContainer}>
              <Image
                style={styles.labelIcon}
                source={require("../../../assets/images/tag.png")}
              />
              <TextInput
                style={styles.listCategoryTitle}
                editable={isFieldsEditable}
                placeholder={itemCategory}
                value={itemCategory}
                onChangeText={setItemCategory}
              />
            </View>
          )}
        </View>
        <View
          style={[styles.actionsSection, isSelectionOn && styles.nonSelectable]}
        >
          {!editMode ? (
            <TouchableOpacity
              onPress={() => setFavouriteItem(uid)}
              style={styles.editIconWrapper}
            >
              {isItemFavourite && (
                <Entypo name="check" size={24} color="#03a071" />
              )}
            </TouchableOpacity>
          ) : null}
          {editMode && (
            <View style={styles.editDeleteActionContainer}>
              {!isFieldsEditable ? (
                <TouchableOpacity
                  onPress={editSaveToggle}
                  style={styles.editIconWrapper}
                >
                  <MaterialIcons name="edit" size={24} color="#202020" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => saveItem(uid)}
                  style={styles.editIconWrapper}
                >
                  <Ionicons name="checkmark" size={24} color="green" />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => deleteItem(uid)}
                style={styles.editIconWrapper}
              >
                <MaterialIcons name="delete" size={24} color="#ff2525" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default FlatListItem;
