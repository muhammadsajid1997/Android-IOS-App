import * as React from 'react';
// import { View, Text } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { HomeScreen } from './component/HomeScreen';
import AppNavigator from "./component/Navigation/AppNavigator";

// function HomeScreen() {
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Text>Home Screen</Text>
//     </View>
//   );
// }

// const Stack = createNativeStackNavigator();

function App(props:any) {
  return (
    <AppNavigator {...props} />
  );
}

export default App;
