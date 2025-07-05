import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { View, Text, TextInput, Image } from "react-native";
import { IconButton } from "react-native-paper";
import headerStyles from "../../../constants/Headerstyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SearchIcon from "../../../assets/icons/SearchIcon.png";

const Header = ({ searchQuery, setSearchQuery }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getLocalUser = async () => {
      try {
        let user = JSON.parse(await AsyncStorage.getItem("user"));
        if (user.uid && user.email) {
          setUser(user);
        }
      } catch (err) {
        console.log("Err - GetLocalUser", err);
      }
    };
    getLocalUser();
  }, []);
  return (
    <View style={headerStyles.headerContainer}>
      <View style={headerStyles.greetingsContainer}>
        <View style={headerStyles.greetSection}>
          <Text style={[headerStyles.headerTitle]}>Hi, {user?.name}</Text>
          <Text style={[headerStyles.headerSubtitle]}>
            Real-time Sync, Seeamless collaboration
          </Text>
        </View>
        <View style={headerStyles.imageSection}>
          <View style={headerStyles.profileImageOutline}>
            <Image
              source={{
                uri: user
                  ? user.photo
                  : "https://i.pinimg.com/originals/07/33/ba/0733ba760b29378474dea0fdbcb97107.png",
              }}
              style={headerStyles.profileImage}
            />
          </View>
        </View>
      </View>
      <View style={headerStyles.searchContainer}>
        <Image source={SearchIcon} style={headerStyles.searchIcon} />
        <TextInput
          style={headerStyles.searchInput}
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
Header.propTypes = {
  searchQuery: PropTypes.string,
  setSearchQuery: PropTypes.func,
};

export default Header;
