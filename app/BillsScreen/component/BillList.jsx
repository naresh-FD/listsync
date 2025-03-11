import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { MaterialIcons } from "@expo/vector-icons";
import PropTypes from "prop-types";

const BillList = ({ bills }) => {
  const [fileUris, setFileUris] = useState([]);
  const [selectedUri, setSelectedUri] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const uris = bills.map((bill) => ({
      uri: `${FileSystem.documentDirectory}${bill}`,
      name: bill,
    }));
    setFileUris(uris);
  }, [bills]);

  const shareFile = async (uri) => {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      Alert.alert("Error", "Sharing not available on this device");
    }
  };

  const previewFile = (uri) => {
    setSelectedUri(uri);
    setModalVisible(true);
  };

  const renderBill = ({ item }) => (
    <View style={styles.billItem}>
      <View style={styles.billInfo}>
        <Pressable onPress={() => previewFile(item.uri)}>
          {item.name.toLowerCase().endsWith(".pdf") ? (
            <MaterialIcons name="picture-as-pdf" size={40} color="#dc3545" />
          ) : (
            <Image source={{ uri: item.uri }} style={styles.thumbnail} />
          )}
        </Pressable>
        <View style={styles.billDetails}>
          <Text style={styles.billText}>{item.name}</Text>
          <Text style={styles.modifiedText}>
            Modified on {new Date().toLocaleString()}
          </Text>
          <Pressable
            style={styles.shareButton}
            onPress={() => shareFile(item.uri)}
          >
            <MaterialIcons name="share" size={24} color="#007bff" />
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {fileUris.length === 0 ? (
        <Text style={styles.emptyText}>No items</Text>
      ) : (
        <FlatList
          data={fileUris}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderBill}
        />
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Pressable
            style={styles.modalClose}
            onPress={() => setModalVisible(false)}
          >
            <MaterialIcons name="close" size={28} color="#fff" />
          </Pressable>
          <Image source={{ uri: selectedUri }} style={styles.modalImage} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  billItem: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  billInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  billDetails: {
    flex: 1,
    marginLeft: 15,
  },
  billText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  modifiedText: {
    fontSize: 12,
    color: "#888",
  },
  shareButton: {
    marginTop: 8,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: "90%",
    height: "80%",
    resizeMode: "contain",
  },
  modalClose: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 2,
  },
});

BillList.propTypes = {
  bills: PropTypes.array.isRequired,
};

export default BillList;
