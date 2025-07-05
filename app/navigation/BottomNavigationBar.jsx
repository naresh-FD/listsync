import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import PropTypes from "prop-types";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "../util/theme";
import { getNavbarIconImage } from "../util/helper";

const BottomNavigationBar = ({ page, type }) => {
  const router = useRouter();
  const config = [
    {
      name: "Home",
      route: "ToDoManager",
    },
    {
      name: "Lists",
      route: "ListManager",
    },
    {
      name: "Bills",
      route: "BillsScreen",
    },
    {
      name: "Favourite",
      route: "ToDoManager",
    },
    {
      name: "Settings",
      route: "Settings",
    },
  ];

  const routeHandler = async (item) => {
    try {
      const { route, name } = item;

      if (name === "Favourite") {
        // Fetch the favourite list from AsyncStorage
        const userFavouriteList = await AsyncStorage.getItem("favouriteList");
        const stringData = JSON.stringify(userFavouriteList) ?? "[]";
        router.push(`/ToDoManager?item=${stringData}`);
      } else if (name === "Home") {
        const allList = await AsyncStorage.getItem("todos");
        const defaultList = JSON.parse(allList).find((item) =>
          item.uid.includes("defaultList")
        );
        const userDefaultListString = JSON.stringify(defaultList);
        router.push(`/ToDoManager?item=${userDefaultListString}`);
      } else {
        if (page !== name) {
          router.replace(route);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <View
      style={[
        styles.navigationContainer,
        type === "sub" ? styles.containerBorderRadius : "",
      ]}
    >
      {config.map((route, index) => {
        const isSelected = page === route.name;
        return (
          <View style={styles.navigationItemWrapper} key={route.name}>
            <Pressable
              style={styles.navigationItem}
              onPress={() => routeHandler(route)}
            >
              <Image
                style={styles.navigationItemIcon}
                source={getNavbarIconImage(
                  route.name,
                  isSelected ? "filled" : "unfilled"
                )}
              />
              <Text
                style={[
                  styles.navigationItemText,
                  isSelected && { color: theme.tertirary },
                ]}
              >
                {route.name}
              </Text>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
};
const styles = StyleSheet.create({
  navigationContainer: {
    height: 70,
    width: "100%",
    backgroundColor: "white",
    elevation: 5,
    position: "absolute",
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
    paddingLeft: 10,
    borderTopColor: theme.black,
    borderTopWidth: 0.2,
    paddingRight: 10,
    paddingTop: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  containerBorderRadius: {
    borderRadius: 10,
  },
  navigationItemWrapper: {
    width: 70,
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  navigationItem: {
    height: 40,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  navigationItemIcon: {
    height: 25,
    width: 25,
  },
  navigationItemText: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "regular",
    marginTop: 5,
    fontWeight: 500,
    color: theme.unFilledItems,
  },
  navigationItemFilledText: {
    color: theme.accent,
  },
  navigationItemUnfilledText: {},
});

BottomNavigationBar.propTypes = {
  page: PropTypes.string.isRequired,
};

export default BottomNavigationBar;
