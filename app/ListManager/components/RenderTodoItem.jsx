import React from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import ListMenu from "./ListMenu";
import { theme } from "../../util/theme";

const RenderTodoItem = ({
  item,
  onEdit,
  onAddToFavourite,
  onDelete,
  onShare,
  onPress,
}) => {
  const listData = item.item;

  return (
    <Card style={styles.card} onPress={() => onPress(listData)}>
      <View style={styles.cardContent}>
        <Text style={styles.todoText}>{listData.title}</Text>
        <ListMenu
          listData={listData}
          onEdit={onEdit}
          onAddToFavourite={onAddToFavourite}
          onDelete={onDelete}
          onShare={onShare}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    height: 50,
    marginLeft: 2,
    marginRight: 2,
    backgroundColor: theme.white,
    marginBottom: 10,
    elevation: 4,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 5,
  },
  todoText: {
    fontSize: 18,
  },
});
RenderTodoItem.propTypes = {
  item: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onAddToFavourite: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default RenderTodoItem;
