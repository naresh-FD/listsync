import React, { useEffect, useState } from "react";
import { Menu, IconButton } from "react-native-paper";
import PropTypes from "prop-types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ListMenu = ({
  listData,
  onEdit,
  onAddToFavourite,
  onRemoveFromFavourite,
  onDelete,
  onShare,
}) => {
  const [visibleMenu, setVisibleMenu] = useState(null);
  const [isScreenFavouriteList, setIsScreenFavouriteList] = useState(false);

  const openMenu = (uid) => setVisibleMenu(uid);
  const closeMenu = () => setVisibleMenu(null);

  //Check if the Current Screen Selection is Favourite List
  const isCurrentScreenFavouriteList = async () => {
    const isListFavourite = await AsyncStorage.getItem("isFavListSelected");
    if (isListFavourite) {
      setIsScreenFavouriteList(JSON.parse(isListFavourite));
    }
  };

  //Component on-mount
  useEffect(() => {
    isCurrentScreenFavouriteList();
  }, []);

  return (
    <Menu
      visible={visibleMenu === listData.uid}
      onDismiss={closeMenu}
      anchor={
        <IconButton
          iconColor="#000000"
          icon="dots-vertical"
          onPress={() => openMenu(listData.uid)}
        />
      }
    >
      {isScreenFavouriteList ? (
        <Menu.Item
          onPress={() => onRemoveFromFavourite(listData)}
          title="Remove From Favourite"
        />
      ) : (
        <Menu.Item
          onPress={() => onAddToFavourite(listData)}
          title="Add To Favourite"
        />
      )}
      <Menu.Item onPress={() => onEdit(listData.uid)} title="Edit" />
      <Menu.Item onPress={() => onDelete(listData.uid)} title="Delete" />
      <Menu.Item
        onPress={() => onShare(JSON.stringify(listData))}
        title="Share"
      />
    </Menu>
  );
};
ListMenu.propTypes = {
  listData: PropTypes.shape({
    uid: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
};

export default ListMenu;
