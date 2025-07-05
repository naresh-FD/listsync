import { StyleSheet, Dimensions } from "react-native";
import { theme } from "../../app/util/theme";

export const BottomDrawerModalStyles = StyleSheet.create({
  drawerWrapper: {
    paddingTop: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    backgroundColor: "#00000050",
    width: "100%",
    height: "100%",
    bottom: 0,
  },
  drawerContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 500,
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  drawerImageSection: {
    width: "100%",
    backgroundColor: theme.smokeWhite,
    flex: 0.4,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  drawerImageSectionImage: {
    height: 150,
    width: 150,
  },
  drawerTextSection: {
    flex: 0.6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
  },
  drawerText: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    color: "black",
  },
});
