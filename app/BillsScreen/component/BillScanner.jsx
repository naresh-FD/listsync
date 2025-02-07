import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import ScanButton from "./ScanButton";
import BillList from "./BillList";

const BillScanner = () => {
  const [bills, setBills] = useState([]);

  const addBill = (fileName) => {
    setBills((prevBills) => [...prevBills, fileName]);
  };

  console.log("bills", bills);
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Today</Text>
      <BillList bills={bills} />
      <ScanButton addBill={addBill} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default BillScanner;
