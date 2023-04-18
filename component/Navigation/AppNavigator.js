import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../HomeScreen";
import AuthStack from "./AuthNavigator";
import whisper from "../Whisper";
import HomeStack from "./HomeStack";
import DrawerStack from "./DrawerStep";
import myApps from "../myApps";
import LandingScreen from "../LandingScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

function MyStack() {
  const Stack = createNativeStackNavigator();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoaded, setAuthLoaded] = useState(false);
  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      authLoaded && setAuthLoaded(false);
      const UsersData = await AsyncStorage.getItem("Token");
      console.log("AccesstokenData", UsersData);
      if (UsersData) {
        setIsAuthenticated(true);
        setAuthLoaded(true);
      } else {
        console.log("AccesstokenDataelse", UsersData);
        setIsAuthenticated(false);
        setAuthLoaded(true);
      }
    } catch (error) {}
  };
  const getusers = async () => {
    const UsersData = await AsyncStorage.getItem("Token");
    console.log(UsersData);
    if (UsersData) {
    }
  };

  // const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      {isAuthenticated == false ? (
        <Stack.Navigator>
          <Stack.Screen
            name={"auth"}
            component={AuthStack}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
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
      )}
    </NavigationContainer>
  );
}
export default MyStack;
