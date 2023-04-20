import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../LoginScreen";
import Whisper from "../Whisper";
import myApps from "../myApps";
import Secratekey from "../Secratekey";
import LoginSecrateCode from "../LoginSecrateCode";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { getsecratecode } from "../Redux/authActions";

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  const dispatch = useDispatch();
  const [isLoading, setisLoading] = useState(true);
  const state = useSelector((state) => state.authReducers);
  console.log(state);

  const [authLoaded, setAuthLoaded] = useState(false);
  useEffect(() => {
    authLoaded && setAuthLoaded(false);
    if (state.skey == "") {
      dispatch(getsecratecode());
      setisLoading(false);
    } else {
      setisLoading(false);
    }
  }, [state.skey]);

  if (isLoading) {
    return <ActivityIndicator />;
  }
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={state.skey == "" ? "home" : "LoginSecrateCode"}
        component={state.skey == "" ? Whisper : LoginSecrateCode}
        options={{ headerShown: false }}
      />
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
    </Stack.Navigator>
  );
};

export default HomeStack;
