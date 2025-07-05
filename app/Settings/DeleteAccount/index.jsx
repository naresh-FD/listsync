import {
  View,
  Text,
  ImageBackground,
  Pressable,
  TextInput,
  ToastAndroid,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { screenBgImage } from "../../util/constants";

import { RadioButton } from "react-native-paper";

import { deleteAccountStyles as styles } from "./deleteAccountStyles";
import { useState } from "react";
import { theme } from "../../util/theme";
import Button from "../../../reusables/Button/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DeleteAccount = () => {
  const router = useRouter();

  const optionsForAccountDeletion = [
    "No longer using the platform",
    "Found a better Alternative",
    "Hard to Navigate pages",
  ];
  const [reasonToDeleteAccount, setReasonToDeleteAccount] = useState("");
  const handleRadioButton = (value) => {
    setReasonToDeleteAccount(value);
  };

  const handleDeleteAccount = async () => {
    if (reasonToDeleteAccount.length !== 0) {
      try {
        // Call your deleteUser API here
        await deleteUser(); // Make sure deleteUser is imported and implemented

        ToastAndroid.show(
          "Account deleted successfully. We are sad to see you go.",
          ToastAndroid.SHORT
        );
        await AsyncStorage.clear();
        router.replace("/auth/WelcomeScreen");
      } catch (error) {
        console.error("Error deleting account:", error);
        ToastAndroid.show(
          "Failed to delete account. Please try again.",
          ToastAndroid.SHORT
        );
      }
    }
  };

  return (
    <ImageBackground source={screenBgImage} style={styles.deleteAccountWrapper}>
      <View style={styles.deleteAccountContainer}>
        <View style={styles.navigationContainer}>
          <Pressable
            onPress={() => router.back()}
            style={styles.navigationContainerImageTextWrapper}
          >
            <Ionicons name="arrow-back" size={34} color="white" />
            <Text style={styles.navigationText}>Settings</Text>
          </Pressable>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.contentTitle}>Delete Account</Text>
          <Text style={styles.contentDescription}>
            Its sad to see you go...
          </Text>
          <View style={styles.deleteAccountOptions}>
            <View style={styles.deleteAccountOptionsWrapper}>
              {optionsForAccountDeletion.map((value, index) => {
                return (
                  <Pressable
                    key={index}
                    style={[
                      styles.optionsCard,
                      reasonToDeleteAccount === value
                        ? styles.optionsCardSelected
                        : styles.optionsCardUnSelected,
                    ]}
                    onPress={() => handleRadioButton(value)}
                  >
                    <RadioButton
                      color={theme.tertirary}
                      value={value}
                      status={
                        reasonToDeleteAccount === value
                          ? "checked"
                          : "unchecked"
                      }
                    />
                    <Text style={styles.optionText}>{value}</Text>
                  </Pressable>
                );
              })}
              <Pressable
                style={[
                  styles.optionsCardOthers,
                  reasonToDeleteAccount === "other"
                    ? styles.optionsCardSelected
                    : styles.optionsCardUnSelected,
                ]}
                onPress={() => handleRadioButton("other")}
              >
                <RadioButton
                  color={theme.tertirary}
                  value="Other"
                  status={
                    reasonToDeleteAccount === "other" ? "checked" : "unchecked"
                  }
                />
                <View style={styles.optionCardExemption}>
                  <Text style={styles.optionTextOther}>Other</Text>
                  <TextInput
                    multiline
                    style={styles.otherReasonField}
                    placeholder="reason"
                    placeholderTextColor="#00000050"
                  />
                </View>
              </Pressable>
            </View>
          </View>
        </View>
        <View style={styles.footerContainer}>
          <Button label="Delete" onPress={handleDeleteAccount} theme="dark" />
        </View>
      </View>
    </ImageBackground>
  );
};

export default DeleteAccount;
