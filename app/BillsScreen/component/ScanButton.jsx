import React, { useState } from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  Alert,
  Modal,
  View,
  TextInput,
  Image,
} from "react-native";
import DocumentScanner from "react-native-document-scanner-plugin";
import * as FileSystem from "expo-file-system";

import closeButton from "../../../assets/icons/closeIcon.png";
import InputField from "../../../reusables/InputField";
import { formatImage, cameraImage } from "../../util/constants";
import { theme } from "../../util/theme";
import Button from "../../../reusables/Button/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ScanButton = ({
  allBills,
  setBills,
  addBill,
  fileNameModalVisible,
  setFileNameModalVisible,
  item,
}) => {
  const [tempScannedUri, setTempScannedUri] = useState("");
  const [fileNameInput, setFileNameInput] = useState(item !== null ? item : "");

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

      let storedBills = [];
      try {
        const billsJson = await AsyncStorage.getItem("bills");
        storedBills = billsJson ? JSON.parse(billsJson) : [];
      } catch (e) {
        console.error("Failed to load bills from AsyncStorage:", e);
        storedBills = [];
      }
      storedBills.push({ name: finalName, path: destinationPath });
      await AsyncStorage.setItem("bills", JSON.stringify(storedBills));

      console.log("[DEBUG] Copy completed and saved to AsyncStorage");
      addBill(finalName);
      setFileNameModalVisible(false);
      Alert.alert("Success", `File saved as: ${finalName}`);
    } catch (error) {
      console.error("[ERROR] Save failed:", error);
      Alert.alert("Error", `Save failed: ${error.message}`);
    }
  };

  const updateHandler = (value) => {
    try {
      let files = allBills.map((file) => (file === item ? value : file));
      setBills(files);
    } catch (err) {
      console.log(err);
    } finally {
      setFileNameModalVisible(false);
    }
  };

  const closeHandler = () => {
    setFileNameModalVisible(false);
  };

  const saveHandler = () => {
    if (item === null) {
      handleSave();
    } else {
      updateHandler(item);
    }
  };

  const formatOptions = ["PNG", "JPG", "PDF"];

  return (
    <>
      <Pressable onPress={scanDocument} style={styles.addButtonWrapper}>
        <View style={styles.addButton}>
          <Image source={cameraImage} style={styles.addIcon} />
          <Text style={styles.addText}>Scan</Text>
        </View>
      </Pressable>
      <Modal
        style={styles.modal}
        visible={fileNameModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFileNameModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.headerSection}>
              <View style={styles.titleSection}>
                <Text style={styles.headerSectionTitle}>
                  {`${item ? "Edit" : "Create"} Document`}
                </Text>
              </View>
              <Pressable onPress={closeHandler}>
                <Image source={closeButton} style={styles.closeButton} />
              </Pressable>
            </View>
            <View style={styles.bodySection}>
              <InputField
                type="text"
                name="name"
                label="Name"
                value={fileNameInput}
                placeholder="Enter Document name"
                onchange={(value) => setFileNameInput(value)}
              />
              <View style={styles.formatContainer}>
                <Text style={styles.formatTitle}>Format:</Text>
              </View>
              {item === null ? (
                <View style={styles.formatOptions}>
                  {formatOptions.map((option, index) => {
                    return (
                      <View key={index} style={styles.formatOption}>
                        <Image
                          source={formatImage}
                          style={styles.formatIcon}
                          alt="format-option-image"
                        />
                        <Text style={styles.formatOptionText}>{option}</Text>
                      </View>
                    );
                  })}
                </View>
              ) : null}
              <View style={styles.footer}>
                <Button label="Done" onPress={saveHandler} theme="dark" />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 25,
    position: "absolute",
    bottom: 20,
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#00000050",
  },
  modalContent: {
    height: 400,
    width: "100%",
    padding: 20,
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginVertical: 10,
    padding: 8,
  },
  saveButton: {
    width: "90%",
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  footer: {
    width: "100%",
    paddingLeft: 25,
    paddingRight: 25,
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
  headerSection: {
    width: "100%",
    flex: 0.2,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  titleSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headerSectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  closeButton: {
    width: 20,
    height: 20,
  },
  bodySection: {
    flex: 0.8,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  formatContainer: {
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: 25,
  },
  formatTitle: {
    fontSize: 14,
    fontFamily: "Poppins",
    fontWeight: "bold",
  },
  formatOptions: {
    width: "100%",
    padding: 15,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  formatOption: {
    width: 90,
    height: 50,
    borderRadius: 10,
    backgroundColor: theme.tertirary,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    marginLeft: 10,
    marginRight: 10,
  },
  formatIcon: {
    height: 30,
    width: 30,
  },
  formatOptionText: { fontSize: 16, marginLeft: 5, color: "white" },
  addButtonWrapper: {
    bottom: "8%",
    height: 50,
    width: "100%",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: theme.tertirary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  addButton: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  addIcon: {
    height: 26,
    width: 26,
  },
  addText: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
    color: theme.white,
  },
});

export default ScanButton;
