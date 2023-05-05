import React, { useState, createRef, useEffect } from "react";
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
  SafeAreaView,
  Alert,
} from "react-native";
import axios from "axios";
import logoBack from "./Images/logoback.png";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { loginUser, setLogin } from "./Redux/authActions";
import moment from "moment";
const OtpScreen = ({ navigation }) => {
  const [verifyOtp, setVerifyOtp] = useState("");
  const passwordInputRef = createRef();
  const route = useRoute();

  const navigate = useNavigation();
  const dispatch = useDispatch();

  let timer = () => {};
  const [timeLeft, setTimeLeft] = useState(30);

  // console.log("navigation", route.params.phoneNumber);

  // const userOtp = () => {
  //   // console.log(verifyOtp);
  //   // axios.
  // };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timer);
  }, [timer]);
  const startTimer = () => {
    timer = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(timer);

        return false;
      }
      setTimeLeft(timeLeft - 1);
    }, 1000);
  };

  const start = () => {
    ResendOTP();
    setTimeLeft(30);
    clearInterval(timer);
    startTimer();
  };

  const ResendOTP = () => {
    if (route.params.type == "Login") {
      console.log("Login");
      axios
        .post(
          "https://heyalli.azurewebsites.net/api/Identity/login",
          {
            PhoneNumber: route.params.phoneNumber,
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
          // navigation.navigate("Home", { screen: "home" });
        })
        .catch((error) => {
          Alert.alert(error.response.data);
          console.log("axios error:", error.response.data);
        });
    } else if (route.params.type == "Register") {
      console.log("Register");
      axios
        .post(
          "https://heyalli.azurewebsites.net/api/Identity/register",
          {
            FullName: route.params.name,
            PhoneNumber: route.params.phoneNumber,
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
        })
        .catch((error) => {
          console.log(route.params.name);
          console.log("axios error:", error.response.data);
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
    } else {
      return null;
    }
  };

  const userOtp = async () => {
    if (verifyOtp == "") {
      Alert.alert("Please Enter OTP");
    } else if (verifyOtp.length == 6) {
      axios
        .post(
          "https://heyalli.azurewebsites.net/api/Identity/token",
          {
            PhoneNumber: route.params.phoneNumber,
            OTP: verifyOtp,
          },
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then(async (data) => {
          // console.log("TokenStore", data);
          if (data) {
            // console.log("data", data.data.accessToken);

            // await AsyncStorage.setItem("Token", data.data.accessToken);
            // navigate("Home");

            dispatch(setLogin(data.data.accessToken, route.params.phoneNumber));
            // ProfileStore();
          } else {
            // console.log("data", data);
          }
        })
        .catch((error) => {
          console.log(error.response.data);
          if (error) {
            if (error.response.data == "Invalid or expired OTP") {
              Alert.alert("Invalid or expired OTP");
            } else if (
              error.response.data.errors.OTP[0] == "Please enter a valid OTP."
            ) {
              Alert.alert("Please enter a valid OTP.");
            }
            // console.log(error);
          } else {
            console.log("error", error);
          }
          // SpeakAudio(error.request._response, false, null);

          // Alert.alert(error.request._response);
        });
    } else {
      Alert.alert("Please Enter 6 Digit OTP");
    }
    // navigate("Home");
    // navigation.navigate("HomeScreen");
    // const mobile = await AsyncStorage.getItem("mobileno");
    // const mobileDAta = mobile.replace(/[\(\)\-\\\/\.\s]+/g, "");
    // const Otp = otp.replace(/[\(\)\-\\.\s]+/g, "");

    // console.log("mobile", mobileDAta);
    // console.log("Otp", Otp);
  };

  // const ProfileStore = async () => {
  //   console.log("caleldd");
  //   const UsersData = await AsyncStorage.getItem("Token");
  //   console.log("ALLData", UsersData);
  //   const abc = JSON.stringify(UsersData);
  //   console.log("dsdsdsd", abc);
  //   axios
  //     .post(
  //       "https://heyalli.azurewebsites.net/api/Profile",
  //       {
  //         FullName: route.params.name,
  //         PhoneNumber: `+91${route.params.phoneNumber}`,
  //       },
  //       {
  //         headers: {
  //           Accept: "application/json",
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${UsersData}`,
  //         },
  //       }
  //     )
  //     .then((data) => {
  //       console.log("ProfileStore", data.data);

  //       // SpeakAudio(
  //       //   data.data,
  //       //   false,
  //       //   "App will try to detect OTP on its own if not, please speak OTP"
  //       // );
  //       // index++;
  //     })
  //     .catch((error) => {
  //       console.log("axios error:", error.request._response);
  //       // SpeakAudio(error.request._response, false, null);
  //       // Alert.alert(error.request._response.errors.PhoneNumber[0]);
  //     });
  // };

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
              <Image
                style={{
                  width: "100%",
                }}
                source={logoBack}
              />
            </View>

            <View
              style={{
                marginHorizontal: 30,
                flexDirection: "row",
                marginVertical: 10,
                flexWrap: "wrap",
              }}
            >
              <Text
                style={{
                  color: "#00000080",
                  fontSize: 16,
                }}
              >
                Please enter the 6 digit verification code sent to{"  "}
                <Text
                  style={{
                    color: "#000000aa",
                    fontWeight: "bold",
                  }}
                >
                  {route.params.phoneNumber}
                </Text>
              </Text>
            </View>
            <View style={{ ...styles.SectionStyle }}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(verifyOtp) => setVerifyOtp(verifyOtp)}
                placeholder="Enter your OTP" //mailto:dummy@abc.com
                placeholderTextColor="#9ea3b7"
                autoCapitalize="none"
                keyboardType="numeric"
                maxLength={6}
                returnKeyType="next"
                onSubmitEditing={() =>
                  passwordInputRef.current && passwordInputRef.current.focus()
                }
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            </View>

            {timeLeft == 0 ? (
              <View
                style={{
                  marginTop: 5,
                  alignItems: "flex-end",
                  marginRight: 20,
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.9}
                  hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                  onPress={() => start()}
                >
                  <Text
                    style={[
                      {
                        color: "#14a5f4",
                        fontSize: 16,
                        marginBottom: 0,
                        borderBottomWidth: 1,
                        borderColor: "#14a5f4",
                      },
                    ]}
                  >
                    {" "}
                    Resend OTP
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{
                  marginTop: 5,
                  alignItems: "flex-end",
                  marginRight: 20,
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 16, color: "#14a5f4" }}>
                  Resend OTP in {moment.utc(timeLeft * 1000).format("mm:ss")}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={{
                justifyContent: "center",
                flex: 1,
                alignItems: "center",
                backgroundColor: "#14a5f4",
                marginHorizontal: 18,
                borderRadius: 12,
                marginTop: 18,
              }}
              activeOpacity={0.5}
              onPress={() => {
                // props.navigation.navigate("home")
                // navigation.navigate("Home", { screen: "home" });
                userOtp();
              }}
            >
              <Text style={styles.buttonTextStyle}>Verify otp</Text>
            </TouchableOpacity>
            {/* <Text
              style={styles.registerTextStyle}
              onPress={() => navigation.navigate('signUp')}>
              Don't have a Account ? <Text style={{ color: '#4d97f0' }}>Sign Up</Text>
            </Text> */}
          </KeyboardAvoidingView>
        </View>
        <View
          style={{
            justifyContent: "center",
            marginHorizontal: 30,
            marginTop: 30,
            flexDirection: "row",
            marginBottom: 15,
          }}
        >
          <Text style={{ color: "#00000090" }}>
            Do you want to change the number?{" "}
          </Text>
          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center" }}
            onPress={() => {
              navigate.goBack();
            }}
          >
            <Text style={{ color: "#ff0000cc" }}>Edit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
export default OtpScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
    alignContent: "center",
  },
  SectionStyle: {
    flexDirection: "row",
    height: 45,
    marginHorizontal: "5%",
    marginVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 0.2,
    borderRadius: 6,
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
    marginHorizontal: 35,
    marginTop: 0,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: "white",
    paddingVertical: 12,
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
