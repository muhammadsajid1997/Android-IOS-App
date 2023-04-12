import React, { useContext, useEffect, useMemo, useState } from "react";
// import { View, Text } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { HomeScreen } from './component/HomeScreen';
import AppNavigator from "./component/Navigation/AppNavigator";
import { PermissionsAndroid, Platform } from "react-native";

// function HomeScreen() {
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Text>Home Screen</Text>
//     </View>
//   );
// }

// const Stack = createNativeStackNavigator();

function App(props: any) {
  useEffect(() => {
    requestUserPermission();
  }, []);
  const requestUserPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        console.log("write external stroage", grants);

        if (
          grants["android.permission.WRITE_EXTERNAL_STORAGE"] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants["android.permission.READ_EXTERNAL_STORAGE"] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants["android.permission.RECORD_AUDIO"] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log("permissions granted");
        } else {
          console.log("All required permissions not granted");

          return;
        }
      } catch (err) {
        // console.warn(err);

        return;
      }
    }
  };
  return <AppNavigator {...props} />;
}

export default App;
