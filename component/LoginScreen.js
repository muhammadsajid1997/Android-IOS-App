import React, { useState, createRef, useRef } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  SafeAreaView,
} from "react-native";
import ContryPicker, { DARK_THEME } from "react-native-country-picker-modal";
// import AsyncStorage from '@react-native-community/async-storage';
// import AsyncStorage from '@react-native-async-storage/async-storage';

import Loader from "../component/Loader";
// import logo from './Images/heyAlliTitle.jpg'
import logoBack from "./Images/logoback.png";
// import signInButton from './Images/signIn.jpg'
// import { LinearGradient } from 'expo-linear-gradient';
// import facebook from './Images/facebook.png'
// import google from './Images/google.png'
// import apple from './Images/apple.png'
// import * as WebBrowser from 'expo-web-browser';
// import * as Google from 'expo-auth-session/providers/google';
// import { MaterialIcons } from '@expo/vector-icons';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth';
// import { Feather } from '@expo/vector-icons';
// // import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import { useAuthRequest } from 'expo-auth-session/providers/google';
// // import auth from '@react-native-firebase/auth';
import axios from "axios";
import AnimateLoadingButton from "react-native-animate-loading-button";
const LoginScreen = ({ navigation }) => {
  const [userphoneNumber, setUserphoneNumber] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const passwordInputRef = createRef();
  const [countryCode, setCountryCode] = useState("US");
  const [callingCodes, setcallingCode] = useState("1");
  const ldngbtn = useRef(null);

  const onChangeCallingcode = (value) => {
    setcallingCode(value);
  };
  const loginUser = () => {
    console.log(callingCodes);
    console.log(userphoneNumber);
    console.log(ldngbtn);

    // if (userphoneNumber == "") {
    //   Alert.alert("Please Enter PhoneNumber");
    // } else {
    ldngbtn.current.showLoading(true);
    axios
      .post(
        "https://heyalli.azurewebsites.net/api/Identity/login",
        {
          PhoneNumber: `+${callingCodes}${userphoneNumber}`,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        // console.log(response);
        ldngbtn.current.showLoading(false);
        if (response.data) {
          navigation.navigate("otp", {
            phoneNumber: `+${callingCodes}${userphoneNumber}`,
            type: "Login",
          });
        } else {
          Alert.alert("Invalid PhoneNumber");
          console.log("erroe");
          ldngbtn.current.showLoading(false);
        }
        // navigation.navigate("Home", { screen: "home" });
      })
      .catch((error) => {
        ldngbtn.current.showLoading(false);
        Alert.alert(error.response.data);
        console.log("axios error:", error.response.data);
      });
  };
  // console.log("called");
  // };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <SafeAreaView />
      {/* <Text>HELLO</Text>
            <View>
                <Image style={{ width: '100%' }} source={logoBack} />
            </View> */}
      <ScrollView
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <View>
          <KeyboardAvoidingView enabled>
            <View>
              <Image style={{ width: "100%" }} source={logoBack} />
            </View>

            <View style={{ ...styles.SectionStyle }}>
              <ContryPicker
                withFilter
                countryCode={countryCode}
                countryCodes
                withAlphaFilter={false}
                withCurrencyButton={false}
                withCallingCode={true}
                onSelect={(value) => {
                  const { cca2, callingCode } = value;
                  const abc = value.cca2;
                  onChangeCallingcode(value.callingCode[0]);
                  // console.log("abc",abc)
                  // console.log("cca2",cca2)
                  // onChange({ name:'countryCode',value});
                  // onChange({ name: 'callingCode', abc});
                  setCountryCode(value.cca2);
                  setcallingCode(value.callingCode[0]);
                }}
                containerButtonStyle={{
                  // borderWidth:1,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  // borderBottomWidth: 1.8,
                  // borderColor: "grey",
                  // marginBottom:5
                  // borderWidth:1,
                  // width:30

                  // width:35,
                  // alignItems:'center',
                  // justifyContent:'center',
                  // borderWidth:1,
                  // width:40,
                  // height:'110%',
                  // alignItems:'center',
                  // marginLeft:10
                }}
              ></ContryPicker>
              {/* <TextInput
                style={styles.inputStyle1}
                onChangeText={(userphoneNumber) =>
                  setUserphoneNumber(userphoneNumber)
                }
                placeholder="+91" //dummy@abc.com
                placeholderTextColor="#9ea3b7"
                autoCapitalize="none"
                keyboardType="phone-pad"
                returnKeyType="next"
                onSubmitEditing={() =>
                  passwordInputRef.current && passwordInputRef.current.focus()
                }
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              /> */}

              {/* <MaterialIcons name="email" style={{ top: 12, right: 4 }} size={16} color="#b1b6c6" /> */}

              <TextInput
                style={styles.inputStyle}
                onChangeText={(userphoneNumber) =>
                  setUserphoneNumber(userphoneNumber)
                }
                placeholder="Enter phone number" //dummy@abc.com
                placeholderTextColor="#9ea3b7"
                autoCapitalize="none"
                keyboardType="phone-pad"
                returnKeyType="next"
                onSubmitEditing={() =>
                  passwordInputRef.current && passwordInputRef.current.focus()
                }
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            </View>

            {/* {errortext != '' ? ( <Text style={styles.errorTextStyle}>  {errortext}</Text> ) : null} */}

            <TouchableOpacity
              style={{
                justifyContent: "center",
                flex: 1,
                alignItems: "center",
                backgroundColor: "#14a5f4",
                marginHorizontal: 18,
                borderRadius: 6,
              }}
              // activeOpacity={0.5}
              // onPress={() => {
              //   // navigation.navigate("otp")
              //   if (userphoneNumber == "") {
              //     Alert.alert("Please enter Phonenumber");
              //     // loginUser();
              //   } else if (isNaN(userphoneNumber)) {
              //     Alert.alert("Please enter a valid Phonenumber");
              //     // Alert.alert("Please enter a valid Phonenumber");
              //   } else {
              //     loginUser();
              //     // Alert.alert("apicall");
              //   }
              // }}
            >
              <AnimateLoadingButton
                useNativeDriver={true}
                style={{
                  justifyContent: "center",
                  flex: 1,
                  alignItems: "center",
                  backgroundColor: "#14a5f4",
                  marginHorizontal: 18,
                  borderRadius: 6,
                }}
                ref={ldngbtn}
                width={300}
                height={45}
                title="Login"
                titleFontSize={16}
                titleColor="rgb(255,255,255)"
                backgroundColor="#14a5f4"
                borderRadius={6}
                onPress={() => {
                  if (userphoneNumber == "") {
                    Alert.alert("Please enter Phonenumber");
                    // loginUser();
                  } else if (isNaN(userphoneNumber)) {
                    Alert.alert("Please enter a valid Phonenumber");
                    // Alert.alert("Please enter a valid Phonenumber");
                  } else {
                    loginUser();
                    // Alert.alert("apicall");
                  }
                }}
              />
              {/* <Text style={styles.buttonTextStyle}>Login</Text> */}
            </TouchableOpacity>

            <Text
              style={styles.registerTextStyle}
              onPress={() => navigation.navigate("signUp")}
            >
              Don't have a Account ?{" "}
              <Text style={{ color: "#4d97f0" }}>Sign Up</Text>
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
    justifyContent: "center",
    backgroundColor: "white",
    alignContent: "center",
  },
  SectionStyle: {
    flexDirection: "row",
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
    borderColor: "#E5E4E2",
    backgroundColor: "#e9ebf2",
  },
  buttonStyle: {
    backgroundColor: "#4d97f0",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#7DE24E",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 0,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: "white",
    paddingVertical: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  inputStyle: {
    flex: 1,
    color: "black",
    marginLeft: 5,
  },
  inputStyle1: {
    // flex: 1,
    width: "20%",
    color: "black",
    marginLeft: 5,
    borderRightWidth: 0.2,
    borderColor: "grey",
  },
  registerTextStyle: {
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
    alignSelf: "center",
    padding: 10,
  },
  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
  },
  socialMediaIcon: {
    height: 35,
    width: 35,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "grey",
    margin: 10,
  },
  socialMediaImg: { height: 20, width: 20, alignSelf: "center", marginTop: 6 },
});
