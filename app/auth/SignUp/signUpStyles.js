import { StyleSheet } from "react-native";
import { theme } from "../../util/theme";

export const SignUpStyles = StyleSheet.create({
  signUpWrapper: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  signUpContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  navigationContainer: {
    width: "100%",
    flex: 0.2,
    paddingTop: 50,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  navigationContainerImageTextWrapper: {
    paddingLeft: 20,
    width: "100%",
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
    fontWeight: "600",
    fontSize: 24,
    color: theme.white,
  },
  formsContainer: {
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
  formFieldsContainer: {
    marginTop: 10,
  },
  signUpTitle: {
    fontSize: 40,
    fontWeight: "bold",
  },
  signUpHeading: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
  },
  signUpSubHeading: {
    fontSize: 18,
    fontWeight: "regular",
  },
});
