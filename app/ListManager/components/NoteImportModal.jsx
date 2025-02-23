import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  TextInput,
  ToastAndroid,
} from "react-native";
import { useRouter } from "expo-router";

//Controller
import { getNotes } from "../../firebase/controller/notesController";

const NoteImportModal = ({ modalHandler }) => {
  const router = useRouter();

  const [noteId, setNoteId] = useState(0);

  const importNote = async () => {
    if (noteId.length === 13) {
      const noteData = await getNotes(String(noteId));
      console.log("123123", noteData);
      if (noteData !== null) {
        modalHandler(false);
        router.push(`/linking/notes/${noteId}`);
        //   router.push("/linking/notes/1739004614929");
      } else {
        ToastAndroid.show("Invalid Note Id", ToastAndroid.SHORT);
      }
    } else {
      ToastAndroid.show("Invalid Note Id", ToastAndroid.SHORT);
    }
  };

  cancelImportNote = () => {
    modalHandler(false);
  };

  return (
    <View style={styles.modalWrapper}>
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Import Note</Text>
        </View>
        <View style={styles.modalBody}>
          <TextInput
            placeholder="Enter Note id to Import.."
            value={noteId}
            onChangeText={setNoteId}
            style={styles.inputField}
            placeholderTextColor="#00000050"
          />
        </View>
        <View style={styles.modalFooter}>
          <Pressable onPress={cancelImportNote} style={styles.modalButtons}>
            <Text style={styles.modalButtonText}>Cancel</Text>
          </Pressable>
          <Pressable onPress={importNote} style={styles.modalButtons}>
            <Text style={styles.modalButtonText}>Import</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalWrapper: {
    width: "100%",
    height: "100%",
    backgroundColor: "#00000050",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    userSelect: "none",
  },
  modalContainer: {
    width: "70%",
    height: "20%",
    borderRadius: 20,
    elevation: 4,
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
  },
  modalHeader: {
    width: "100%",
    flex: 0.25,
    display: "flex",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 23,
  },
  modalBody: {
    width: "100%",
    flex: 0.6,
    display: "flex",
    alignItems: "center",
    marginTop: 15,
  },
  inputField: {
    width: "100%",
    borderColor: "black",
    borderWidth: 0.5,
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#ffffff90",
    color: "black",
    fontWeight: "700",
    paddingLeft: 20,
    marginBottom: 20,
  },
  modalFooter: {
    width: "100%",
    flex: 0.2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  modalButtons: {
    paddingLeft: 25,
    paddingRight: 25,
    height: 40,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007BFF",
    margin: 5,
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
});

export default NoteImportModal;
