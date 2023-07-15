import axios from "axios";
import React, { useState, createRef } from "react";
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
  Alert,
  SafeAreaView,
} from "react-native";

// import AsyncStorage from '@react-native-community/async-storage';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// import Loader from './Loader';
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
import ContryPicker, { DARK_THEME } from "react-native-country-picker-modal";
const SignUpScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(false);
  const [errortext, setErrortext] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const passwordInputRef = createRef();
  const [countryCode, setCountryCode] = useState("US");
  const [callingCodes, setcallingCode] = useState("1");
  // const SingupUser = () => {
  //   if (!firstName) {
  //     Alert.alert("Please enter your FullName");
  //     return;
  //   }
  //   if (!phoneNumber) {
  //     Alert.alert("Please enter your Number");
  //     return;
  //   }
  //   const formData = new FormData();
  //   formData.append("FullName", firstName);
  //   formData.append("PhoneNumber", phoneNumber);
  //   fetch("https://heyalli.azurewebsites.net/api/Identity/register", {
  //     method: "POST",
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "multipart/form-data",
  //     },
  //     body: formData,
  //   })
  //     .then((res) => res.json())
  //     .then((json) => {
  //       console.log("check json", json);
  //       Alert.alert(json);
  //       navigation.navigate("otp");
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };
  const onChangeCallingcode = (value) => {
    setcallingCode(value);
  };

  const SingupUser = () => {
    console.log(callingCodes);
    console.log(phoneNumber);
    // var regEx = "/^[A-Za-z]+$/";
    // if (firstName == "" && phoneNumber == "") {
    //   Alert.alert("Please Enter Field");
    // } else if (firstName.match(regEx)) {
    //   Alert.alert("Please enter a valid first name.");
    // } else {
    axios
      .post(
        "https://heyalli.azurewebsites.net/api/Identity/register",
        {
          FullName: firstName,
          PhoneNumber: `+${callingCodes}${phoneNumber}`,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        console.log("response get details:" + response.data);
        if (response.data) {
          navigation.navigate("otp", {
            phoneNumber: `+${callingCodes}${phoneNumber}`,
            name: firstName,
            type: "Register",
          });
        }
      })
      .catch((error) => {
        // console.log("axios error:", error.response.data);
        if (
          error.response.data == "User with this phone number already exists"
        ) {
          Alert.alert("User with this phone number already exists");
        } else if (error.message == "Network Error") {
          Alert.alert("Network Error");
          // return null;
        } else if (error.response.data.errors) {
          Alert.alert(error.response.data.errors.FullName[0]);
        }
        //     Alert.alert(
        //       error.response.data
        //         ? error.response.data
        //         : error.response.data.title
        //     );
      });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <SafeAreaView />
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
              <TextInput
                style={styles.inputStyle}
                onChangeText={(firstName) => setFirstName(firstName)}
                placeholder="Enter First Name"
                placeholderTextColor="#9ea3b7"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() =>
                  passwordInputRef.current && passwordInputRef.current.focus()
                }
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            </View>
            {/* <View style={styles.SectionStyle}>
             
            <TextInput
                style={styles.inputStyle}
                onChangeText={(lastName) =>
                    setLastName(lastName)
                }
                placeholder="Enter First Name" 
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
              
            
            </View> */}
            <View style={styles.SectionStyle}>
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
              <TextInput
                style={styles.inputStyle}
                onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
                placeholder="Enter phone number" //12345
                placeholderTextColor="#9ea3b7"
                keyboardType="phone-pad"
                ref={passwordInputRef}
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
                secureTextEntry={!showPassword}
                underlineColorAndroid="#f000"
                returnKeyType="next"
              />
            </View>

            <TouchableOpacity
              style={{
                justifyContent: "center",
                flex: 1,
                alignItems: "center",
                backgroundColor: "#14a5f4",
                marginHorizontal: 18,
                borderRadius: 6,
              }}
              activeOpacity={0.5}
              onPress={() => {
                const nameRegex = new RegExp(/^[a-z ,.'-]+(\s)([a-z ,.'-])+$/i);
                if (firstName == "") {
                  Alert.alert("Please enter firstname");
                } else if (phoneNumber == "") {
                  Alert.alert("Please enter phoneNumber ");
                } else {
                  SingupUser();
                  // Alert.alert("Please Enter Valid Old Secret Key");
                }
                // navigation.navigate("whisper")
              }}
            >
              {/* <Image style={{ borderRadius: 10, marginVertical: 10 }} source={signInButton}>
              </Image> */}

              <Text style={styles.buttonTextStyle}>Sign Up</Text>
            </TouchableOpacity>

            <Text
              style={styles.registerTextStyle}
              onPress={() => navigation.navigate("Auth")}
            >
              Don't have a Account ?{" "}
              <Text style={{ color: "#4d97f0" }}>Log In </Text>
            </Text>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
};
export default SignUpScreen;

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
