import { StyleSheet } from "react-native";
import { theme } from "../util/theme";

export const settingsStyles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: "Poppins",
    backgroundColor: "pink",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingLeft: 15,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 15,
    elevation: 2,
  },
  settingLabel: {
    fontSize: 16,
  },
  bodyTitleSection: {
    marginTop: 50,
    padding: 20,
  },
  body: {
    flex: 1,
    marginTop: 50,
    backgroundColor: theme.white,
    padding: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bodyTitle: {
    fontSize: 35,
    marginLeft: 5,
    fontWeight: 700,
    marginTop: 15,
    paddingTop: 5,
    height: 50,
    color: theme.white,
  },
  logoutSection: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  logout: {
    width: "30%",
    height: 40,
    borderRadius: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    fontSize: 18,
    color: theme.black,
    fontWeight: "800",
    textAlign: "center",
  },
  settingsItemWrapper: {
    width: "100%",
  },
  settingsCategory: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  settingsItemContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  settingsImage: {
    width: 17,
    height: 17,
  },
  settingsText: {
    fontSize: 16,
    fontWeight: "regular",
  },
  settings: {
    width: "98%",
    height: 50,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 15,
    elevation: 5,
    backgroundColor: theme.white,
    borderRadius: 10,
    marginBottom: 10,
  },
});
