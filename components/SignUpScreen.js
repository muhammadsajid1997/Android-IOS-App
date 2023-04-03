// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, { useState, createRef, useCallback } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
// import { AntDesign, Feather,FontAwesome,MaterialCommunityIcons,MaterialIcons } from '@expo/vector-icons';
import { AntDesign, Feather,FontAwesome,MaterialCommunityIcons,MaterialIcons } from "react-native-vector-icons";

import { addDoc, collection, getFirestore } from "firebase/firestore";
import countryList from './countryList'
// import DropDownPicker from "react-native-dropdown-picker";
import Loader from './Loader';
import logo from './Images/logo.png'
// import { getAuth, createUserWithEmailAndPassword, parseActionCodeURL } from "firebase/auth";
// import { FontAwesome } from '@expo/vector-icons';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
import app, { auth, createUser } from '../firebaseConfig'
// import { MaterialIcons } from '@expo/vector-icons';
import { async } from '@firebase/util';
import getCities from '../firebaseConfig';
import logoBack from './Images/logoback.png'
import { LinearGradient } from 'expo-linear-gradient';
import facebook from './Images/facebook.png'
import google from './Images/google.png'
import apple from './Images/apple.png'
import button from './Images/signUpButton.png'
import HeyAlliImg from "./Images/heyAllis.png"

