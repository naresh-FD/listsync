import React from "react";
import { Pressable, Text, View } from "react-native";
import PropTypes from "prop-types";
import styles from "../styles/ToDoManagerStyles";

const TapToAddItem = ({ searchQuery, listItems, onCreateItem }) => {
  const isitemAvailable = Object.values(listItems).find((cate) =>
    cate.find((item) => item.title.toLowerCase() === searchQuery.toLowerCase())
  );

  if (searchQuery.length !== 0 && !isitemAvailable) {
    return (
      <View style={styles.tapToAddWrapper}>
        <Pressable
          onPress={() => onCreateItem(searchQuery)}
          style={styles.tapToAddContainer}
        >
          <Text style={styles.tapToAddText}>
            Add <Text style={styles.tapToAddHighlight}>{searchQuery}</Text>
          </Text>
        </Pressable>
      </View>
    );
  }
  return null;
};
TapToAddItem.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  listItems: PropTypes.object.isRequired,
  onCreateItem: PropTypes.func.isRequired,
};

export default React.memo(TapToAddItem);
