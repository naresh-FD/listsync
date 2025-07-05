import {
  Text,
  View,
  ToastAndroid,
  ImageBackground,
  FlatList,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import ToDoHeader from "./components/ToDoHeader";
import styles from "./styles/ToDoManagerStyles";
import FlatListItem from "./components/FlatListItem";
import { setToLocalStorage } from "../util/helper";
import ToDoRecommendation from "./components/ToDoRecommendation";
import { screenBgImage } from "../util/constants";
import AddButton from "../ListManager/components/AddButton";
import BottomNavigationBar from "../navigation/BottomNavigationBar";
import CreateItemDrawerModal from "../../components/CreateItemDrawerModal";
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

  //List Item
  const [selectedItem, setSelectedItem] = useState(null);
  const [listItemMode, setListItemMode] = useState("create");

  const [addToFavouriteListItem, setAddToFavouriteListItem] = useState([]);

  //Favourite List
  const loadFavouriteListFromLocalStorage = async () => {
    try {
      const storedFavouriteList = await AsyncStorage.getItem("favouriteList");
      if (storedFavouriteList) {
        setListData(JSON.parse(storedFavouriteList));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const initializeList = async () => {
      const isGuest = await AsyncStorage.getItem("isGuest");

      // If itemsData is passed, use that
      if (itemsData !== undefined) {
        setListData(JSON.parse(itemsData));
      } else {
        const storedTodos = await AsyncStorage.getItem("todos");

        if (storedTodos) {
          let todos = JSON.parse(storedTodos);

          // Ensure "My List" exists
          let myList = todos.find((item) => item.title === "My List");
          if (!myList && isGuest === "true") {
            const dummyList = {
              uid: Date.now().toString(),
              title: "My List",
              notes: "Guest default list",
              data: "[]",
              admin: null,
              collaborators: [],
            };
            todos.unshift(dummyList);
            await AsyncStorage.setItem("todos", JSON.stringify(todos));
            setListData(dummyList);
            console.log("Dummy guest list created:", dummyList);
          } else if (myList) {
            // Always keep "My List" at the top
            todos = [
              myList,
              ...todos.filter((item) => item.title !== "My List"),
            ];
            await AsyncStorage.setItem("todos", JSON.stringify(todos));
            setListData(myList);
          }
        } else if (isGuest === "true") {
          // No todos at all, first time guest
          const dummyList = {
            uid: Date.now().toString(),
            title: "My List",
            notes: "Guest default list",
            data: "[]",
            admin: null,
            collaborators: [],
          };
          await AsyncStorage.setItem("todos", JSON.stringify([dummyList]));
          setListData(dummyList);
          console.log("Dummy guest list created (no todos):", dummyList);
        }
      }
    };

    initializeList();
  }, [itemsData]);

  useEffect(() => {
    if (itemsData !== undefined) {
      const list = JSON.parse(itemsData);
      let finalList = null;
      if (typeof list === "string") {
        finalList = JSON.parse(list);
      } else {
        finalList = list;
      }
      setListData(finalList);
    }
  }, [itemsData, router]);

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
    setListItemMode("create");
    setSelectedItem({ title: "", description: "", listData: listData });
  };

  //Search
  const enableSearch = () => {
    setIsSearchEnabled(!isSearchEnabled);
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

  const handleSelectedItem = (field) => {
    setSelectedItem(field);
  };

  const RenderFlatListView = useMemo(() => {
    let listDataObject = listData;
    if (listDataObject !== null && listDataObject !== undefined) {
      let listItems = null;
      if (typeof listDataObject === "string") {
        listDataObject = JSON.parse(listDataObject);
      }
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
          <FlatList
            key={category}
            data={items.filter((item) =>
              item.title.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            keyExtractor={(item) => item.uid}
            renderItem={(item) => (
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
                setSelectedItem={handleSelectedItem}
                setListItemMode={setListItemMode}
                addToFavouriteListItem={addToFavouriteListItem}
                setAddToFavouriteListItem={setAddToFavouriteListItem}
              />
            )}
          />
        ));
      } else {
        return (
          <View
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 10,
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

  //Action - Tick
  const tickUnTickHandler = (type) => {
    let action = type === "tick" ? true : false;
    let { data } = listData;
    let updatedDataObject = JSON.parse(data).map((item) => {
      item.favourite = action;
      return item;
    });
    listData.data = JSON.stringify(updatedDataObject);
    setListData(JSON.parse(JSON.stringify(listData)));

    setToLocalStorage(listData.data, listData);
  };

  const addToFavouriteList = async () => {
    try {
      if (selectedItems.length !== 0) {
        const userList = await AsyncStorage.getItem("favouriteList");
        const userFavouriteList = JSON.parse(userList);

        let favouriteListData = userFavouriteList.data;
        selectedItems.forEach((item) => {
          if (favouriteListData.length === 0) {
            favouriteListData.push(item);
          } else {
            let isItemAvailable = favouriteListData.find(
              (favItem) => favItem.uid === item.uid
            );
            if (!isItemAvailable) {
              favouriteListData.push(item);
            } else {
              ToastAndroid.show(`Item already available!`, ToastAndroid.SHORT);
            }
          }
        });
        userFavouriteList.data = favouriteListData;

        await AsyncStorage.setItem(
          "favouriteList",
          JSON.stringify(userFavouriteList)
        );

        //Clear Selected items for new selections
        setSelectedItems([]);

        cancelSelection();
        setVisibleMenu(null);
        console.log("Added items to Fav");
      }
    } catch (err) {
      console.log("addToFavouriteList", err);
    }
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

  let parsedData =
    typeof listData === "string" ? JSON.parse(listData) : listData;

  const getRouteName = () => {
    if (parsedData && parsedData.title === "My List") {
      return "Home";
    } else if (parsedData && parsedData.title.includes("Favourite")) {
      return "Favourite";
    } else {
      return "Lists";
    }
  };

  // list menu functions end
  if (!listData) {
    return (
      <ImageBackground source={screenBgImage} style={styles.toDoContainer}>
        <View style={styles.header}>
          <ToDoHeader
            listData={null}
            router={router}
            isSelectionOn={isSelectionOn}
            enableSearch={enableSearch}
            deleteAllItems={deleteAllItems}
            addToFavouriteList={addToFavouriteList}
            selectedItems={selectedItems}
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
            addToFavouriteListItem={addToFavouriteListItem}
            setAddToFavouriteListItem={setAddToFavouriteListItem}
            tickUnTickHandler={tickUnTickHandler}
          />
        </View>
        <View style={styles.body}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 40,
            }}
          >
            <Text style={styles.emptyListText}>
              Please add new data to get started.
            </Text>
          </View>
        </View>
        <AddButton onPress={addItems} type="item" />
        <BottomNavigationBar page="Home" type="main" />
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={screenBgImage} style={styles.toDoContainer}>
      <View style={styles.header}>
        <ToDoHeader
          listData={
            typeof listData == "string" ? JSON.parse(listData) : listData
          }
          router={router}
          isSelectionOn={isSelectionOn}
          enableSearch={enableSearch}
          deleteAllItems={deleteAllItems}
          addToFavouriteList={addToFavouriteList}
          selectedItems={selectedItems}
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
          addToFavouriteListItem={addToFavouriteListItem}
          setAddToFavouriteListItem={setAddToFavouriteListItem}
          tickUnTickHandler={tickUnTickHandler}
        />
      </View>
      <View style={styles.body}>
        <View style={styles.bodyScrollViewStyles}>
          {searchQuery?.length === 0 ? (
            RenderFlatListView
          ) : (
            <ToDoRecommendation query={searchQuery} onAdd={addNewItem} />
          )}
        </View>
      </View>
      <AddButton onPress={addItems} type="item" />
      <BottomNavigationBar page={getRouteName()} type="main" />
      {selectedItem !== null ? (
        <CreateItemDrawerModal
          setIsModalOpen={setSelectedItem}
          type="Item"
          mode={listItemMode}
          fields={selectedItem}
          setListData={setListData}
        />
      ) : null}
    </ImageBackground>
  );
};

export default ToDoManager;