// import db from '../firebaseConfig';
const RegisterScreen = (props) => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userAge, setUserAge] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [userCountry, setUserCountry] = useState('');
  const [userMobileNumber, setUserMobileNumber] = useState('');

  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [companyOpen, setCompanyOpen] = useState(false);
  const [companyValue, setCompanyValue] = useState(null);
  const [country, setCountry] = useState(countryList);
  const [showPassword, setShowPassword] = useState(false);

  const [
    isRegistraionSuccess,
    setIsRegistraionSuccess
  ] = useState(false);
  const auth = getAuth();
  const handleSignUp = async () => {


    createUserWithEmailAndPassword(auth, userEmail, userPassword)
      .then(async userCredentials => {
        const user = userCredentials.user;
        createUser({
          uid: user.uid,
          userEmail: userEmail,
          userName: userName,
          userAge: userAge,
          userMobileNumber: userMobileNumber,
          userCountry: userCountry,
          zipCode: zipCode

        }, "users")
          .then((responseJson) => {
            //Hide Loader
            setLoading(false);
            console.log(responseJson);

            // If server response message same as Data Matched
            // if (responseJson.status === 'success') {
            //   setIsRegistraionSuccess(true);
            //   console.log(
            //     'Registration Successful. Please Login to proceed'
            //   );
            // } else {
            //   setErrortext(responseJson.msg);
            // }
            props.navigation.navigate("home")
          })
          .catch((error) => {
            //Hide Loader
            setLoading(false);
            console.error(error);
          });
        // handleSubmitButton(user.uid)




        console.log('Registered with:', user.email);
      })
      .catch(error => {


        alert(error.message)
      })
  }


  async function addUser(user) {

  }
  const emailInputRef = createRef();
  const ageInputRef = createRef();
  const addressInputRef = createRef();
  const passwordInputRef = createRef();
  const onCompanyOpen = useCallback(() => {
    setCompanyOpen(false);
  }, []);
  const handleSubmitButton = () => {
    setErrortext('');
    if (!userName) {
      alert('Please fill Name');
      return;
    }
    if (!userEmail) {
      alert('Please fill Email');
      return;
    }
    // if (!userAge) {
    //   alert('Please fill Age');
    //   return;
    // }
    // if (!userCountry) {
    //   alert('Please fill country');
    //   return;
    // }
    // if (!userPassword) {
    //   alert('Please fill Password');
    //   return;
    // }
    // if (!userMobileNumber) {
    //   alert('Please fill Mobile');
    //   return;
    // }

    handleSignUp()

  };
  if (isRegistraionSuccess) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#307ecc',
          justifyContent: 'center',
        }}>
        <Image
          source={logo}
          style={{
            height: 10,
            resizeMode: 'contain',
            alignSelf: 'center'
          }}
        />
        <Text style={styles.successTextStyle}>
          Registration Successful
        </Text>
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={() => props.navigation.navigate('LoginScreen')}>
          <Text style={styles.buttonTextStyle}>Login Now</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (

    <View >
      <LinearGradient
        locations={[0.5, 2, 0.8, 0.5]}
        colors={["#021227", "#041a3d", "#03193b", "#031735"]}
        style={{ height: "100%" }}
      >
        <Loader loading={loading} />

        <ScrollView nestedScrollEnabled={true} keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            justifyContent: 'center',
            alignContent: 'center',
          }}>

          <View style={{marginTop:50}}>
            <Image style={{ width: 130, height:110 , alignSelf:"center" }} source={HeyAlliImg} />
            {/* <Text style={{fontWeight:"bold" , color:"#0d82ec" , fontSize:50 , textAlign:"center"}}>Hey Alli</Text> */}
          </View>

          <View style={{ alignItems: 'center', marginTop: 8, borderTopEndRadius: 50 }}>
            {/* <Image
            source={logo}
            style={{
              width:1000,
              height: 200,
              resizeMode: 'contain',
              margin: 0,
            }}
          /> */}
          </View>

          <KeyboardAvoidingView enabled>

            <View style={styles.SectionStyle}>
              <View>
                <FontAwesome name="user" style={{ top: 12, right: 4 }} size={16} color="#36415f" />
              </View>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(UserName) => setUserName(UserName)}
                // underlineColorAndroid="#f000"
                placeholder="Enter Name"
                placeholderTextColor="white"
                autoCapitalize="sentences"
                returnKeyType="next"
                onSubmitEditing={() => emailInputRef.current && emailInputRef.current.focus()}
                blurOnSubmit={false}
              />
            </View>

            <View style={styles.SectionStyle}>
              <View>
                <MaterialIcons name="email" style={{ top: 12, right: 4 }} size={16} color="#36415f" />
              </View>

              <TextInput
                style={styles.inputStyle}
                onChangeText={(UserEmail) => setUserEmail(UserEmail)}
                underlineColorAndroid="#f000"
                placeholder="Enter Email"
                placeholderTextColor="white"
                keyboardType="email-address"
                ref={emailInputRef}
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current && passwordInputRef.current.focus()}
                blurOnSubmit={false}
              >
              </TextInput>
            </View>

            <View style={styles.SectionStyle}>
              <View>
                <MaterialIcons name="phone" style={{ top: 12, right: 4 }} size={16} color="#36415f" />
              </View>

              <TextInput
                style={styles.inputStyle}
                onChangeText={(userMobileNumber) => setUserEmail(userMobileNumber)}
                underlineColorAndroid="#f000"
                placeholder="Enter Mobile"
                placeholderTextColor="white"
                keyboardType="number-pad"
                ref={emailInputRef}
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current && passwordInputRef.current.focus()}
                blurOnSubmit={false}
              >
              </TextInput>
            </View>

            <View style={styles.SectionStyle}>
              <View>
                <MaterialCommunityIcons name="key" style={{ top: 12, right: 4 }} size={16} color="#36415f" />
              </View>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(UserPassword) => setUserPassword(UserPassword)}
                underlineColorAndroid="#f000"
                placeholder="Enter Password"
                placeholderTextColor="white"
                ref={passwordInputRef}
                returnKeyType="next"
                secureTextEntry={!showPassword}
                onSubmitEditing={() => ageInputRef.current && ageInputRef.current.focus()}
                blurOnSubmit={false}
              />
              <Feather name={showPassword ? "eye" : "eye-off"} style={{ top: 12, right: 4 }} size={16} color="#36415f" onPress={() => setShowPassword(!showPassword)} />
            </View>

            {errortext != '' ? (<Text style={styles.errorTextStyle}>{errortext} </Text>) : null}

            <TouchableOpacity style={{ justifyContent: 'center', flex: 1, alignItems: 'center', backgroundColor: "#159df3", marginHorizontal: 18, borderRadius: 6, marginTop: 10 }} activeOpacity={0.5}
              onPress={() => { handleSubmitButton() }}>
              <Text style={styles.buttonTextStyle}>Create account</Text>
            </TouchableOpacity>

            <View style={{ flex: 1, flexDirection: 'row', marginTop: 10, marginHorizontal: 18, alignSelf: 'center', }}>
              <View style={styles.socialMediaIcon} >
                <Image style={styles.socialMediaImg} source={facebook} />
              </View>
              <View style={styles.socialMediaIcon}>
                <Image style={styles.socialMediaImg} source={google} />
              </View>
              <View style={styles.socialMediaIcon}>
                <AntDesign style={{marginHorizontal:5,marginTop:4}} name="apple1" size={22} color="white" />
              </View>
            </View>

            <Text
              style={styles.registerTextStyle}
              onPress={() => props.navigation.navigate('login')}>
              Already Have an account ? <Text style={{ color: 'white' }}>Sign In</Text>
            </Text>
          </KeyboardAvoidingView>

        </ScrollView>
      </LinearGradient>
    </View>
  );
};
export default RegisterScreen;

const styles = StyleSheet.create({
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
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#36415f',
    backgroundColor: "transparent"
  },
  DropDown: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 18,
    marginRight: 18,
    margin: 10,
    paddingLeft: 15,
    paddingRight: 15,

  },
  buttonStyle: {
    backgroundColor: '#4d97f0',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 60,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,

  },
  buttonTextStyle: {
    color: 'white',
    paddingVertical: 10,
    fontSize: 18,
    fontWeight: "bold"
  },
  inputStyle: {
    flex: 1,
    color: 'white',
    marginLeft: 5,

  },
  registerTextStyle: {
    color: '#8f8f8f',
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
  successTextStyle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    padding: 30,
  },
  dropdown: {
    borderColor: "#B7B7B7",
    height: 40,



    borderWidth: 0.8,
    borderRadius: 30,
    borderColor: 'black',


  },
  placeholderStyles: {
    height: 20
  },
  socialMediaIcon: {
    height: 35,
    width: 35,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'grey',
    margin: 10
  },
  socialMediaImg: { height: 20, width: 20, alignSelf: 'center', marginTop: 6 }
});