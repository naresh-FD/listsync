import { StyleSheet } from "react-native";
import { theme } from "../util/theme";

export const termsAndConditionsStyles = StyleSheet.create({
  termsOfUseWrapper: {
    width: "100%",
    height: "100%",
    fontFamily: "Poppins",
    backgroundColor: "pink",
  },
  termsOfUseContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    paddingTop: 50,
  },
  navigationContainer: {
    width: "100%",
    flex: 0.2,
    // paddingTop: 50,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  navigationContainerImageTextWrapper: {
    paddingLeft: 20,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  navigationImage: {
    width: 30,
    height: 27,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
  },
  navigationText: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.white,
  },
  contentContainer: {
    width: "100%",
    flex: 0.8,
    backgroundColor: theme.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 20,
    marginTop: 20,
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  contentScrollView: {
    width: "100%",
    height: "100%",
    marginTop: 20,
  },
  content: {
    fontSize: 14,
    color: theme.black,
  },
});
