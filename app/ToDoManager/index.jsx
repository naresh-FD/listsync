import {
  Text,
  View,
  TouchableOpacity,
  Pressable,
  TextInput,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateNotesData } from "../firebase/controller/notesController";
import { useIsFocused } from "@react-navigation/native";
import ToDoHeader from "./components/ToDoHeader";
import styles from "./styles/ToDoManagerStyles";
import { Ionicons } from "@expo/vector-icons";
import FlatListItem from "./components/FlatListItem";
import { setToLocalStorage } from "../util/helper";
import NewListItemField from "./components/NewListItemField";
import TapToAddItem from "./components/TapToAddItem";
import ToDoRecommendation from "./components/ToDoRecommendation";
import { recommendedItems } from "../util/constants";
const ToDoManager = () => {
  //router
  const router = useRouter();
  const isFocused = useIsFocused();
  const searchParams = useLocalSearchParams();
  const itemsData = searchParams.item;

  //hooks
  const [listData, setListData] = useState(null);
  const [isEditModeOn, setIsEditModeOn] = useState(false);
  const [listItems, setListItems] = useState([]);
  //state
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
  //Search
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleMenu, setVisibleMenu] = useState(null);

  useEffect(() => {
    setListData(JSON.parse(itemsData));
  }, [itemsData]);

  //Add Suggestion List to Main List
  useEffect(() => {
    const getSuggestionSelectedList = async () => {
      let suggestionSelectedList = await AsyncStorage.getItem("suggestionList");
      if (suggestionSelectedList !== null && listData) {
        // Merge suggestion selected items with main list
        let listMetaData = listData;
        let listArray =
          typeof listData.data == "string"
            ? JSON.parse(listData.data)
            : listData.data;

        let suggestionSelectedArray = JSON.parse(suggestionSelectedList);
        let combinedList = [...listArray, ...suggestionSelectedArray];

        let combineListString = JSON.stringify(combinedList);
        // Update local list data
        setListData((listData) => ({
          ...listData,
          data: combineListString,
        }));

        // Update list in cloud and local storage
        await setToLocalStorage(combineListString, listMetaData);
        await AsyncStorage.removeItem("suggestionList");
      }
    };
    getSuggestionSelectedList();
  }, [isFocused]);
  //Controller functions
  const addItems = () => {
    setIsAddFieldOpen(!isAddFieldOpen);
  };

  //Search
  const enableSearch = () => {
    setIsSearchEnabled(!isSearchEnabled);
  };

  //Components
  //Floating Add Item Button
  const AddItemButton = () => {
    return (
      <TouchableOpacity onPress={addItems} style={styles.addItemButton}>
        <Text style={styles.addItemIcon}>+</Text>
      </TouchableOpacity>
    );
  };

  //List Items
  const [isSelectionOn, setIsSelectionOn] = useState(false);
  const [allItems, setAllItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const groupCategory = (list) => {
    let groupedObjects = {};
    Object.values(list).forEach((list) => {
      if (!groupedObjects[list.category]) {
        groupedObjects[list.category] = [];
      }
      groupedObjects[list.category].push(list);
    });
    return groupedObjects;
  };

  const RenderFlatListView = useMemo(() => {
    let listDataObject = listData;
    if (listDataObject !== null && listDataObject !== undefined) {
      let listItems = null;
      if (typeof listDataObject.data === "string") {
        listItems = JSON.parse(listDataObject.data);
      } else {
        listItems = listDataObject.data;
      }
      //  want combine both listItems and recommendedItems
      let groupedItems = groupCategory(listItems);
      setListItems(groupedItems);

      if (Object.keys(groupedItems).length !== 0) {
        return Object.entries(groupedItems).map(([category, items]) => (
          <View key={category} style={{ marginTop: 10 }}>
            <Text style={styles.categoryTitle}>{category}</Text>
            {items
              .filter((item) =>
                item.title.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((item) => (
                <FlatListItem
                  key={item.uid}
                  item={item}
                  listData={listData}
                  setListData={setListData}
                  selectedItems={selectedItems}
                  setSelectedItems={setSelectedItems}
                  allItems={allItems}
                  setAllItems={setAllItems}
                  isSelectionOn={isSelectionOn}
                  setIsSectionOn={setIsSelectionOn}
                  isEditModeOn={isEditModeOn}
                  setToLocalStorage={setToLocalStorage}
                />
              ))}
          </View>
        ));
      } else {
        return (
          <View
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text>No Items in the List</Text>
          </View>
        );
      }
    } else {
      return <Text style={styles.emptyListText}>No Items in the list.</Text>;
    }
  }, [listData, isSelectionOn, selectedItems, isEditModeOn, searchQuery]);

  const addNewItem = async (title) => {
    const getAuthor = async () => {
      const user = await AsyncStorage.getItem("user");
      let userObject = JSON.parse(user);
      return userObject.email;
    };

    try {
      if (title.length !== 0) {
        let itemAuthor = await getAuthor();
        let itemObject = {
          uid: Date.now().toString(),
          title: title,
          description: "",
          favourite: false,
          category: "Others",
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
        setSearchQuery("");
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  // list menu functions start
  const deleteAllItems = async () => {
    setListData((listData) => ({ ...listData, data: [] }));
    setToLocalStorage([], listData);
  };

  const enableEditMode = () => {
    setIsEditModeOn(!isEditModeOn);
  };

  const cancelSelection = () => {
    setIsSelectionOn(false);
  };

  const selectAllItems = () => {
    setSelectedItems(allItems);
  };

  const unSelectAllItems = () => {
    setSelectedItems([]);
  };

  const invertSelection = () => {
    let allItemsTemp = allItems;
    let allSelectedItemsTemp = selectedItems;

    allSelectedItemsTemp.forEach((item) => {
      const findObject = (listItem) => {
        return listItem === item;
      };
      let indexOfSelectedList = allItemsTemp.findIndex(findObject);
      if (indexOfSelectedList) {
        allSelectedItemsTemp.splice(indexOfSelectedList, 1);
      }
    });

    setSelectedItems(allSelectedItemsTemp);
  };

  const deleteSelectedItems = () => {
    // Don't delete any items for now.
    let allItemsTemp = allItems;
    let allSelectedItemsTemp = selectedItems;

    allItemsTemp = allItemsTemp.filter(
      (itemA) =>
        !allSelectedItemsTemp.find((itemB) => itemA.title === itemB.title)
    );

    let noDuplicateList = [...new Set(allItemsTemp)];
    setListData((listData) => ({ ...listData, data: noDuplicateList }));
    let existingitems = listData;
    setToLocalStorage(noDuplicateList, existingitems);
  };

  // list menu functions end
  return listData ? (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0047cc" }}>
      <View style={styles.toDoContainer}>
        <View style={styles.body}>
          <ToDoHeader
            listData={listData}
            router={router}
            isSelectionOn={isSelectionOn}
            enableSearch={enableSearch}
            deleteAllItems={deleteAllItems}
            enableEditMode={enableEditMode}
            cancelSelection={cancelSelection}
            selectAllItems={selectAllItems}
            unSelectAllItems={unSelectAllItems}
            invertSelection={invertSelection}
            visibleMenu={visibleMenu}
            deleteSelectedItems={deleteSelectedItems}
            isEditModeOn={isEditModeOn}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setVisibleMenu={setVisibleMenu}
          />
          <View style={styles.bodyList}>
            {isAddFieldOpen ? (
              <NewListItemField
                listData={listData}
                setListData={setListData}
                setToLocalStorage={setToLocalStorage}
              />
            ) : null}
            <ScrollView style={styles.bodyScrollViewStyles}>
              <TapToAddItem
                searchQuery={searchQuery}
                listItems={listItems}
                onCreateItem={addNewItem}
              />
              {RenderFlatListView}
              {/* <ToDoRecommendation /> */}
            </ScrollView>
          </View>
        </View>
        <View style={styles.footer}></View>
        <AddItemButton />
      </View>
    </SafeAreaView>
  ) : null;
};

export default ToDoManager;
