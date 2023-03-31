import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginScreen from '../LoginScreen';
import ProfileScreen from '../ProfileScreen';
import SplashScreen from '../SplashScreen';
import Whisper from '../Whisper';
import HomeStack from './HomeStack';
import SettingScreen from '../SettingScreen';
import { signOutFunc } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
const Drawer = createDrawerNavigator();

const DrawerStack = () => {
  const navigation = useNavigation();


  const logout = async () => {
    try {
      await signOutFunc;
      navigation.navigate('login')
      console.log('User signed out successfully.');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  }


  return (
    <Drawer.Navigator options={{}}>
      {/* <Drawer.Screen name="splashScreen" component={SplashScreen} /> */}
      {/* <Drawer.Screen name="home"options={{ headerShown: false,drawerPosition:"right" }} component={HomeStack} /> */}
      <Drawer.Screen name="home"options={{ headerShown: false,drawerPosition:"right",title:"Home" }} component={Whisper} />
      <Drawer.Screen name="Profile"options={{ headerShown: false,drawerPosition:"right" }} component={ProfileScreen} />
      <Drawer.Screen name="Setting"options={{ headerShown: false,drawerPosition:"right" }} component={SettingScreen} />
      <Drawer.Screen name="Logout"options={{ headerShown: false,drawerPosition:"right" }} component={logout} />
      {/* <Drawer.Screen name="login" component={LoginScreen} />
      {/* <Drawer.Screen name="login" component={LoginScreen} />
        //  <Drawer.Screen name="signUp" component={SignUpScreen} /> */}
    </Drawer.Navigator>
  );
};

export default DrawerStack;