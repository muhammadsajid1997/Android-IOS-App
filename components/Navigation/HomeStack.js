import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import LoginScreen from '../LoginScreen';
import Whisper from '../Whisper';
import MyApps from '../MyApps';


const Stack = createStackNavigator();

const HomeStack = () => {
  
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="home"
        component={Whisper}
        options={{ 
          headerShown: false  ,
        }}
        
      />
      <Stack.Screen
        name="MyApps"
        component={MyApps}
        options={{ 
          headerShown: false  ,
        }}
        
      />
      
       <Stack.Screen
        name="login"
        component={LoginScreen}
        options={{ headerShown: false }}
        
      />
    
    </Stack.Navigator>
  );
};

export default HomeStack;