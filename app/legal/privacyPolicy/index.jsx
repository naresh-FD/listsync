import {
  ImageBackground,
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import { termsAndConditionsStyles as styles } from "../termsAndConditionsStyles";
import { privacyPolicy, screenBgImage } from "../../util/constants";

import { backButtonImage } from "../../util/constants";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const PrivacyPolicy = () => {
  const router = useRouter();
  return (
    <ImageBackground source={screenBgImage} style={styles.termsOfUseWrapper}>
      <View style={styles.termsOfUseContainer}>
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
          <Text style={styles.contentTitle}>Privacy Policy</Text>
          <ScrollView style={styles.contentScrollView}>
            <Text style={styles.content}>{privacyPolicy}</Text>
          </ScrollView>
        </View>
      </View>
    </ImageBackground>
  );
};

export default PrivacyPolicy;
