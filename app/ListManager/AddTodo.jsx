import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { createNotes } from "../firebase/controller/notesController";
import { getDefaultItems } from "../util/helper";
import { updateUser } from "../firebase/controller/userController";

const AddTodo = () => {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const router = useRouter();

  const saveTodo = async () => {
    if (title.length !== 0 && notes.length !== 0) {
      const storedTodos = await AsyncStorage.getItem("todos");
      const savedUser = await AsyncStorage.getItem("user");
      let userObject = JSON.parse(savedUser);
      let todos = storedTodos ? JSON.parse(storedTodos) : [];

      if (userObject) {
        const { uid, email } = userObject;
        let defaultItems = getDefaultItems(email);

        const newTodo = {
          uid: Date.now().toString(),
          title,
          notes,
          data: JSON.stringify(defaultItems),
          admin: email,
          collaborators: [email],
        };

        let createNotesResp = await createNotes(newTodo);

        if (createNotesResp?.message === "Success") {
          typeof userObject.notes === "string"
            ? (userObject.notes = JSON.parse(userObject.notes))
            : (userObject.notes = userObject.notes);
          userObject.notes.push(newTodo.uid);

          let updateNoteIdToUserResp = await updateUser({
            uid: uid,
            notes: JSON.stringify(userObject.notes),
          });

          if (updateNoteIdToUserResp?.message === "success") {
            if (todos.length !== 0) {
              todos.push(newTodo);
            } else {
              todos = [newTodo];
            }

            await AsyncStorage.setItem("todos", JSON.stringify(todos));
            await AsyncStorage.setItem("user", JSON.stringify(userObject));
            router.back();
          } else {
            ToastAndroid.show(
              "Error Adding Notes to User Profile, Try Again after sometime..",
              ToastAndroid.SHORT
            );
          }
        } else {
          ToastAndroid.show(
            "Error creating Notes on Cloud, Try Again after sometime..",
            ToastAndroid.SHORT
          );
          console.log("create note error resp", createNotesResp);
        }
      }
    } else {
      alert("Please enter all fields");
    }
  };

  const cancelTodo = () => {
    router.back();
  };

  return (
    <View style={styles.overlay}>
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={cancelTodo}
      />
      <View style={styles.modal}>
        <TouchableOpacity style={styles.closeButton} onPress={cancelTodo}>
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>

        <Text style={styles.bodyTitle}>Create List</Text>

        <TextInput
          placeholder="Enter List Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <TextInput
          placeholder="Enter List Notes"
          value={notes}
          onChangeText={setNotes}
          style={[styles.input, styles.textArea]}
          multiline
        />
        <View style={styles.actionButtonContainer}>
          <Pressable style={styles.actionButton} onPress={saveTodo}>
            <Text style={styles.actionButtonText}>Save</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={cancelTodo}>
            <Text style={styles.actionButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0)",
    justifyContent: "flex-end",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
  },
  modal: {
    height: "80%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 50,
    elevation: 10,
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 10,
  },
  closeText: {
    fontSize: 24,
    color: "#999",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 8,
    fontFamily: "Rubik",
  },
  textArea: {
    height: "40%",
    textAlignVertical: "top",
    padding: 10,
    fontFamily: "Rubik",
  },
  bodyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  actionButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  actionButton: {
    paddingHorizontal: 35,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007BFF",
    margin: 10,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
});

export default AddTodo;
