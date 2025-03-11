import React from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { MaterialIcons } from "@expo/vector-icons";

const DocumentDetailsScreen = ({ route, navigation }) => {
  const { fileName } = route.params;
  const fileUri = `${FileSystem.documentDirectory}${fileName}`;

  const shareFile = async () => {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    } else {
      Alert.alert("Error", "Sharing not available on this device");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="insert-drive-file" size={40} color="#007bff" />
        <View style={styles.headerText}>
          <Text style={styles.title}>{fileName}</Text>
          <Text style={styles.subTitle}>
            Modified: {new Date().toLocaleString()}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={styles.actionItem}
          onPress={() => Sharing.shareAsync(fileUri)}
        >
          <MaterialIcons name="share" size={24} color="#007bff" />
          <Text style={styles.actionText}>Share</Text>
        </Pressable>

        <Pressable style={styles.actionItem}>
          <MaterialIcons name="edit" size={24} color="#007bff" />
          <Text style={styles.actionText}>Rename</Text>
        </Pressable>

        <Pressable style={styles.actionItem}>
          <MaterialIcons name="cloud-upload" size={24} color="#007bff" />
          <Text style={styles.actionText}>Upload to Cloud</Text>
        </Pressable>

        <Pressable style={styles.actionItem}>
          <MaterialIcons name="delete" size={24} color="#dc3545" />
          <Text style={[styles.actionText, { color: "#dc3545" }]}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 40,
  },
  headerText: {
    marginLeft: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subTitle: {
    color: "#888",
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  actionText: {
    fontSize: 16,
    marginLeft: 10,
  },
};

export default DocumentDetailsScreen;
