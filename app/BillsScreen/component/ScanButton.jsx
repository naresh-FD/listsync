import React, { useState } from "react";
import { Pressable, StyleSheet, Alert } from "react-native";
import DocumentScanner from "react-native-document-scanner-plugin";
import { MaterialIcons } from "@expo/vector-icons";
import SaveFileModal from "./SaveFileModal";

const ScanButton = ({ addBill }) => {
  const [fileNameModalVisible, setFileNameModalVisible] = useState(false);
  const [tempScannedUri, setTempScannedUri] = useState("");

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

  return (
    <>
      <Pressable style={styles.floatingButton} onPress={scanDocument}>
        <MaterialIcons name="document-scanner" size={24} color="white" />
      </Pressable>

      {fileNameModalVisible && (
        <SaveFileModal
          visible={fileNameModalVisible}
          setVisible={setFileNameModalVisible}
          tempUri={tempScannedUri}
          addBill={addBill}
          allowFormats={["jpg", "png", "pdf"]}
        />
      )}
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
    width: "100%",
    height: "100vh",
  },
  modalContent: {
    width: "100%",
    height: "100vh",
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
