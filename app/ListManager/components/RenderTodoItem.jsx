import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, Image } from "react-native";
import { Card } from "react-native-paper";
import ListMenu from "./ListMenu";
import share from "../../../assets/images/share.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocalStorageItem } from "../../util/helper";

const RenderTodoItem = ({ item, onEdit, onDelete, onShare, onPress }) => {
  const listData = item.item;
  const [isListShared, setIsListShared] = useState(false);

  const checkIsListShared = async () => {
    try {
      let user = await AsyncStorage.getItem("user");
      let userObject = JSON.parse(user);
      const { email } = userObject;
      const { admin } = listData;
      if (email === admin) {
        setIsListShared(false);
      } else {
        setIsListShared(true);
      }
    } catch (err) {
      console.log("checkIsListShared", err);
    }
  };

  useEffect(() => {
    checkIsListShared();
  }, []);

  const renderSharedIcon = useMemo(() => {
    if (isListShared) {
      return <Image source={share} style={styles.shareImage} />;
    } else {
      return null;
    }
  }, [isListShared]);

  return (
    <Card style={styles.card} onPress={() => onPress(listData)}>
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          <Text style={styles.todoText}>{listData.title}</Text>
        </View>
        <View style={styles.rightSection}>
          {renderSharedIcon}
          <ListMenu
            listData={listData}
            onEdit={onEdit}
            onDelete={onDelete}
            onShare={onShare}
          />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    height: 60,
    backgroundColor: "white",
    margin: 2,
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
  leftSection: {
    flex: 0.8,
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 0.2,
    flexDirection: "row",
  },
  shareImage: {
    width: 25,
    height: 25,
  },
});
RenderTodoItem.propTypes = {
  item: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default RenderTodoItem;
