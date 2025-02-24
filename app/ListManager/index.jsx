import React, { useState, useCallback, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import Header from "./components/Header";
import RenderTodoItem from "./components/RenderTodoItem";
import AddButton from "./components/AddButton";
import BottomNavigationBar from "../navigation/BottomNavigationBar";

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
    const filteredTodos = todos.filter((todo) => todo.uid !== uid);
    saveTodos(filteredTodos);
  };

  const handleEdit = (uid) => {
    router.push(`/ListManager/EditTodo?id=${uid}`);
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

  useEffect(() => {
    //Create Favourite List
    initializeFavouriteList();
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
      <Header />
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
