import React, { useState } from "react";
import { Menu, IconButton } from "react-native-paper";
import PropTypes from "prop-types";
import { StyleSheet, View, Share } from "react-native";
import { theme } from "../../util/theme";

const ListMenu = ({ listData, onEdit, onDelete, onShare, type }) => {
  const [visibleMenu, setVisibleMenu] = useState(null);

  const openMenu = (item) => setVisibleMenu(item);
  const closeMenu = () => setVisibleMenu(null);

  return (
    <Menu
      style={menuStyles.menuWrapper}
      visible={visibleMenu === listData}
      onDismiss={closeMenu}
      anchor={
        <IconButton
          iconColor="#000000"
          icon="dots-vertical"
          onPress={() => openMenu(listData)}
        />
      }
    >
      {!listData.uid.includes("defaultList") ? (
        <Menu.Item
          style={[menuStyles.menuItem, menuStyles.itemBorder]}
          onPress={() => onEdit(listData)}
          title={type === "Bills" ? "Rename" : "Edit"}
        />
      ) : null}
      {type === "Bills" ? (
        <Menu.Item
          style={[menuStyles.menuItem, menuStyles.itemBorder]}
          onPress={null}
          title="Export to PDF"
        />
      ) : null}
      {!listData.uid.includes("defaultList") ? (
        <Menu.Item
          style={[menuStyles.menuItem, menuStyles.itemBorder]}
          onPress={() => onDelete(listData)}
          title="Delete"
        />
      ) : null}
      <Menu.Item
        style={[menuStyles.menuItem]}
        onPress={() => onShare(JSON.stringify(listData))}
        title="Share"
      />
    </Menu>
  );
};

const menuStyles = StyleSheet.create({
  menuWrapper: {
    backgroundColor: theme.white,
    borderRadius: 10,
    elevation: 5,
    width: "80%",
    shadowColor: "#000",
    borderRightColor: "#00000050",
    borderRightWidth: 1,
    overflow: "",
  },
  menuItem: {
    // backgroundColor: theme.white,
    color: theme.black,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#00000050",
  },
});
ListMenu.propTypes = {
  listData: PropTypes.shape({
    uid: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
};

export default ListMenu;
