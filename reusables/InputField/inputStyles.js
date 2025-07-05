import { StyleSheet } from "react-native";
import { theme } from "../../app/util/theme";

export const InputStyles = StyleSheet.create({
  fieldWrapper: {
    width: 340,
    height: 60,
    cursor: "pointer",
    fontFamily: theme.fontFamily,
    marginBottom: 35,
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: "Poppins",
    fontWeight: "bold",
  },
  fieldContainer: {
    height: 60,
    borderRadius: 25,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.fieldBg,
    borderColor: theme.primaryDark,
    borderWidth: 2,
    paddingLeft: 20,
    marginTop: 5,
  },
  darkTheme: {
    backgroundColor: theme.tertirary,
  },
  darkLight: {
    backgroundColor: theme.white,
  },
  darkThemeFont: {
    color: theme.white,
  },
  lightThemeFont: {
    color: theme.black,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: "regular",
    marginBottom: 5,
  },
});
