import { StyleSheet } from "react-native";
import { theme } from "../util/theme";

export const billScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
    display: "flex",
    flexDirection: "column",
  },
  headerWrapper: {
    flex: 0.2,
  },
  bodyWrapper: {
    flex: 0.8,
    width: "100%",
    height: "100%",
    backgroundColor: theme.white,
    display: "flex",
    alignItems: "center",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: "scroll",
    padding: 20,
  },
});
