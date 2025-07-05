import React, { useState, useEffect, useMemo } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Pressable,
  Image,
  ToastAndroid,
} from "react-native";
import styles from "../styles/ToDoManagerStyles";
import { setToLocalStorage } from "../../util/helper";
import { updateNotesData } from "../../firebase/controller/notesController";

import tickIcon from "../../../assets/icons/tickIcon.png";
import editIcon from "../../../assets/icons/editIcon.png";
import deleteIcon from "../../../assets/icons/deleteIcon.png";

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
  setSelectedItem,
  setListItemMode,
  addToFavouriteListItem,
  setAddToFavouriteListItem,
  // setToLocalStorage,
}) => {
  const { uid, title, description, favourite, category, author } = item.item;
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
    setItemTitle(title);
    setItemDescription(description);
    setIsItemFavourite(favourite);
  }, [item]);

  useEffect(() => {
    const handleEditMode = () => {
      if (isEditModeOn !== undefined) {
        setEditMode(isEditModeOn);
      }
    };
    handleEditMode();
  }, [isEditModeOn]);

  const addAllItemsToList = () => {
    let allItemsTemp = allItems;
    allItemsTemp.push(item);
    setAllItems(allItemsTemp);
  };
  useEffect(() => {
    addAllItemsToList();
  }, []);

  const deleteItem = async (itemUid) => {
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
          const updatedItems = listItems.filter((item) => item.uid !== itemUid);
          listItems = updatedItems;
          setListData((prev) => ({ ...prev, data: updatedItems }));
        }
        listItems = JSON.stringify(listItems);

        listData.data = listItems;

        let updateToCloudResp = await updateNotesData({
          uid: listData.uid ?? listData.id,
          data: listData.data,
        });
        if (updateToCloudResp && updateToCloudResp.message === "Success") {
          ToastAndroid.show("Item Deleted", ToastAndroid.SHORT);
          setToLocalStorage(listItems, listData);
        } else {
          ToastAndroid.show(
            "Failed to Save to Cloud - Check Internet connection",
            ToastAndroid.SHORT
          );
        }
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

    addItemToSelection(thisItem);

    existingitems = JSON.stringify(existingitems);
    setToLocalStorage(existingitems, allItems);
  };

  const addItemToSelection = (thisItem) => {
    let currentItem = addToFavouriteListItem.find((item) => item.uid === uid);
    if (currentItem !== undefined) {
      let filteredItems = addToFavouriteListItem.filter(
        (item) => item.uid !== uid
      );
      setAddToFavouriteListItem(filteredItems);
    } else {
      addToFavouriteListItem.push(thisItem);
      setAddToFavouriteListItem(addToFavouriteListItem);
    }
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

  const handleEditButton = () => {
    const selectedItem = {
      uid: uid,
      title: itemTitle,
      description: itemDescription,
      favourite: isItemFavourite,
      author: itemAuthor,
      category: itemCategory,
      listData: listData,
    };
    setSelectedItem(selectedItem);
    setListItemMode("edit");
  };

  const editSaveToggle = () => {
    // setisFieldsEditable(!isFieldsEditable);
    handleEditButton();
  };

  useEffect(() => {
    if (!setToLocalStorage) {
      console.error("setToLocalStorage is undefined in FlatListItem");
    }
  }, [setToLocalStorage]);

  return (
    <Pressable onPress={() => setFavouriteItem(uid)}>
      <View
        style={[
          styles.listItemWrapper,
          isFieldsEditable
            ? styles.listItemEditable
            : styles.listItemUnEditable,
          isFieldsEditable ? styles.onEditlistItem : "",
          isItemFavourite && !editMode
            ? styles.listItemSelected
            : styles.listItemUnSelected,
        ]}
      >
        <View style={styles.textSection}>
          {/**---Title---*/}
          <Text
            style={[
              styles.listItemTitle,
              isItemFavourite && !editMode
                ? styles.listItemTitleSelected
                : styles.listItemTitleUnSelected,
            ]}
          >
            {itemTitle}
          </Text>

          {/**---Description---*/}
          <Text
            style={[
              styles.listItemDescription,
              isItemFavourite && !editMode
                ? styles.listItemDescriptionSelected
                : styles.listItemDescriptionUnSelected,
            ]}
          >
            {itemDescription}
          </Text>
        </View>

        {/**---Action Item--- */}
        <View
          style={[styles.actionsSection, isSelectionOn && styles.nonSelectable]}
        >
          {!editMode ? (
            <TouchableOpacity
              onPress={() => setFavouriteItem(uid)}
              style={styles.editIconWrapper}
            >
              {isItemFavourite && (
                <Image source={tickIcon} style={styles.tickIcon} />
              )}
            </TouchableOpacity>
          ) : null}
          {editMode && (
            <View style={styles.editDeleteActionContainer}>
              {/**Edit Button */}
              <TouchableOpacity
                onPress={editSaveToggle}
                style={styles.editIconWrapper}
              >
                <Image source={editIcon} style={styles.actionIcon} />
              </TouchableOpacity>

              {/**Delete Button */}
              <TouchableOpacity
                onPress={() => deleteItem(uid)}
                style={styles.editIconWrapper}
              >
                <Image source={deleteIcon} style={styles.actionIcon} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default FlatListItem;
