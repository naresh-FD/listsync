import React from "react";
import { SafeAreaView } from "react-native";
import BillScanner from "./component/BillScanner";
import Header from "./component/Header";
const Index = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title="DocScanner" />
      <BillScanner />
    </SafeAreaView>
  );
};

export default Index;
