// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Image,
  Text,
  ImageBackground
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from './Images/splashScreen.png'
// import { getAuth, onAuthStateChanged } from 'firebase/auth';
const SplashScreen = ({ navigation }) => {
  //State for ActivityIndicator animation
  const [animating, setAnimating] = useState(true);


  useEffect(() => {
    setTimeout(() => {
      setAnimating(false);
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          console.log(user , "splashScreen")
          navigation.navigate("home")
          // ...  
        } else {
          // User is signed out
          // ...
          navigation.navigate("login")

        }
      })
    }, 5000);
  }, []);

  return (
    <View style={{ height: '100%' }}>
      <ImageBackground
        source={logo}
        style={{ flex: 1 }}
        resizeMode='stretch'
      >
        <ActivityIndicator
          animating={animating}
          color="#FFFFFF"
          size="large"
          style={styles.activityIndicator}
        />

      </ImageBackground>
      {/* <Text style={{marginTop:30,fontSize:40,fontWeight:'bold',color:'white',fontFamily:'san'}}>Hey Alli</Text>
      <Text style={{marginTop:30,fontSize:20,color:'white'}}>THE WORLD'S MOST POWERFULL AI</Text> */}


    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
});