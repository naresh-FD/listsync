import { StyleSheet } from "react-native";
import { theme } from "../../app/util/theme";

export const upgradeToPreimumStyles = StyleSheet.create({
  upgradeToPreimumWrapper: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  upgradeToPremiumBg: {
    width: 360,
    height: 100,
    margin: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  textSection: {
    flex: 0.65,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontFamily: "poppins",
    color: theme.white,
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 12,
    fontFamily: "poppins",
    color: theme.white,
    fontWeight: "bold",
  },
  buttonSection: {
    flex: 0.35,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  getNowButton: {
    height: 26,
    width: 90,
    backgroundColor: theme.danger,
    borderRadius: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  getNowButtonText: {
    color: theme.white,
    fontSize: 14,
    fontWeight: "bold",
  },
});
