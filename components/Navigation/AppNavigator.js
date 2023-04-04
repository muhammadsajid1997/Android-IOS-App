import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './AuthNavigator';
import HomeStack from './HomeStack';
import DrawerStack from './DrawerStep';
import MyApps from '../MyApps';

const Stack = createStackNavigator();
  {/* <Drawer.Screen name="home"options={{ headerShown: false,drawerPosition:"right" }} component={HomeStack} /> */}
function MyStack() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name={'Auth'}
            component={AuthStack}
            options={{
              headerShown: false,
            }}
          />
           <Stack.Screen
            name="Home"
            component={(DrawerStack)}
            options={{
              headerShown: false,
              
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
            name="Drawer"
            component={DrawerStack}
            options={{
              headerShown: false,
            }}
          />
         
        </Stack.Navigator>
      </NavigationContainer>
    )
  }

export default MyStack;