import { StyleSheet, Dimensions } from "react-native";
import { Colors } from "./Colors";
import { theme } from "../app/util/theme";

const { width, height } = Dimensions.get("window");

export const AuthFlowStyles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 80,
  },
  logoSection: {
    width: "90%",
    height: "70%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  logoTitle: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    color: theme.white,
  },
  logoDescription: {
    fontSize: 22,
    fontWeight: "medium",
    textAlign: "center",
    color: theme.white,
  },
  title: {
    fontFamily: "Rubik",
    fontSize: 36,
    fontWeight: "bold",
    color: Colors.light.buttonText,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Rubik",
    color: Colors.light.whiteText,
    width: "90%",
    marginBottom: 20,
  },
  loginActionContainer: {
    width: 310,
  },
  signInButton: {
    width: "100%",
    backgroundColor: Colors.light.buttonText,
    borderRadius: 25,
    paddingVertical: 12,
    marginBottom: 20,
    boxShadow: "0px 2px 3.84px rgba(0, 0, 0, 0.25)",
    elevation: 5,
    alignItems: "center",
  },
  signInButtonGoogle: {
    width: "100%",
    backgroundColor: Colors.light.buttonText,
    borderRadius: 25,
    // paddingVertical: 12,
    marginBottom: 20,
    boxShadow: "0px 2px 3.84px rgba(0, 0, 0, 0.25)",
    color: Colors.light.text,
    elevation: 5,
    alignItems: "center",
  },
  signInButtonText: {
    color: Colors.light.buttonBackground,
    fontSize: 16,
    fontWeight: "bold",
  },
  createAccountButton: {
    width: "100%",
    borderColor: Colors.light.buttonText,
    borderWidth: 2,
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
  },
  createAccountButtonText: {
    color: Colors.light.buttonText,
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomLink: {
    marginTop: 30,
    marginRight: 20,
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  bottomLinkText: {
    fontSize: 14,
    color: Colors.light.buttonText,
  },
  signInLink: {
    fontWeight: "bold",
    color: Colors.light.buttonText,
  },
});
