import React from "react";
import { useRouter } from "expo-router";
import { BottomDrawerModalStyles as styles } from "./bottomDrawerModalStyles";
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import Button from "../../reusables/Button/Button";

const BottomDrawerModal = () => {
  const router = useRouter();
  return (
    <View style={styles.drawerWrapper}>
      <View style={styles.drawerContainer}>
        <View style={styles.drawerImageSection}>
          <Image
            style={styles.drawerImageSectionImage}
            source={require("../../assets/images/alert.png")}
          />
        </View>
        <View style={styles.drawerTextSection}>
          <Text style={styles.drawerText}>
            We strongly recommend creating an account. As a guest, you can
            create a list but you won’t be able to share lists, create multiple
            lists, or retain your data if the app is uninstalled. Are you sure
            you want to proceed without an account?
          </Text>
          <Button
            label="Continue"
            onPress={() => router.replace("ToDoManager")}
            theme="danger"
          />
          <Button
            label="Create Account"
            onPress={() => router.replace("/auth/SignUp")}
            theme="dark"
          />
        </View>
      </View>
    </View>
  );
};

export default BottomDrawerModal;
