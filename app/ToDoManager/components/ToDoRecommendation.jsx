import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  FlatList,
  Image,
  TextInput,
  ToastAndroid,
  ScrollView,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { recommendedItems, addItemIcon } from "../../util/constants";
import { useRouter } from "expo-router";
import { Colors } from "../../../constants/Colors";
import { theme } from "../../util/theme";
import { useMemo } from "react";

const ToDoRecommendation = ({ query, onAdd }) => {
  const renderRecommendations = useMemo(() => {
    let filteredItems = recommendedItems.filter((item) =>
      item.toLowerCase().includes(query.toLowerCase())
    );
    return (
      <View style={styles.body}>
        {filteredItems.map((item, index) => {
          return <RecommendationCard index={index} item={item} onAdd={onAdd} />;
        })}
      </View>
    );
  }, [query]);
  return (
    <View style={styles.recommendationContainer}>{renderRecommendations}</View>
  );
};

const RecommendationCard = ({ item, index, onAdd }) => {
  return (
    <Pressable
      key={index}
      onPress={() => onAdd(item)}
      style={[styles.cardContainer]}
    >
      <Text style={styles.cardTitle}>{item}</Text>
      <Image source={addItemIcon} style={styles.cardIcon} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  recommendationContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  header: {
    width: "100%",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  body: {
    width: "99%",
    paddingTop: 10,
    marginBottom: 100,
  },
  cardTitle: {
    color: theme.black,
    fontSize: 18,
    fontWeight: "bold",
  },
  cardIcon: {
    width: 40,
    height: 40,
  },
  cardContainer: {
    width: "100%",
    marginHorizontal: 0,
    marginVertical: 2,
    padding: 10,
    borderRadius: 10,
    borderBottomColor: "grey",
    backgroundColor: theme.white,
    elevation: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  firstCardIndex: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  lastCardindex: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});

export default ToDoRecommendation;
