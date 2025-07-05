import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  Image,
  Pressable,
  ImageBackground,
  Linking,
} from "react-native";
import BottomNavigationBar from "../navigation/BottomNavigationBar";
import { Title } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Button from "../../reusables/Button/Button";

import { settingsStyles as styles } from "./settingsStyles";
import { settingsLinks } from "../util/constants";

const SettingsScreen = () => {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const [settingsLink, setSettingsLink] = useState(settingsLinks);

  const [loading, setLoading] = useState(false);
  const logout = async () => {
    setLoading(true);
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      // clear data for this app
      console.log("All AsyncStorage keys before logout:", allKeys);
      await AsyncStorage.clear();
      console.log("All AsyncStorage data cleared.");
      setNotificationsEnabled(false);
      setDarkModeEnabled(false);
      setLoading(false);
      router.replace("auth/WelcomeScreen");
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const renderSettingsLink = () => {
    const goToRoute = (route, type) => {
      switch (type) {
        case "link":
          Linking.openURL(route);
        default:
        case "route":
          router.push(route);
      }
    };
    return Object.entries(settingsLink).map(([key, value]) => {
      return (
        <View key={key} style={styles.settingsItemWrapper}>
          <Text style={styles.settingsCategory}>{key}</Text>
          <View style={styles.settingsItemContainer}>
            {value.map((link, index) => {
              return (
                <Pressable
                  onPress={() => goToRoute(link.link, link.type)}
                  key={index}
                  style={styles.settings}
                >
                  <Text style={styles.settingsText}>{link.title}</Text>
                  <Image
                    style={styles.settingsImage}
                    source={require("../../assets/icons/nextArrow.png")}
                  />
                </Pressable>
              );
            })}
          </View>
        </View>
      );
    });
  };

  return (
    <>
      <ImageBackground
        source={require("../../assets/images/screenBg.png")}
        style={styles.container}
      >
        <View style={styles.bodyTitleSection}>
          <Title style={styles.bodyTitle}>Settings</Title>
        </View>
        <View style={styles.body}>
          {renderSettingsLink()}
          <View style={styles.logoutSection}>
            <Pressable style={styles.logout} onPress={logout}>
              <Text style={styles.logoutText}>LOGOUT</Text>
            </Pressable>
          </View>
        </View>
      </ImageBackground>
      <BottomNavigationBar page="Settings" />
    </>
  );
};

export default SettingsScreen;
