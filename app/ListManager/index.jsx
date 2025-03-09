import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ToastAndroid,
  Alert,
  SafeAreaView,
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

      //List
      let selectedListData = JSON.parse(listData.data);
      let selectedListId = listData.uid;

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
          source: [],
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

  useEffect(() => {
    //Create Favourite List
    initializeFavouriteList();
  }, []);

  // const showFavouriteList = async () => {
  //   try {
  //     const userFavouriteList = await AsyncStorage.getItem("favouriteList");
  //     // console.log(userFavouriteList);
  //   } catch (err) {
  //     console.log("err", err);
  //   }
  // };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0047cc" }}>
      <Header />
      <View style={styles.container}>
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
      <BottomNavigationBar page="Home" />
    </SafeAreaView>
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
