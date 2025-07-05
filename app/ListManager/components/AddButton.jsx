import React from "react";
import PropTypes from "prop-types";
import { TouchableOpacity, StyleSheet, Image, View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../util/theme";
import AddIcon from "../../../assets/icons/AddIconLight.png";

const AddButton = ({ onPress, type }) => {
  const getAddType = () => {
    switch (type) {
      case "item":
        return (
          <View style={styles.addButton}>
            <Image source={AddIcon} style={styles.addIcon} />
            <Text style={styles.addText}>Add Item</Text>
          </View>
        );
      case "bill":
        return (
          <View style={styles.addButton}>
            <Image source={AddIcon} style={styles.addIcon} />
            <Text style={styles.addText}>Add Bill</Text>
          </View>
        );
      default:
      case "list":
        return (
          <View style={styles.addButton}>
            <Image source={AddIcon} style={styles.addIcon} />
            <Text style={styles.addText}>Create list</Text>
          </View>
        );
    }
  };
  return (
    <TouchableOpacity style={styles.addButtonWrapper} onPress={onPress}>
      {getAddType()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  addButtonWrapper: {
    bottom: "8%",
    width: 60,
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

AddButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default AddButton;
