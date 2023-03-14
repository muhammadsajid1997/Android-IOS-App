import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../LoginScreen';
import SignUpScreen from '../SignUpScreen';


const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="login"
        component={LoginScreen}
        options={{ headerShown: false }} />
      <Stack.Screen
        name="signUp"
        component={SignUpScreen}
        options={{ headerShown: false }}/>
     
    </Stack.Navigator>
  );
};

export default AuthStack;