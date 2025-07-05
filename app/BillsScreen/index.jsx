import React, { useState } from "react";
import { ImageBackground, View } from "react-native";
import BillScanner from "./component/BillScanner";
import Header from "./component/Header";
import { billScreenStyles as styles } from "./billsScreenStyles";
import { screenBgImage } from "../util/constants";
import { useRouter } from "expo-router";
import BottomNavigationBar from "../navigation/BottomNavigationBar";

const Index = () => {
  const [visibleMenu, setVisibleMenu] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();
  return (
    <ImageBackground style={styles.container} source={screenBgImage}>
      <View style={styles.headerWrapper}>
        <Header
          title="Scan Document"
          subTitle="Add your Bills and slips"
          router={router}
          visibleMenu={visibleMenu}
          setVisibleMenu={setVisibleMenu}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </View>
      <View style={styles.bodyWrapper}>
        <BillScanner />
      </View>
      <BottomNavigationBar page="Bills" type="main" />
    </ImageBackground>
  );
};

export default Index;
