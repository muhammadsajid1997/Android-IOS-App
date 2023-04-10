import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../HomeScreen";
import AuthStack from "./AuthNavigator";
import whisper from "../Whisper";
import HomeStack from "./HomeStack";
import DrawerStack from "./DrawerStep";
import myApps from "../myApps";
const Stack = createNativeStackNavigator();

function MyStack() {
  // const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name={"auth"}
          component={AuthStack}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Home"
          component={whisper}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="myApps"
          component={myApps}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default MyStack;
