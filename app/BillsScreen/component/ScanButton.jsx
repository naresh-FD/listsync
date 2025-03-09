import React, { useState } from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  Alert,
  Modal,
  View,
  TextInput,
} from "react-native";
import DocumentScanner from "react-native-document-scanner-plugin";
import * as FileSystem from "expo-file-system";
import { MaterialIcons } from "@expo/vector-icons";

const ScanButton = ({ addBill }) => {
  const [fileNameModalVisible, setFileNameModalVisible] = useState(false);
  const [tempScannedUri, setTempScannedUri] = useState("");
  const [fileNameInput, setFileNameInput] = useState("");

  const scanDocument = async () => {
    try {
      const { scannedImages } = await DocumentScanner.scanDocument();
      console.log("[DEBUG] Scanned URIs:", scannedImages);

      if (scannedImages?.length > 0) {
        setTempScannedUri(scannedImages[0]);
        setFileNameModalVisible(true);
      }
    } catch (error) {
      console.error("Scanning error:", error);
      Alert.alert("Error", "Failed to scan document.");
    }
  };

  const handleSave = async () => {
    try {
      console.log("[DEBUG] Starting save process...");

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const finalName = fileNameInput.trim()
        ? `${fileNameInput.replace(/[^a-z0-9]/gi, "_")}.jpg`
        : `document_${timestamp}.jpg`;

      const destinationPath = `${FileSystem.documentDirectory}${finalName}`;

      console.log("[DEBUG] Source:", tempScannedUri);
      console.log("[DEBUG] Destination:", destinationPath);

      const sourceInfo = await FileSystem.getInfoAsync(tempScannedUri);
      if (!sourceInfo.exists) throw new Error("Source file not accessible");

      await FileSystem.copyAsync({
        from: tempScannedUri,
        to: destinationPath,
      });

      console.log("[DEBUG] Copy completed");
      addBill(finalName);
      setFileNameModalVisible(false);
      Alert.alert("Success", `File saved as: ${finalName}`);
    } catch (error) {
      console.error("[ERROR] Save failed:", error);
      Alert.alert("Error", `Save failed: ${error.message}`);
    }
  };

  return (
    <>
      <Pressable style={styles.floatingButton} onPress={scanDocument}>
        <MaterialIcons name="document-scanner" size={24} color="white" />
      </Pressable>

      <Modal
        visible={fileNameModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFileNameModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Enter file name:</Text>
            <TextInput
              style={styles.input}
              value={fileNameInput}
              onChangeText={setFileNameInput}
              placeholder="Document name"
            />
            <Pressable style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </Pressable>
            <Pressable
              style={styles.cancelButton}
              onPress={() => setFileNameModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    backgroundColor: "#007bff",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 100,
    right: 20,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginVertical: 10,
    padding: 8,
  },
  saveButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ScanButton;
