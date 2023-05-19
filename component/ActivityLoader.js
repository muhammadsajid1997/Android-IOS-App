import React from "react";
import { View, ActivityIndicator } from "react-native";

const ActivityLoader = () => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      // backgroundColor: "#b0bec550",
    }}
  >
    <View
      style={{
        width: 90,
        alignItems: "center",
        justifyContent: "center",
        height: 90,

        // backgroundColor: "#ffffff",
        borderRadius: 20,
      }}
    >
      <ActivityIndicator size={50} color={"#0202f379"} />
    </View>
  </View>
);

export default ActivityLoader;
