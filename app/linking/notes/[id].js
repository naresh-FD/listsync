import { SafeAreaView } from "react-native";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

//Controller
import { getNotes } from "../../firebase/controller/notesController";
import { updateUser } from "../../firebase/controller/userController";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NotesLinking = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [noteData, setNoteData] = useState(null);
  const [loaderText, setLoaderText] = useState("Loading...");

  //On-mount
  useEffect(() => {
    /**
     * Purpose - Get the Note id from params of universal link
     *           With the note id, get the data from the cloud.
     *           Redirect the screen to ToDoManager to show.
     *           Add this new list data to the existing list of the user.
     */
    const getNoteAndRedirect = async () => {
      try {
        if (id) {
          const noteData = await getNotes(String(id));
          if (noteData !== null) {
            setNoteData(noteData);
            // router.replace(`/ToDoManager?item=${JSON.stringify(noteData)}`);
          }
        }
      } catch (err) {
        console.log("Get Notes with id ", err);
      }
    };

    /**
     * Puropse - Get the Current user's notes list
     *           If the shared list id does not exist in user's list add to list and upload to cloud
     *           Upload the same list to Local Storage
     */
    const updateNoteIdToUserCloudAndLocalList = async () => {
      try {
        let user = await AsyncStorage.getItem("user");
        let userObject = JSON.parse(user);
        let isItemExist = userObject.notes.find(
          (existingItem) => existingItem.uid === id
        );
        if (!isItemExist) {
          console.log("Adding Note id to user's list");
          userObject.notes.push(String(id));

          let payload = {
            uid: userObject.uid,
            notes: JSON.stringify(userObject.notes),
          };
          await updateUser(payload);

          //LocalStorage
          await AsyncStorage.setItem("user", JSON.stringify(userObject));
        } else {
          console.log("Note Id already exist in user's list");
        }
      } catch (err) {
        console.log("updateNoteIdToUserCloudAndLocalList", err);
      }
    };

    getNoteAndRedirect();
    updateNoteIdToUserCloudAndLocalList();
  }, []);

  useEffect(() => {
    /**
     * Purpose - Signal comes from external link
     *           if there is no note data exist, it is fetched from the cloud with the note id
     *           if present, no point of showing this screen, so redirect to Home
     *           router.back() does not work.
     */
    const returnToHomeIfDataExist = () => {
      if (noteData !== null) {
        router.replace("ListManager");
      }
    };

    returnToHomeIfDataExist();
  }, [noteData]);

  const goBackHome = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {noteData !== null ? (
        <>
          <Text>Checking Notes {id}...</Text>
          <Pressable style={styles.goBack} onPress={goBackHome}>
            <Text style={styles.goBackText}>Go Back</Text>
          </Pressable>
        </>
      ) : (
        <Text>{loaderText}</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    fontFamily: "Rubik",
    backgroundColor: "#F5F5F5",
  },
  goBack: {
    marginTop: 10,
    padding: 15,
    backgroundColor: "green",
    elevation: 2,
    borderRadius: 10,
  },
  goBackText: {
    color: "white",
  },
});

export default NotesLinking;
