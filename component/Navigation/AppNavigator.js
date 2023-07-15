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
import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator } from "react-native";
import { getuser, restoreSecrate, restoreStatus } from "../Redux/authActions";
import ActivityLoader from "../ActivityLoader";

export const AppNavContainer = () => {
  const dispatch = useDispatch();

  const { isLogin, loading, isSecrateCode } = useSelector(
    (state) => state.authReducers
  );

  console.log("isSecrateCode", isSecrateCode);

  console.log("loadingloading", loading);

  // const [authLoaded, setAuthLoaded] = useState(false);
  useEffect(() => {
    dispatch(restoreStatus());
  }, [restoreStatus]);

  useEffect(() => {
    dispatch(restoreSecrate());
  }, [restoreSecrate]);

  // if (isLoading) {
  //   return <ActivityIndicator />;
  // }
  // const Stack = createNativeStackNavigator();
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [authLoaded, setAuthLoaded] = useState(false);

  // useEffect(() => {
  //   // getUser();
  // }, []);

  // const getUser = async () => {
  //   try {
  //     authLoaded && setAuthLoaded(false);
  //     const UsersData = await AsyncStorage.getItem("Token");
  //     console.log("AccesstokenData", UsersData);
  //     if (UsersData) {
  //       setIsAuthenticated(true);
  //       setAuthLoaded(true);
  //     } else {
  //       // console.log("AccesstokenDataelse", UsersData);
  //       setIsAuthenticated(false);
  //       setAuthLoaded(true);
  //     }
  //   } catch (error) {}
  // };
  // const getusers = async () => {
  //   const UsersData = await AsyncStorage.getItem("Token");
  //   console.log(UsersData);
  //   if (UsersData) {
  //   }
  // };

  // const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      {loading == true ? (
        <ActivityLoader />
      ) : isLogin == true ? (
        <HomeStack isSecrateCode={isSecrateCode} />
      ) : (
        <AuthStack />
      )}

      {/* {state.token == "" ? <AuthStack /> : <HomeStack />} */}
      {/* {isAuthenticated == false ? ( */}

      {/* <Stack.Screen
        name={"auth"}
        component={AuthStack}
        options={{
          headerShown: false,
        }}
      /> */}
    </NavigationContainer>
  );
};
