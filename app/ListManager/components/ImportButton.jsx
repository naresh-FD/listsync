import React from "react";
import PropTypes from "prop-types";
import { TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const ImportButton = ({ onPress }) => (
  <TouchableOpacity style={styles.importButton} onPress={onPress}>
    <MaterialIcons name="import-export" size={24} color="white" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  importButton: {
    position: "absolute",
    bottom: "20%",
    right: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});

ImportButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default ImportButton;
