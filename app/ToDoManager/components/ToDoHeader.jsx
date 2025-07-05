import { useState } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Share,
} from "react-native";
import { Divider, Menu, TextInput } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../util/theme";
import SearchIcon from "../../../assets/icons/SearchIcon.png";

const ToDoHeader = ({
  listData,
  router,
  isSelectionOn,
  deleteAllItems,
  addToFavouriteList,
  selectedItems,
  enableEditMode,
  cancelSelection,
  selectAllItems,
  unSelectAllItems,
  deleteSelectedItems,
  isEditModeOn,
  visibleMenu,
  searchQuery,
  setSearchQuery,
  setVisibleMenu,
  tickUnTickHandler,
}) => {
  const sampleList = [{ title: "My List" }, { title: "List 2" }];
  const [showAddToListMenu, setShowAddToListMenu] = useState(false);
  const openMenu = (uid) => {
    setVisibleMenu(uid);
  };

  const closeMenu = () => {
    setVisibleMenu(null);
  };

  const handleShare = async (text) => {
    try {
      await Share.share({ message: text });
    } catch (error) {
      alert(error.message);
    }
  };

  const addToListHandler = () => {
    setShowAddToListMenu(!showAddToListMenu);
  };

  return (
    <View style={styles.headerContainer}>
      {/* Header Section */}
      <View style={styles.header}>
        {listData?.title !== "My List" || listData?.listTitle !== "My List" ? (
          <View style={styles.navigationSection}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={34} color="white" />
            </TouchableOpacity>
          </View>
        ) : null}
        <View style={styles.titleSection}>
          <Text style={styles.title}>
            {listData?.title || listData?.listTitle || "Favourite"}
          </Text>
          <Text style={styles.subTitle}>
            {listData?.notes || listData?.listNotes}
          </Text>
        </View>
        <View
          style={[
            listData?.title === "My List"
              ? styles.menuSectionExtra
              : styles.menuSection,
          ]}
        >
          <Menu
            style={styles.menu}
            visible={visibleMenu === listData?.uid}
            onDismiss={closeMenu}
            anchor={
              <Ionicons
                name="filter-sharp"
                size={24}
                color="white"
                onPress={() => openMenu(listData?.uid)}
              />
            }
          >
            {!isSelectionOn ? (
              <>
                <Menu.Item
                  style={[styles.menuItem, styles.itemBorder]}
                  onPress={() => enableEditMode()}
                  title={!isEditModeOn ? "Edit" : "Cancel"}
                  disabled={!listData?.data || listData.data.length === 0}
                />
                {listData?.title === "Favourite List" ? (
                  <Menu
                    visible={showAddToListMenu}
                    onDismiss={() => setShowAddToListMenu(!showAddToListMenu)}
                    style={styles.addToListContainer}
                    anchor={
                      <Menu.Item
                        style={[styles.menuItem, styles.itemBorder]}
                        onPress={() => addToListHandler()}
                        title="Add to List"
                        disabled={!listData?.data || listData.data.length === 0}
                      />
                    }
                  >
                    {sampleList.map((item, index) => {
                      return (
                        <Menu.Item
                          key={index}
                          style={[styles.menuItem, styles.itemBorder]}
                          onPress={() => null}
                          title={item.title}
                        />
                      );
                    })}
                  </Menu>
                ) : null}
                <Menu.Item
                  style={[styles.menuItem, styles.itemBorder]}
                  onPress={() => tickUnTickHandler("tick")}
                  title="Tick All"
                  disabled={!listData?.data || listData.data.length === 0}
                />
                <Menu.Item
                  style={[styles.menuItem, styles.itemBorder]}
                  onPress={() => tickUnTickHandler("unTick")}
                  title="UnTick All"
                  disabled={!listData?.data || listData.data.length === 0}
                />
                <Menu.Item
                  style={[styles.menuItem, styles.itemBorder]}
                  onPress={() => handleShare(JSON.stringify(listData))}
                  title="Share"
                  disabled={!listData?.data || listData.data.length === 0}
                />
                <Menu.Item
                  style={[styles.menuItem, styles.itemBorder]}
                  onPress={() => deleteAllItems()}
                  title="Delete All"
                  disabled={!listData?.data || listData.data.length === 0}
                />
              </>
            ) : (
              <>
                {listData?.title !== "Favourite List" ? (
                  <Menu.Item
                    style={[styles.menuItem, styles.itemBorder]}
                    onPress={() => addToFavouriteList()}
                    title="Add to Favourite"
                  />
                ) : null}
                {selectedItems.length !== 0 ? (
                  <Menu.Item
                    style={[styles.menuItem, styles.itemBorder]}
                    onPress={deleteSelectedItems}
                    title="Delete"
                  />
                ) : null}
                <Menu.Item
                  style={[styles.menuItem, styles.itemBorder]}
                  onPress={selectAllItems}
                  title="Select All"
                />
                <Menu.Item
                  style={[styles.menuItem, styles.itemBorder]}
                  onPress={unSelectAllItems}
                  title="UnSelect All"
                />
                <Divider />
                <Menu.Item
                  style={[styles.menuItem, styles.itemBorder]}
                  onPress={cancelSelection}
                  title="Cancel"
                />
              </>
            )}
          </Menu>
        </View>
      </View>
      {/* Search Section */}
      <View style={styles.searchContainer}>
        <Image source={SearchIcon} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search List"
          placeholderTextColor="#9E9E9E"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setSearchQuery(searchQuery)}
        />
      </View>
      {/* {showAddToListMenu ? (
        <AddToListMenu
          list={sampleList}
          showAddToListMenu={showAddToListMenu}
          setShowAddToListMenu={setShowAddToListMenu}
        />
      ) : null} */}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: 25,
    paddingRight: 25,
    position: "relative",
  },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30,
  },
  navigationSection: {
    flex: 0.1,
  },
  titleSection: {
    flex: 0.8,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingLeft: 10,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.white,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: "regular",
    color: theme.white,
    paddingBottom: 5,
  },
  menuSection: {
    flex: 0.1,
  },
  menuSectionExtra: {
    flex: 0.2,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  menu: {
    zIndex: 11,
    marginTop: 80,
    marginLeft: -20,
    borderRadius: 15,
  },
  menuItem: {
    // backgroundColor: theme.white,
    color: theme.black,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#00000050",
  },
  searchContainer: {
    flex: 0.3,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingHorizontal: 10,
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
  searchIcon: {
    width: 22,
    height: 22,
    marginLeft: 10,
    marginRight: 10,
  },
  searchInput: {
    border: "none",
    borderBottomColor: "transparent",
    backgroundColor: "transparent",
    flex: 1,
    fontSize: 20,
    color: theme.fieldPlaceholder,
    fontWeight: "regular",
    marginLeft: 5,
  },
  iconColor: {
    color: "white",
  },
  addToListContainer: {
    top: 170,
    left: 110,
    borderRadius: 15,
    position: "absolute",
  },
  listScrollView: {
    width: "100%",
    height: "100%",
    backgroundColor: "black",
  },
  list: {
    width: "100%",
    height: 50,
    marginBottom: 5,
    borderRadius: 5,
    // backgroundColor: theme.white,
    backgroundColor: "pink",
    color: theme.black,
    backgroundColor: "black",
    elevation: 2,
    display: "flex",
    alignItems: "flex-start",
    borderColor: "#00000030",
    borderWidth: 0.5,
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  ListTitle: {
    color: "black",
    fontSize: 18,
  },
});

ToDoHeader.propTypes = {
  listData: PropTypes.object,
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
