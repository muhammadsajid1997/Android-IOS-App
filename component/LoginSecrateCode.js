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
  SafeAreaView,
  Alert,
} from "react-native";
import axios from "axios";
import logoBack from "./Images/logoback.png";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "./Redux/authActions";
const LoginSecrateCode = ({ navigation }) => {
  const [veriysecrate, setveriysecrate] = useState("");
  const passwordInputRef = createRef();
  const route = useRoute();

  const { navigate } = useNavigation();
  const dispatch = useDispatch();

  const state = useSelector((state) => state.authReducers);
  console.log(state);
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
                alignItems: "center",
                // borderWidth: 1,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#00000080",
                  fontSize: 16,
                  textAlign: "center",
                }}
              >
                Please enter your Secrate Code
                <Text
                  style={{
                    color: "#000000aa",
                    fontWeight: "bold",
                  }}
                >
                  {/* {route.params.phoneNumber} */}
                </Text>
              </Text>
            </View>
            <View style={{ ...styles.SectionStyle }}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(verifyOtp) => setveriysecrate(verifyOtp)}
                placeholder="Enter your secrate code" //mailto:dummy@abc.com
                placeholderTextColor="#9ea3b7"
                autoCapitalize="none"
                keyboardType="numeric"
                // maxLength={6}
                returnKeyType="next"
                onSubmitEditing={() =>
                  passwordInputRef.current && passwordInputRef.current.focus()
                }
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            </View>

            <TouchableOpacity
              style={{
                justifyContent: "center",
                flex: 1,
                alignItems: "center",
                backgroundColor: "#14a5f4",
                marginHorizontal: 18,
                borderRadius: 12,
                marginTop: 10,
              }}
              activeOpacity={0.5}
              onPress={() => {
                if (veriysecrate == "") {
                  Alert.alert("Please Enter Secrate Key");
                  //   navigate("homepage");
                } else if (state.skey == veriysecrate) {
                  navigate("homepage");
                } else {
                  Alert.alert("Inavalid Secrate Key");
                }

                //
                // props.navigation.navigate("home")
                // navigation.navigate("Home", { screen: "home" });
                // userOtp();
              }}
            >
              <Text style={styles.buttonTextStyle}>Verify Secrate Code</Text>
            </TouchableOpacity>

            {/* <Text
              style={styles.registerTextStyle}
              onPress={() => navigation.navigate('signUp')}>
              Don't have a Account ? <Text style={{ color: '#4d97f0' }}>Sign Up</Text>
            </Text> */}
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
};
export default LoginSecrateCode;

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
