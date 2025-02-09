import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Share,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import Header from "./components/Header";
import RenderTodoItem from "./components/RenderTodoItem";
import AddButton from "./components/AddButton";
import BottomNavigationBar from "../navigation/BottomNavigationBar";
import * as Linking from "expo-linking";

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

  const handleShare = async (noteId) => {
    try {
      const schemeUrl = Linking.createURL(`linking/notes/${noteId}`);
      await Share.share({
        message: `Check out this List: ${schemeUrl}`,
      });
    } catch (error) {
      console.error("Error sharing item:", error);
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

  const goTo = () => {
    try {
      router.push("/linking/notes/1739004614929");
      // Linking.openURL("listSync://linking/notes/1739004614929");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Header />
      {/* <Pressable onPress={goTo}>
        <Text>Go To Linking</Text>
      </Pressable> */}
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
  },
  emptyListText: {
    textAlign: "center",
  },
});

export default TodoList;
