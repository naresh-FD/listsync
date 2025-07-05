import {
  ImageBackground,
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import { termsAndConditionsStyles as styles } from "../termsAndConditionsStyles";
import { screenBgImage, termsOfUse } from "../../util/constants";

import { backButtonImage } from "../../util/constants";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const TermsOfUse = () => {
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
          <Text style={styles.contentTitle}>Terms of use</Text>
          <ScrollView style={styles.contentScrollView}>
            <Text style={styles.content}>{termsOfUse}</Text>
          </ScrollView>
        </View>
      </View>
    </ImageBackground>
  );
};

export default TermsOfUse;
