import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../LoginScreen";
import Whisper from "../Whisper";
import myApps from "../myApps";
import Secratekey from "../Secratekey";
import LoginSecrateCode from "../LoginSecrateCode";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { getsecratecode, restoreSecrate } from "../Redux/authActions";
import ActivityLoader from "../ActivityLoader";
import BussinessUpgrade from "../BussinessUpgrade";
import whisper from "../Whisper";
import ReferralHistoryScreen from "../ReferralScreen";
import ShareScreen from "../ShareScreen";
import TexttoSpeechComponent from "../TexttoSpeechComponent";
import MenuScreen from "../MenuScreen";

const Stack = createNativeStackNavigator();

const HomeStack = (isSecrateCode) => {
  const { isLogin, loading } = useSelector((state) => state.authReducers);
  // console.log("isSecrateCode", isSecrateCode.isSecrateCode);
  const dispatch = useDispatch();
  // // const [isLoading, setisLoading] = useState(true);
  // // const state = useSelector((state) => state.authReducers);

  // const { isSecrateCode, loading } = useSelector((state) => state.authReducers);
  // console.log(isSecrateCode);

  // const [authLoaded, setAuthLoaded] = useState(false);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="home"
        component={whisper}
        options={{
          headerShown: false,
        }}
      />
      {/* <Stack.Screen
        name={
          loading ? (
            <ActivityLoader />
          ) : isSecrateCode.isSecrateCode == false ? (
            "home"
          ) : (
            "LoginSecrateCode"
          )
        }
        component={
          loading ? (
            <ActivityLoader />
          ) : isSecrateCode.isSecrateCode == false ? (
            Whisper
          ) : (
            LoginSecrateCode
          )
        }
        options={{ headerShown: false }}
      /> */}
      <Stack.Screen
        name="homepage"
        component={Whisper}
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
      <Stack.Screen
        name="Secratekey"
        component={Secratekey}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="BussinessUpgrade"
        component={BussinessUpgrade}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ReferralData"
        component={ReferralHistoryScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TexttoSpeechScreen"
        component={TexttoSpeechComponent}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="ShareScreen"
        component={ShareScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MenuScreen"
        component={MenuScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
