import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ToastAndroid,
  Alert,
  ImageBackground,
  Share,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import Header from "./components/Header";
import RenderTodoItem from "./components/RenderTodoItem";
import AddButton from "./components/AddButton";
import BottomNavigationBar from "../navigation/BottomNavigationBar";
import {
  checkSourceListInFavouriteList,
  getDefaultItems,
} from "../util/helper";
import { screenBgImage } from "../util/constants";
import { theme } from "./../util/theme";
import UpgradeToPremium from "../../components/UpgradeToPremiumCard";
import CreateItemDrawerModal from "../../components/CreateItemDrawerModal";
import { deleteNotes } from "../firebase/controller/notesController";

const TodoList = () => {
  const router = useRouter();
  const [todos, setTodos] = useState([]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [isCreateListDrawerOpen, setIsCreateListDrawerOpen] = useState(null);
  const [listItemMode, setListItemMode] = useState("create");

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const getTodos = async () => {
      try {
        let todos = await AsyncStorage.getItem("todos");
        setTodos(JSON.parse(todos));
      } catch (err) {
        console.log(err);
      }
    };
    getTodos();
  }, [isCreateListDrawerOpen]);

  const loadTodos = async () => {
    const storedTodos = await AsyncStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  };

  const saveTodos = async (newTodos) => {
    await AsyncStorage.setItem("todos", JSON.stringify(newTodos));
    setTodos(newTodos);
  };

  const handleDelete = async (data) => {
    try {
      Alert.alert(`Do you wish to delete this List ?`, "", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            const { uid } = data;
            let deleteResp = deleteNotes(uid);
            if (deleteResp ?? deleteResp.message === "Success") {
              ToastAndroid.show("Delete Success", ToastAndroid.SHORT);
              const filteredTodos = todos.filter((todo) => todo !== data);
              saveTodos(filteredTodos);
            }
          },
        },
      ]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddToFavourite = async (listData) => {

    console.log("Adding to Favourite List", listData);
    
    try {
      //Fav List
      const userFavouriteList = await AsyncStorage.getItem("favouriteList");
      let favListObject = JSON.parse(userFavouriteList);
      let favListData = favListObject.data;

      //List
      let selectedListData = JSON.parse(listData.data);
      let selectedListId = listData.uid ?? listData.id;

      //Add Item to Fav List
      selectedListData.forEach((item) => {
        if (!favListData.includes(item)) {
          favListData.push(item);
        }
      });
      favListObject.data = favListData;

      //Add List UID to source
      favListObject.source.push(selectedListId);

      //Set New List to Async Storage
      await AsyncStorage.setItem(
        "favouriteList",
        JSON.stringify(favListObject)
      );

      ToastAndroid.show("Added List to Favourite List", ToastAndroid.SHORT);
    } catch (err) {
      console.log("Err - Add to Fav - List ", err);
    }
  };

  const handleShare = async (text) => {
    try {
      await Share.share({ message: text });
    } catch (error) {
      alert(error.message);
    }
  };

  const goToListItems = async (data) => {
    try {
      const stringData = JSON.stringify(data);
      router.push(`/ToDoManager?item=${stringData}`);
    } catch (err) {
      console.log(err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTodos();
    }, [])
  );

  const handleCreateList = () => {
    handleAddList();
    setIsCreateListDrawerOpen(!isCreateListDrawerOpen);
  };

  const handleAddList = () => {
    setListItemMode("create");
    setSelectedItem({ title: "", description: "", listData: todos });
  };

  const handleEdit = (data) => {
    setListItemMode("edit");
    setIsCreateListDrawerOpen(!isCreateListDrawerOpen);
    setSelectedItem({
      title: data.title,
      description: data.notes,
      id: data.uid,
    });
  };

  const renderList = useMemo(() => {
    if (todos && todos.length !== 0) {
      return (
        <FlatList
          data={todos?.filter((item) => item.title.includes(searchQuery))}
          keyExtractor={(item) => item.uid}
          renderItem={(item) => (
            <RenderTodoItem
              item={item}
              onEdit={handleEdit}
              onAddToFavourite={handleAddToFavourite}
              onDelete={handleDelete}
              onShare={handleShare}
              onPress={goToListItems}
            />
          )}
        />
      );
    } else {
      return <Text style={styles.emptyListText}>No Items in the list.</Text>;
    }
  }, [todos, searchQuery]);

  return (
    <ImageBackground style={styles.container} source={screenBgImage}>
      <View style={styles.headerWrapper}>
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </View>
      <View style={styles.bodyWrapper}>
        <UpgradeToPremium />
        <View style={styles.body}>
          <Text style={styles.bodyTitle}>All List</Text>
          {renderList}
        </View>
      </View>
      <AddButton onPress={handleCreateList} type="list" />
      <BottomNavigationBar page="Lists" type="main" />
      {isCreateListDrawerOpen ? (
        <CreateItemDrawerModal
          setIsModalOpen={setIsCreateListDrawerOpen}
          type="List"
          mode={listItemMode}
          setListData={setTodos}
          fields={selectedItem}
        />
      ) : null}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
    display: "flex",
    flexDirection: "column",
  },
  headerWrapper: {
    flex: 0.2,
  },
  bodyWrapper: {
    flex: 0.8,
    width: "100%",
    height: "100%",
    backgroundColor: theme.white,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    display: "flex",
    alignItems: "center",
  },
  body: {
    width: "100%",
    height: "70%",
    padding: 25,
    paddingTop: 0,
  },
  bodyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.black,
    marginBottom: 20,
  },
  emptyListText: {
    textAlign: "center",
  },
});

export default TodoList;
