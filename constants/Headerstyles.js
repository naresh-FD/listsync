import { StyleSheet } from "react-native";
import { Colors } from "./Colors";
import { theme } from "../app/util/theme";

const headerStyles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: 25,
    paddingRight: 25,
  },
  greetingsContainer: {
    flex: 0.5,
    paddingLeft: 15,
    display: "flex",
    flexDirection: "row",
  },
  greetSection: {
    flex: 0.85,
  },
  imageSection: {
    flex: 0.15,
  },
  headerTitle: {
    color: theme.white,
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
    textAlign: "left",
  },
  headerSubtitle: {
    width: 250,
    color: theme.white,
    fontSize: 14,
    fontWeight: "regular",
    flex: 1,
    textAlign: "left",
    marginBottom: 20,
  },
  profileImageOutline: {
    width: 50,
    height: 50,
    position: "relative",
    backgroundColor: theme.white,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    position: "absolute",
    top: 5,
    left: 5,
  },
  subTitle: {
    color: "white",
    fontSize: 14,
    marginTop: 5,
    textAlign: "center",
  },
  searchContainer: {
    flex: 0.3,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    width: 22,
    height: 22,
    marginLeft: 10,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 20,
    color: "black",
    fontWeight: "regular",
    marginLeft: 5,
  },
  iconColor: {
    color: "white",
  },
});

export default headerStyles;
