import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginScreen from '../LoginScreen';
import Whisper from '../Whisper';
const Drawer = createDrawerNavigator();

const DrawerStack = () => {

  return (
      <Drawer.Navigator>
         {/* <Drawer.Screen name="splashScreen" component={SplashScreen} /> */}
         <Drawer.Screen name="home"  options={{ headerShown: false }} component={Whisper} />
         {/* <Drawer.Screen name="login" component={LoginScreen} />
         <Drawer.Screen name="signUp" component={SignUpScreen} /> */}
       </Drawer.Navigator> 
  );
};

export default DrawerStack;