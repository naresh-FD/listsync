import { View, Text, ImageBackground, Pressable } from "react-native";
import { upgradeToPreimumStyles as styles } from "./upgradeToPremiumStyles";
import UpgradeToPremiumBg from "../../assets/images/UpgradeToPremiumBg.png";
import { goToRoute } from "../../app/util/helper";
import { useRouter } from "expo-router";

const UpgradeToPremium = () => {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push("offerWall")}
      style={styles.upgradeToPreimumWrapper}
    >
      <ImageBackground
        style={styles.upgradeToPremiumBg}
        source={UpgradeToPremiumBg}
      >
        <View style={styles.textSection}>
          <Text style={styles.title}>Upgrade to Premium for FREE</Text>
          <Text style={styles.subTitle}>
            Unlock features including AI suggestion and unlimited List Shares
          </Text>
        </View>
        <View style={styles.buttonSection}>
          <Pressable style={styles.getNowButton}>
            <Text style={styles.getNowButtonText}>GET NOW</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </Pressable>
  );
};

export default UpgradeToPremium;
