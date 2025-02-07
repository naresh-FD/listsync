import React from "react";
import PropTypes from "prop-types";
import { FlatList, Text, View, StyleSheet } from "react-native";

const BillList = ({ bills }) => {
  const renderBill = ({ item }) => (
    <View style={styles.billItem}>
      <Text style={styles.billText}>{item}</Text>
      <Text style={styles.modifiedText}>
        Modified on {new Date().toLocaleString()}
      </Text>
    </View>
  );

  return bills.length === 0 ? (
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
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
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
});
BillList.propTypes = {
  bills: PropTypes.array.isRequired,
};

export default BillList;
