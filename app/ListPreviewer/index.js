import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { SafeAreaView, ToastAndroid, View } from "react-native";
import styles from "./ListPreviewerStyles";
import ToDoHeader from "../ToDoManager/components/ToDoHeader";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FlatList, ScrollView } from "react-native";
import RenderTodoItem from "../ListManager/components/RenderTodoItem";

const ListPreviewer = () => {
  //Router
  const router = useRouter();

  //Query Params
  const searchParams = useLocalSearchParams();
  const itemsDataList = searchParams.item;

  //Hooks
  const [allListsAvailable, setAllListsAvailable] = useState([]);
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleMenu, setVisibleMenu] = useState(null);
  const [isEditModeOn, setIsEditModeOn] = useState(false);

  //Component on-mount
  useEffect(() => {
    const getAllListsAvailable = async () => {
      let listsFromLocal = await AsyncStorage.getItem("todos");
      setAllListsAvailable(JSON.parse(listsFromLocal));
    };

    getAllListsAvailable();
  }, []);

  //Functions

  //Search
  const enableSearch = () => {
    setIsSearchEnabled(!isSearchEnabled);
  };

  const addItemsToSelectedList = async (selectedList) => {
    try {
      const selectedFavList = await AsyncStorage.getItem("selectedFavList");
      let selectedListData =
        typeof selectedList.data === "string"
          ? JSON.parse(selectedList.data)
          : selectedList.data;

      //Add the selected Items from Fav List to Selected List
      JSON.parse(selectedFavList).forEach((favItem) => {
        const exist = selectedListData.some(
          (listItem) => listItem.uid === favItem.uid
        );
        if (!exist) {
          selectedListData.push(favItem);
        }
      });

      selectedList.data = JSON.stringify(selectedListData);

      let listsFromLocal = await AsyncStorage.getItem("todos");
      let listUpdated = JSON.parse(listsFromLocal).map((item) =>
        item.uid === selectedList.uid ? selectedList : item
      );

      await AsyncStorage.setItem("todos", JSON.stringify(listUpdated));

      router.replace("ListManager");
      ToastAndroid.show("Items added to List", ToastAndroid.SHORT);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.previewerContainer}>
      <View style={styles.body}>
        <ToDoHeader
          listData={
            typeof allListsAvailable == "string"
              ? JSON.parse(allListsAvailable)
              : { allListsAvailable }
          }
          router={router}
          enableSearch={enableSearch}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setVisibleMenu={setVisibleMenu}
          isEditModeOn={isEditModeOn}
          isSelectionOn={null}
          deleteAllItems={null}
          addToFavouriteList={null}
          selectedItems={null}
          enableEditMode={null}
          cancelSelection={null}
          selectAllItems={null}
          unSelectAllItems={null}
          invertSelection={null}
          isOptionsOn={false}
        />
        <View style={styles.bodyList}>
          <ScrollView horizontal={false} style={styles.bodyScrollViewStyles}>
            <FlatList
              data={allListsAvailable}
              keyExtractor={(item) => item.uid}
              renderItem={(item) => (
                <RenderTodoItem
                  item={item}
                  onEdit={null}
                  onAddToFavourite={null}
                  onDelete={null}
                  onShare={null}
                  onPress={addItemsToSelectedList}
                  isMenuAvailable={false}
                />
              )}
            />
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default ListPreviewer;
