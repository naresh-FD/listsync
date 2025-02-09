import React from "react";
import PropTypes from "prop-types";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Divider, IconButton, Menu, TextInput } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../../constants/Colors";

const ToDoHeader = ({
  listData,
  router,
  isSelectionOn,
  enableSearch,
  deleteAllItems,
  enableEditMode,
  cancelSelection,
  selectAllItems,
  unSelectAllItems,
  invertSelection,
  deleteSelectedItems,
  isEditModeOn,
  visibleMenu,
  searchQuery,
  setSearchQuery,
  setVisibleMenu,
}) => {
  const openMenu = (uid) => {
    setVisibleMenu(uid);
  };

  const closeMenu = () => {
    setVisibleMenu(null);
  };

  return (
    <View style={styles.headerContainer}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>{listData.title}</Text>
        <Menu
          visible={visibleMenu === listData.uid}
          onDismiss={closeMenu}
          anchor={
            <IconButton
              iconColor="white"
              icon="dots-vertical"
              onPress={() => openMenu(listData.uid)}
            />
          }
        >
          {!isSelectionOn ? (
            <>
              <Menu.Item onPress={() => deleteAllItems()} title="Delete All" />
              <Menu.Item
                onPress={() => enableEditMode()}
                title={!isEditModeOn ? "Edit" : "Cancel"}
              />
            </>
          ) : (
            <>
              {selectedItems.length !== 0 ? (
                <Menu.Item onPress={deleteSelectedItems} title="Delete" />
              ) : null}
              <Menu.Item onPress={selectAllItems} title="Select All" />
              <Menu.Item onPress={unSelectAllItems} title="UnSelect All" />
              <Divider />
              <Menu.Item onPress={cancelSelection} title="Cancel" />
            </>
          )}
        </Menu>
      </View>

      {/* Search Section */}
      <View style={styles.searchContainer}>
        {!searchQuery && (
          <IconButton icon="magnify" size={20} color="#9E9E9E" />
        )}
        <TextInput
          style={styles.searchInput}
          placeholder="Search List"
          placeholderTextColor="#9E9E9E"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setSearchQuery(searchQuery)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: Colors.light.buttonBackground,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 4,
    borderBottomWidth: 1,
    borderTopColor: Colors.light.buttonBackground,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 8,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  searchContainer: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ffffff",
    height: 50,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#ffffff",
    height: 50,
  },
});

ToDoHeader.propTypes = {
  listData: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  isSelectionOn: PropTypes.bool.isRequired,
  enableSearch: PropTypes.func.isRequired,
  deleteAllItems: PropTypes.func.isRequired,
  enableEditMode: PropTypes.func.isRequired,
  cancelSelection: PropTypes.func.isRequired,
  selectAllItems: PropTypes.func.isRequired,
  unSelectAllItems: PropTypes.func.isRequired,
  invertSelection: PropTypes.func.isRequired,
  deleteSelectedItems: PropTypes.func.isRequired,
  isEditModeOn: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string,
  setSearchQuery: PropTypes.func,
};

export default ToDoHeader;
