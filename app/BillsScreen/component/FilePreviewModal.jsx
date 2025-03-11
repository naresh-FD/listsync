import React from "react";
import {
  Modal,
  View,
  Image,
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const FilePreviewModal = ({ fileName, onClose }) => {
  const fileUri = `${FileSystem.documentDirectory}${fileName}`;
  const isPDF = fileName.toLowerCase().endsWith(".pdf");

  const sharePdf = async () => {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    } else {
      alert("Sharing not available on this device");
    }
    onClose();
  };

  return (
    <Modal visible={true} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.container}>
        {isPDF ? (
          <>
            <ActivityIndicator size="large" color="#007bff" />
            <Text style={styles.pdfText}>
              PDFs cannot be previewed directly, tap below to open.
            </Text>
            <Pressable style={styles.openButton} onPress={sharePdf}>
              <Text style={styles.buttonText}>Open PDF</Text>
            </Pressable>
          </>
        ) : (
          <Image source={{ uri: fileUri }} style={styles.image} />
        )}
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.buttonText}>Close</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    flex: 1,
    width: "100%",
    resizeMode: "contain",
  },
  pdfText: {
    marginTop: 20,
    fontSize: 16,
    color: "#555",
  },
  openButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  closeButton: {
    backgroundColor: "#dc3545",
    padding: 12,
    borderRadius: 8,
    marginBottom: 40,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default FilePreviewModal;
