import React from "react";
import PropTypes from "prop-types";
import { View, Text, TextInput, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors } from "../../../constants/Colors";
import { Menu } from "react-native-paper";
import { theme } from "../../util/theme";

import SearchIcon from "../../../assets/icons/SearchIcon.png";

const Header = ({
  title,
  subTitle,
  visibleMenu,
  setVisibleMenu,
  searchQuery,
  setSearchQuery,
}) => {
  const router = useRouter();

  //Handlers
  const openMenu = (state) => {
    setVisibleMenu(state);
  };

  const closeMenu = () => {
    setVisibleMenu(false);
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.greetingsContainer}>
        <View style={styles.greetSection}>
          <Text style={[styles.title]}>{title}</Text>
          <Text style={[styles.subTitle]}>{subTitle}</Text>
        </View>
        <View style={styles.imageSection}>
          <View style={styles.menuSection}>
            <Menu
              style={styles.menu}
              visible={visibleMenu}
              onDismiss={closeMenu}
              anchor={
                <Ionicons
                  name="filter-sharp"
                  size={24}
                  color="white"
                  onPress={() => openMenu(!visibleMenu)}
                />
              }
            >
              <Menu.Item
                style={[styles.menuItem, styles.itemBorder]}
                onPress={() => deleteAllItems()}
                title="Delete All"
              />
            </Menu>
          </View>
        </View>
      </View>
      <View style={styles.searchContainer}>
        <Image source={SearchIcon} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search List"
          placeholderTextColor="#9E9E9E"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
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
  },
  greetingsContainer: {
    flex: 0.5,
    paddingLeft: 15,
    display: "flex",
    flexDirection: "row",
  },
  greetSection: {
    flex: 0.85,
  },
  imageSection: {
    flex: 0.15,
  },
  menuSection: {
    marginTop: 6,
  },
  title: {
    color: theme.white,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
  },
  headerSubtitle: {
    width: 250,
    color: theme.white,
    fontSize: 14,
    fontWeight: "regular",
    flex: 1,
    textAlign: "left",
    marginBottom: 20,
  },
  profileImageOutline: {
    width: 50,
    height: 50,
    position: "relative",
    backgroundColor: theme.white,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    position: "absolute",
    top: 5,
    left: 5,
  },
  subTitle: {
    color: "white",
    fontSize: 14,
    fontWeight: "regular",
  },
  searchContainer: {
    flex: 0.3,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingHorizontal: 10,
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
  menu: {
    top: "11%",
  },
});
Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;
