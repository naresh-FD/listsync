import { StyleSheet } from "react-native";
import { theme } from "../../app/util/theme";

export const ButtonStyles = StyleSheet.create({
  buttonContainer: {
    width: "100%",
    height: 60,
    borderRadius: 25,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontFamily: theme.fontFamily,
    marginBottom: 15,
  },
  darkTheme: {
    backgroundColor: theme.tertirary,
  },
  darkLight: {
    backgroundColor: theme.white,
  },
  dangerTheme: {
    backgroundColor: theme.danger,
  },
  darkThemeFont: {
    color: theme.white,
  },
  lightThemeFont: {
    color: theme.black,
  },
  buttonLabel: {
    fontSize: 20,
    fontWeight: 500,
    marginBottom: 5,
  },
});
