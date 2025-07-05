import React from "react";
import PropTypes from "prop-types";
import { FlatList, Text, View, StyleSheet, Image } from "react-native";
import { referenceBillImage } from "../../util/constants";
import ListMenu from "../../ListManager/components/ListMenu";

const BillList = ({ bills, onEdit, onShare, onDelete }) => {
  const renderBill = ({ item }) => (
    <View style={styles.billItem}>
      <View style={styles.leftSection}>
        <Image style={styles.refImage} source={referenceBillImage} />
      </View>
      <View style={styles.rightSection}>
        <View style={styles.textSection}>
          <Text style={styles.billText}>
            {typeof item === "string" ? item : item?.name || ""}
          </Text>
          <Text style={styles.modifiedText}>
            Modified on
            {new Date(item?.modified || Date.now()).toLocaleString()}
          </Text>
        </View>
        <View style={styles.menuSection}>
          <ListMenu
            listData={item}
            item={item}
            onEdit={onEdit}
            onDelete={onDelete}
            onShare={onShare}
            type="Bills"
          />
        </View>
      </View>
    </View>
  );

  return bills?.length === 0 ? (
    <Text style={styles.emptyText}>No items</Text>
  ) : (
    <FlatList
      data={bills}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderBill}
    />
  );
};

const styles = StyleSheet.create({
  billItem: {
    margin: 2,
    width: "100%",
    backgroundColor: "white",
    padding: 10,
    borderWidth: 0.5,
    borderColor: "#00000030",
    elevation: 5,
    borderRadius: 10,
    marginBottom: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  leftSection: {
    marginRight: 10,
  },
  billText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  modifiedText: {
    fontSize: 12,
    color: "#888",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
  refImage: {
    width: 52,
    height: 52,
  },
  rightSection: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  textSection: {
    flex: 0.7,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    flexDirection: "column",
  },
  menuSection: {
    flex: 0.3,
  },
});
BillList.propTypes = {
  bills: PropTypes.array.isRequired,
};

export default BillList;
