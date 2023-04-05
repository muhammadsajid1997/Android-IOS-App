import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "react-query";
// import "react-native-reanimated";

import Home from "./components/Home";
import Notes from "./components/Notes/list";
import HomeScreen from "./components/HomeScreen";
import LoginScreen from "./components/LoginScreen";
import SignUpScreen from "./components/SignUpScreen";
import SplashScreen from "./components/SplashScreen";
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"; 
import Whisper from "./components/Whisper";
import { createDrawerNavigator } from '@react-navigation/drawer';
import AppNavigator from "./components/Navigation/AppNavigator";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator()
const queryClient = new QueryClient();
const Drawer = createDrawerNavigator();

export default function App(props:any) {

  return (
    <AppNavigator {...props} />
    // <AppNavigator />

    // <NavigationContainer>
    //   {/* <Drawer.Navigator>
    //     <Drawer.Screen name="splashScreen" component={SplashScreen} />
    //     <Drawer.Screen name="home" component={Whisper} />
    //     <Drawer.Screen name="login" component={LoginScreen} />
    //     <Drawer.Screen name="signUp" component={SignUpScreen} />
    //   </Drawer.Navigator> */}
    //   <Stack.Navigator initialRouteName="splashScreen" screenOptions={{ headerShown: false}}>

    //   <Stack.Screen options={{title:"",headerStyle: { backgroundColor: '#307ecc' }}}  name="splashScreen" component={SplashScreen} />

    //     <Stack.Screen  name="home"  component={Whisper} />
    //     <Stack.Screen options={{title:"",headerStyle: {  backgroundColor: '#307ecc' }, headerBackVisible:false}} name="login" component={LoginScreen} />
    //     <Stack.Screen options={{title:"",  headerStyle: {  backgroundColor: '#307ecc' },headerBackVisible:false}}  name="signUp" component={SignUpScreen} />

    //   </Stack.Navigator>
    // </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

