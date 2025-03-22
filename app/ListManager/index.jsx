import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  ToastAndroid,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import Header from "./components/Header";
import RenderTodoItem from "./components/RenderTodoItem";
import AddButton from "./components/AddButton";
import BottomNavigationBar from "../navigation/BottomNavigationBar";
import { checkSourceListInFavouriteList } from "../util/helper";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const router = useRouter();
  const [isListFavourite, setIsListFavourite] = useState(false);

  const loadTodos = async () => {
    try {
      //Check Main List and Favourite List and Load to List
      const isFavouriteListSelected = await AsyncStorage.getItem(
        "isFavListSelected"
      );
      if (JSON.parse(isFavouriteListSelected)) {
        const userFavouriteList = await AsyncStorage.getItem("favouriteList");
        if (userFavouriteList) {
          setTodos(JSON.parse(userFavouriteList).data);
        }
      } else {
        const storedTodos = await AsyncStorage.getItem("todos");
        if (storedTodos) {
          setTodos(JSON.parse(storedTodos));
        }
      }
    } catch (err) {
      console.log("loadToDo ERR - ", err);
    }
  };

  const saveTodos = async (newTodos) => {
    await AsyncStorage.setItem("todos", JSON.stringify(newTodos));
    setTodos(newTodos);
  };

  const handleDelete = async (uid) => {
    try {
      if (await checkSourceListInFavouriteList(uid)) {
        Alert.alert(
          "Do you wish to delete this List?",
          "Items in this list are added to your Favourite.",
          [
            {
              text: "Delete",
              onPress: async () => {
                const filteredTodos = todos.filter((todo) => todo.uid !== uid);
                saveTodos(filteredTodos);
              },
            },
            {
              text: "Cancel",
              onPress: () => console.log("Cancel"),
              style: "cancel",
            },
          ]
        );
      } else {
        const filteredTodos = todos.filter((todo) => todo.uid !== uid);
        saveTodos(filteredTodos);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (uid) => {
    router.push(`/ListManager/EditTodo?id=${uid}`);
  };

  const handleAddToFavourite = async (listData) => {
    try {
      //Fav List
      const userFavouriteList = await AsyncStorage.getItem("favouriteList");
      let favListObject = JSON.parse(userFavouriteList);
      let favListData = favListObject.data;

      const isObjectInArray = (favListData, listData) => {
        return favListData.some((item) => item.uid === listData.uid);
      };
      if (!isObjectInArray(favListData, listData)) {
        favListData.push(listData);
      } else {
        ToastAndroid.show("List already in Favourite List", ToastAndroid.SHORT);
      }

      favListObject.data = favListData;

      //Set New List to Async Storage
      await AsyncStorage.setItem(
        "favouriteList",
        JSON.stringify(favListObject)
      );
    } catch (err) {
      console.log("Err - Add to Fav - List ", err);
    } finally {
      ToastAndroid.show("Added List to Favourite List", ToastAndroid.SHORT);
    }
  };

  const handleRemoveFromFavourite = async (listData) => {
    try {
      //Fav List
      const userFavouriteList = await AsyncStorage.getItem("favouriteList");
      let favListObject = JSON.parse(userFavouriteList);
      let favListData = favListObject.data;

      const filterListDataFromFavList = (favListData, listData) => {
        return favListData.filter((item) => item.uid !== listData.uid);
      };

      const updatedArray = filterListDataFromFavList(favListData, listData);

      favListObject.data = updatedArray;
      setTodos(updatedArray);
      //Set New List to Async Storage
      await AsyncStorage.setItem(
        "favouriteList",
        JSON.stringify(favListObject)
      );
    } catch (err) {
      console.log("Err - Remove from Fav - List", err);
    } finally {
      ToastAndroid.show("Removed List from Favourite List", ToastAndroid.SHORT);
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

  const initializeFavouriteList = async () => {
    try {
      const userFavouriteList = await AsyncStorage.getItem("favouriteList");
      const user = await AsyncStorage.getItem("user");
      if (userFavouriteList === null) {
        let userObject = JSON.parse(user);
        const newListPayload = {
          uid: Date.now().toString(),
          title: "Favourite List",
          notes: "Personal Favourite List",
          data: [],
          admin: userObject.email,
          collaborators: [userObject.email],
        };
        await AsyncStorage.setItem(
          "favouriteList",
          JSON.stringify(newListPayload)
        );
      }
    } catch (err) {
      console.log("initializeFavouriteList", err);
    }
  };

  const checkIsListFavourite = async () => {
    try {
      const isListFavourite = await AsyncStorage.getItem("isFavListSelected");
      let favObject = JSON.parse(isListFavourite);
      setIsListFavourite(favObject);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    //Create Favourite List
    initializeFavouriteList();
    checkIsListFavourite();

    return async () => {
      const isListFavourite = await AsyncStorage.getItem("isFavListSelected");
      if (JSON.parse(isListFavourite) === true) {
        await AsyncStorage.setItem("isFavListSelected", JSON.stringify(false));
      }
    };
  }, []);

  const showFavouriteList = async () => {
    try {
      const userFavouriteList = await AsyncStorage.getItem("favouriteList");
      // console.log(userFavouriteList);
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <>
      {<Header headerType={isListFavourite} router={router} />}
      <View style={styles.container}>
        {/* <Pressable onPress={showFavouriteList}>
          <Text>View Favourite</Text>
        </Pressable> */}

        <View style={styles.body}>
          {todos.length !== 0 ? (
            <FlatList
              data={todos}
              keyExtractor={(item) => item.uid}
              renderItem={(item) => (
                <RenderTodoItem
                  item={item}
                  onEdit={handleEdit}
                  onAddToFavourite={handleAddToFavourite}
                  onRemoveFromFavourite={handleRemoveFromFavourite}
                  onDelete={handleDelete}
                  onShare={handleShare}
                  onPress={goToListItems}
                />
              )}
            />
          ) : (
            <Text style={styles.emptyListText}>No Items in the list.</Text>
          )}
          <AddButton onPress={() => router.push("/ListManager/AddTodo")} />
        </View>
      </View>
      <BottomNavigationBar page={isListFavourite ? "Favourite" : "Home"} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    fontFamily: "Rubik",
    backgroundColor: "#F5F5F5",
  },
  body: {
    flex: 1,
    marginTop: -5,
  },
  emptyListText: {
    textAlign: "center",
  },
});

export default TodoList;
