import React from "react";
import { SafeAreaView } from "react-native";
import BillScanner from "./component/BillScanner";
import Header from "./component/Header";
import BottomNavigationBar from "../navigation/BottomNavigationBar";
const Index = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title="DocScanner" />
      <BillScanner />
      <BottomNavigationBar page={"BillsScreen"} />
    </SafeAreaView>
  );
};

export default Index;
