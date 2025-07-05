import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Share } from "react-native";
import ScanButton from "./ScanButton";
import BillList from "./BillList";
import { theme } from "../../util/theme";
import UpgradeToPremium from "../../../components/UpgradeToPremiumCard";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BillScanner = () => {
  const [bills, setBills] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [fileNameModalVisible, setFileNameModalVisible] = useState(false);

  const addBill = (fileName) => {
    setBills((prevBills) => [...prevBills, fileName]);
  };

  useEffect(() => {
    const getBills = async () => {
      try {
        const storedBills = await AsyncStorage.getItem("bills");
        setBills(storedBills ? JSON.parse(storedBills) : []);
      } catch (error) {
        console.error("Failed to load bills:", error);
        setBills([]);
      }
    };

    getBills();
  }, []);

  console.log("[DEBUG] Bills:", bills);

  const editBill = (item) => {
    setSelectedItem(item);
    setFileNameModalVisible(!fileNameModalVisible);
  };

  const handleShare = async (text) => {
    try {
      await Share.share({ message: text });
    } catch (error) {
      alert(error.message);
    }
  };

  const onDelete = async (item) => {
    try {
      const updatedBills = bills.filter((bill) => bill !== item);
      setBills(updatedBills);
      await AsyncStorage.setItem("bills", JSON.stringify(updatedBills));
    } catch (error) {
      console.error("Failed to delete bill:", error);
    }
  };

  return (
    <View style={styles.containerWrapper}>
      <View style={styles.container}>
        <UpgradeToPremium />
        <Text style={styles.sectionTitle}>My Documents</Text>
        <BillList
          bills={bills}
          onEdit={editBill}
          onShare={handleShare}
          onDelete={onDelete}
        />
      </View>
      <View style={styles.addButtonContainer}>
        <ScanButton
          allBills={bills}
          setBills={setBills}
          addBill={addBill}
          fileNameModalVisible={fileNameModalVisible}
          setFileNameModalVisible={setFileNameModalVisible}
          item={selectedItem}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerWrapper: {
    width: "100%",
    height: "100%",
    display: "flex",
    position: "relative",
  },
  container: {
    flex: 1,
    width: "100%",
    display: "flex",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.black,
    marginBottom: 20,
  },
  addButtonContainer: {
    width: "100%",
    position: "absolute",
    bottom: 65,
  },
});

export default BillScanner;
