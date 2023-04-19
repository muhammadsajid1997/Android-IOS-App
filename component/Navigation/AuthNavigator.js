import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../LoginScreen";
import OtpScreen from "../OtpScreen";
import SignUpScreen from "../SignUpScreen";

const AuthStack = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName={LoginScreen}>
      <Stack.Screen
        name="Auth"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="signUp"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="otp"
        component={OtpScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
