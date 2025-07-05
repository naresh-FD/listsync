import React, { useState } from "react";
import { View, Text, Pressable, ImageBackground } from "react-native";
import { offerWallStyles as styles } from "./offerWallStyles";

import {
  offerWallBgImage,
  offerCardBg,
  offerWallTerms,
  offerCardBgInActive,
} from "../util/constants";
import { Ionicons } from "@expo/vector-icons";
import Button from "../../reusables/Button/Button";
import { useRouter } from "expo-router";

const OfferWall = () => {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const offers = [
    {
      name: "Yearly",
      price: "$14.9",
      status: "BEST VALUE",
      perks: ["Save upto 30%", "Unlimited Shares", "Unlimited Lists"],
    },
    {
      name: "3 Months",
      price: "$24.9",
      status: "POPULAR",
      perks: ["Save upto 30%", "Unlimited Shares", "Unlimited Lists"],
    },
    {
      name: "1 Month",
      price: "$39.9",
      status: "BEST VALUE",
      perks: ["Save upto 30%", "Unlimited Shares", "Unlimited Lists"],
    },
  ];

  const RenderOfferOption = () => {
    return offers.map((offer, index) => {
      const isSelected = index === selectedIndex;

      const onPressHandler = () => {
        setSelectedIndex(index);
      };
      return (
        <Pressable
          key={index}
          style={styles.offersContainer}
          onPress={() => onPressHandler()}
        >
          <ImageBackground
            resizeMode="cover"
            resizeMethod="scale"
            source={isSelected ? offerCardBg : offerCardBgInActive}
            style={isSelected ? styles.offer : styles.offerUnSelected}
          >
            <View style={styles.leftSection}>
              <View style={styles.titleSectionWrapper}>
                <View style={styles.titleSection}>
                  <Text style={styles.title}>{offer.name}</Text>
                </View>
                <View style={styles.statusContainer}>
                  <Text style={styles.status}>{offer.status}</Text>
                </View>
              </View>
              <View style={styles.contentSection}>
                <Text style={styles.contentItem}>⬤ Save upto 30%</Text>
                <Text style={styles.contentItem}>⬤ Save upto 30%</Text>
              </View>
            </View>
            <View style={styles.rightSection}>
              <Text style={styles.priceTag}>{offer.price}</Text>
            </View>
          </ImageBackground>
        </Pressable>
      );
    });
  };
  return (
    <ImageBackground source={offerWallBgImage} style={styles.offerWallWrapper}>
      <View style={styles.navigationSection}>
        <Ionicons
          name="arrow-back"
          size={34}
          color="white"
          onPress={() => router.back()}
        />
        <Text style={styles.navigationSectionText}>Choose Your Plan</Text>
      </View>
      <View style={styles.bodySection}>
        <View style={styles.offersContainerWrapper}>
          <RenderOfferOption />
        </View>
      </View>
      <View style={styles.footerSection}>
        <Text style={styles.terms}>{offerWallTerms}</Text>
        <Button
          style={styles.purchaseButton}
          label="Continue to Purchase"
          theme="dark"
          onPress={() => alert("Purchase Successfull")}
        />
      </View>
    </ImageBackground>
  );
};

export default OfferWall;
