import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert, Modal } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import PropTypes from "prop-types";
import { FontAwesome5 } from "@expo/vector-icons";

const SaveFileModal = ({ setVisible, tempUri, addBill, allowFormats }) => {
  const [fileNameInput, setFileNameInput] = useState("");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const defaultFileName = `document_${timestamp}`;
  const [selectedFormat, setSelectedFormat] = useState("jpg");

  const handleSave = async () => {
    try {
      const finalName = fileNameInput.trim()
        ? `${fileNameInput.replace(/[^a-z0-9]/gi, "_")}.${selectedFormat}`
        : `document_${timestamp}.${selectedFormat}`;

      const destinationPath = `${FileSystem.documentDirectory}${finalName}`;

      await FileSystem.copyAsync({
        from: tempUri,
        to: destinationPath,
      });

      addBill(finalName);
      Alert.alert("Success", `File saved as: ${finalName}`);
      setVisible(false);
    } catch (error) {
      Alert.alert("Error", `Save failed: ${error.message}`);
    }
  };

  const getIcon = (format) => {
    switch (format) {
      case "jpg":
      case "png":
        return <FontAwesome5 name="file-image" size={24} color={selectedFormat === format ? "#fff" : "#007bff"} />;
      case "pdf":
        return <FontAwesome5 name="file-pdf" size={24} color={selectedFormat === "pdf" ? "#fff" : "#007bff"} />;
      default:
        return null;
    }
  };

  return (
    <Modal visible={true} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.popupContainer}>
          <Text style={styles.title}>Save Your Document</Text>
          <TextInput
            style={styles.input}
            value={fileNameInput}
            onChangeText={setFileNameInput}
            placeholder="Document Name"
            placeholderTextColor="#888"
          />
          <Text style={styles.subtitle}>Choose Format</Text>
          <View style={styles.formatOptions}>
            {allowFormats.map((format) => (
              <Pressable
                key={format}
                style={[styles.formatButton, selectedFormat === format && styles.selectedFormat]}
                onPress={() => setSelectedFormat(format)}
              >
              {getIcon(format)}
              <Text style={[styles.formatText, selectedFormat === format && styles.selectedFormatText]}>
                {format.toUpperCase()}
              </Text>
            </Pressable>
            ))}
          </View>
          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </Pressable>
          <Pressable style={styles.cancelButton} onPress={() => setVisible(false)}>
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>
        </View>
        </View>
      </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  popupContainer: {
    width: "100%",
    backgroundColor: "#f4f4f4",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: "center",
    paddingBottom: 40,
    paddingTop: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#555",
  },
  input: {
    height: 50,
    borderColor: "#007bff",
    borderWidth: 2,
    borderRadius: 10,
    width: "100%",
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  formatOptions: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginBottom: 20,
  },
  formatButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: "#007bff",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  selectedFormat: {
    backgroundColor: "#007bff",
  },
  selectedFormatText: {
    color: "#fff",
  },
  formatText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007bff",
    marginLeft: 5,
  },
  saveButton: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

SaveFileModal.propTypes = {
  setVisible: PropTypes.func.isRequired,
  tempUri: PropTypes.string.isRequired,
  addBill: PropTypes.func.isRequired,
  allowFormats: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default SaveFileModal;
