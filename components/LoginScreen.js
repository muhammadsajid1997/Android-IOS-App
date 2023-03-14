import React, { useState, createRef } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';

// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Loader from './Loader';
import logo from './Images/heyAlliTitle.jpg'
import logoBack from './Images/logoback.png'
import signInButton from './Images/signIn.jpg'
import { LinearGradient } from 'expo-linear-gradient';
import facebook from './Images/facebook.png'
import google from './Images/google.png'
import apple from './Images/apple.png'
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { Feather } from '@expo/vector-icons';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useAuthRequest } from 'expo-auth-session/providers/google';
// import auth from '@react-native-firebase/auth';

const LoginScreen = ({ navigation }) => {
  WebBrowser.maybeCompleteAuthSession();

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '44373533249-4eatu4snl2fhth2cqc7sf848fh19sqvk.apps.googleusercontent.com',
    androidClientId: '44373533249-k414100f72pkrcrm4s9i0p3kinm9s3q0.apps.googleusercontent.com'

  });
  
  // GoogleSignin.configure({
  //   webClientId: '127065750913-8r60ecto94cbq64rvghk0gepguatgs3l.apps.googleusercontent.com',
  // });

  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const auths = getAuth();
  const provider = new GoogleAuthProvider();
  const passwordInputRef = createRef();

  function loginUser() {
    setLoading(true)
    signInWithEmailAndPassword(auths, userEmail, userPassword)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        navigation.navigate("Home",{screen:"home"})
        console.log(user,"loginScreen")
        setLoading(false)
        // ...
      })
      .catch((error) => {
        setLoading(false)
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(error)
      });
  }


  function loginUserWithGoogle() {
    console.log("login test")
    setLoading(true)
    // const auth = getAuth();

    signInWithPopup(useAuthRequest, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;

        // onst user = userCredential.user;
        navigation.navigate("home")
        console.log(user)
        setLoading(false)
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });


  }

  const handleSubmitPress = () => {
    setErrortext('');
    if (!userEmail) {
      alert('Please fill Email');
      return;
    }
    if (!userPassword) {
      alert('Please fill Password');
      return;
    }
    setLoading(true);
    let dataToSend = { email: userEmail, password: userPassword };
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    fetch('http://localhost:3000/api/user/login', {
      method: 'POST',
      body: formBody,
      headers: {
        //Header Defination
        'Content-Type':
          'application/x-www-form-urlencoded;charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //Hide Loader
        setLoading(false);
        console.log(responseJson);
        // If server response message same as Data Matched
        if (responseJson.status === 'success') {
          AsyncStorage.setItem('user_id', userEmail);
          console.log(responseJson.data.email);
          navigation.navigate('Home');
        } else {
          setErrortext(responseJson.msg);
          console.log('Please check your email id or password');
        }
      })
      .catch((error) => {
        //Hide Loader
        setLoading(false);
        console.error(error);
      });
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Loader loading={loading} />

      <ScrollView
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <View>
          <KeyboardAvoidingView enabled>
            <View>
              <Image style={{ width: '100%' }} source={logoBack} />
            </View>

            <View style={{ ...styles.SectionStyle }}>
              <MaterialIcons name="email" style={{ top: 12, right: 4 }} size={16} color="#b1b6c6" />

              <TextInput
                style={styles.inputStyle}
                onChangeText={(UserEmail) =>
                  setUserEmail(UserEmail)
                }
                placeholder="Enter Email" //dummy@abc.com
                placeholderTextColor="#9ea3b7"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() =>
                  passwordInputRef.current &&
                  passwordInputRef.current.focus()
                }
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <MaterialCommunityIcons name="lock-outline" style={{ top: 12, right: 4 }} size={16} color="#b1b6c6" />

              <TextInput
                style={styles.inputStyle}
                onChangeText={(UserPassword) =>
                  setUserPassword(UserPassword)
                }
                placeholder="Enter Password" //12345
                placeholderTextColor="#9ea3b7"
                keyboardType="default"
                ref={passwordInputRef}
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
                secureTextEntry={!showPassword}
                underlineColorAndroid="#f000"
                returnKeyType="next"
              />
              <Feather name={showPassword ? "eye" : "eye-off"} style={{ top: 12, right: 4 }} size={16} color="#b1b6c6" onPress={() => setShowPassword(!showPassword)} />
            </View>

            {errortext != '' ? ( <Text style={styles.errorTextStyle}>  {errortext}</Text> ) : null}

            <TouchableOpacity
              style={{ justifyContent: 'center', flex: 1, alignItems: 'center',backgroundColor:"#14a5f4",marginHorizontal:18, borderRadius:6 }}
              activeOpacity={0.5}
              onPress={() => {
                // props.navigation.navigate("home")
                loginUser()
              }}>
              {/* <Image style={{ borderRadius: 10, marginVertical: 10 }} source={signInButton}>
              </Image> */}

              <Text style={styles.buttonTextStyle}>Login</Text>
            </TouchableOpacity>

            <View style={{ flex: 1, flexDirection: 'row', marginTop: 10, marginHorizontal: 18 , alignSelf: 'center',}}>
              <View style={styles.socialMediaIcon}>
                <Image style={styles.socialMediaImg} source={facebook} />
              </View>
              {/* <TouchableOpacity onPress={() => onGoogleButtonPress()}> */}
              <TouchableOpacity onPress={() => promptAsync()}>
                <View style={styles.socialMediaIcon}>
                  <Image style={styles.socialMediaImg} source={google} />
                </View>
              </TouchableOpacity>

              <View style={styles.socialMediaIcon}>
                <Image style={styles.socialMediaImg} source={apple} />
              </View>

            </View>
            
            <Text
              style={styles.registerTextStyle}
              onPress={() => navigation.navigate('signUp')}>
              Don't have a Account ? <Text style={{ color: '#4d97f0' }}>Sign Up</Text>
            </Text>

          </KeyboardAvoidingView>

        </View>

      </ScrollView>
    </View>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    alignContent: 'center',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    // top: -100,
    // marginTop: 20,
    marginLeft: "5%",
    marginRight: "5%",
    marginVertical: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 0.2,
    borderRadius: 2,
    borderColor: '#E5E4E2',
    backgroundColor: "#e9ebf2"
  },
  buttonStyle: {
    backgroundColor: '#4d97f0',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 0,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: 'white',
    paddingVertical: 10,
    fontSize: 18,
    fontWeight:"bold"

  },
  inputStyle: {
    flex: 1,
    color: 'black',
    marginLeft: 5
  },
  registerTextStyle: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'center',
    padding: 10,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  socialMediaIcon: {
    height: 35,
    width: 35,
    borderWidth: 1, 
    borderRadius: 10, 
    borderColor: 'grey',
    margin:10
  },
  socialMediaImg:{height:20,width:20,alignSelf: 'center',marginTop:6}
});