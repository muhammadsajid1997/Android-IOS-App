import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const BussinessUpgrade = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 20 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="ios-arrow-back-circle-sharp"
            size={28}
            color={"#000"}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",

          flex: 1,
        }}
      >
        <Text style={{ color: "grey", fontSize: 25 }}>coming soon</Text>
      </View>
    </View>
  );
};

export default BussinessUpgrade;
