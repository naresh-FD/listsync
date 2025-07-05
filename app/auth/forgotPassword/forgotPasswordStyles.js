import { StyleSheet } from "react-native";
import { theme } from "../../util/theme";

export const forgotPasswordStyles = StyleSheet.create({
  forgotPasswordWrapper: {
    width: "100%",
    height: "100%",
    fontFamily: "Poppins",
  },
  forgotPasswordContainer: {
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
    flex: 0.7,
    backgroundColor: theme.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    display: "flex",
    flexDirection: "column",
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
  stage1: {
    width: "100%",
    marginTop: 10,
  },
  subTitle: {
    width: "90%",
    fontSize: 16,
    fontWeight: "regular",
    color: "black",
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
  stageBar: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  stage: {
    width: 70,
    height: 7,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 30,
  },
  stageSelected: {
    backgroundColor: theme.tertirary,
  },
  stageUnSelected: {
    backgroundColor: theme.disabled,
  },
  stageText: {
    color: "transparent",
  },
  resetCodeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
    gap: 10, // if you're using React Native 0.71+, or use marginHorizontal
  },
  inputBox: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 6,
    fontSize: 24,
    color: "black",
  },
  subTitleHighlight: {
    fontWeight: "bold",
  },
  imageContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
  },
  circleImage: {
    width: 130,
    height: 130,
  },
  footerContainer: {
    width: "100%",
    flex: 0.1,
    backgroundColor: "white",
    paddingHorizontal: 40,
  },
});
