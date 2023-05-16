import { useNavigation } from "@react-navigation/native";
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
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { secratestore } from "./Redux/authActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Secratekey = () => {
  const [isSecureEntry, setIsSecureEntry] = useState(true);
  const [isSecureEntry1, setIsSecureEntry1] = useState(true);
  const [isSecureEntry2, setIsSecureEntry2] = useState(true);
  const [Changesecrate, SetChangesecrate] = useState(false);
  const [Secratepassword, setSecratepassword] = useState("");
  const [oldSecratepassword, setoldSecratepassword] = useState("");
  const [newSecratepassword, setnewSecratepassword] = useState("");
  const state = useSelector((state) => state.authReducers);

  const dispatch = useDispatch();

  const { navigate } = useNavigation();
  const navigation = useNavigation();

  const SetSecratePasswords = async () => {
    const Token = await AsyncStorage.getItem("token");
    console.log("Token", Token);
    axios
      .post(
        "https://heyalli.azurewebsites.net/api/Identity/login/secretPassword/create",
        {
          secretPassword: Secratepassword,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${Token}`,
          },
        }
      )
      .then(async (data) => {
        if (data.data) {
          Alert.alert("Secret Key", data.data, [
            {
              text: "OK",
              onPress: () => {
                dispatch(secratestore(Secratepassword));
                navigation.goBack();
                setSecratepassword("");
              },
            },
          ]);
        }

        // console.log("TokenStore", data);
        //   if (data) {
        // await AsyncStorage.setItem("Token", data.data.accessToken);
        // navigate("Home");
        // dispatch(loginUser(data.data.accessToken));
        // await AsyncStorage.setItem("name", data.data.accessToken);
        // ProfileStore();
        //   } else {
        //     // console.log("data", data);
        //   }
      })
      .catch((error) => {
        console.log(error.response.data);
        // if (error) {
        //   if (error.response.data == "Invalid or expired OTP") {
        Alert.alert(error.response.data);
        //   } else if (
        //     error.response.data.errors.OTP[0] == "Please enter a valid OTP."
        //   ) {
        //     Alert.alert("Please enter a valid OTP.");
        //   }
        //   // console.log(error);
        // } else {
        //   console.log("error", error);
        // }
      });
  };

  const SetSecratePasswordsUpdate = async (
    oldSecratepassword,
    newSecratepassword
  ) => {
    const Token = await AsyncStorage.getItem("token");
    console.log("Token", Token);
    axios
      .post(
        "https://heyalli.azurewebsites.net/api/Identity/login/secretPassword/update",
        {
          oldSecretPassword: oldSecratepassword,
          newSecretPassword: newSecratepassword,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${Token}`,
          },
        }
      )
      .then(async (data) => {
        if (data) {
          console.log("agabhbdbsdbsdbsdbsdbds", data);
          Alert.alert("Secret Key updated ", data.data, [
            {
              text: "OK",
              onPress: () => {
                dispatch(secratestore(newSecratepassword));
                navigation.goBack();
                // setSecratepassword("");
              },
            },
          ]);
        }
      })
      .catch((error) => {
        console.log(error.response.data);
        // if (error) {
        //   if (error.response.data == "Invalid or expired OTP") {
        Alert.alert(error.response.data);
        //   } else if (
        //     error.response.data.errors.OTP[0] == "Please enter a valid OTP."
        //   ) {
        //     Alert.alert("Please enter a valid OTP.");
        //   }
        //   // console.log(error);
        // } else {
        //   console.log("error", error);
        // }
      });
  };

  const check_Key = () => {
    if (Secratepassword == "" || Secratepassword == null) {
      Alert.alert("Please Enter Secret Key");
    } else if (Secratepassword.length < 6) {
      Alert.alert("Please Min 6 Character Require");
    } else {
      SetSecratePasswords();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {/* <View
        style={{ marginTop: 20, flexDirection: "row", alignItems: "center" }}
      >
        <View style={{ marginLeft: 25 }}>
          <TouchableOpacity
            onPress={() => {
              if (Changesecrate == true) {
                SetChangesecrate(false);
              } else {
                navigation.goBack();
              }
            }}
          >
            <Ionicons
              name="ios-arrow-back-circle-sharp"
              size={30}
              color={"#000"}
            />
          </TouchableOpacity>
        </View>
        <View style={{ width: "80%", alignItems: "center" }}>
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>Secret key</Text>
        </View>
      </View> */}
        <View style={{ marginTop: 10, width: "100%" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ marginLeft: 5 }}>
              <TouchableOpacity
                style={{ padding: 10 }}
                onPress={() => {
                  if (Changesecrate == true) {
                    SetChangesecrate(false);
                  } else {
                    navigation.goBack();
                  }
                }}
              >
                <Ionicons name={"arrow-back"} size={30} />
              </TouchableOpacity>
            </View>
            <View style={{ width: "80%", alignItems: "center" }}>
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: 30,
                  color: "#0f87cf",
                  marginVertical: 10,
                }}
              >
                Secret key{" "}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ alignItems: "center", marginTop: 50 }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
            }}
          >
            {" "}
            Secret Key Setup
          </Text>
        </View>
        {Changesecrate == false ? (
          <View style={{ alignItems: "center" }}>
            <View
              style={{
                width: "90%",
                height: 50,
                // borderWidth: 1,
                marginTop: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "#fff",
                  //   borderBottomWidth: 1,
                  borderColor: "#000",
                  borderRadius: 10,
                  //   paddingBottom: 10,
                }}
              >
                <TextInput
                  style={{
                    flex: 1,

                    padding: 10,
                    borderColor: "#d9d9d9",
                    width: "100%",
                    height: 50,
                    borderRadius: 10,
                    textAlign: "left",
                  }}
                  keyboardType="numeric"
                  maxLength={6}
                  autoCorrect={false}
                  secureTextEntry={isSecureEntry}
                  placeholder="Secret Password"
                  //   value={this.state.password}
                  onChangeText={(password) => setSecratepassword(password)}
                />
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      isSecureEntry
                        ? setIsSecureEntry(false)
                        : setIsSecureEntry(true);
                    }}
                  >
                    {isSecureEntry ? (
                      <Entypo
                        name={"eye-with-line"}
                        size={22}
                        color="#0f87cf"
                      />
                    ) : (
                      <AntDesign name={"eye"} size={22} color="#0f87cf" />
                    )}
                  </TouchableOpacity>
                </View>

                {/* <Icon name="what_ever_icon_you_want" color="#000" size={14} /> */}
              </View>
              {/* <TextInput
            style={{
              backgroundColor: "#fff",
              padding: 10,
              borderColor: "#d9d9d9",
              width: "100%",
              height: 50,
              borderRadius: 10,
              textAlign: "left",
            }}
            placeholder="Secrate Key"
            blurOnSubmit={false}
            returnKeyType="next"
          /> */}
            </View>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                // flex: 1,
                marginTop: 50,
                alignItems: "center",
                backgroundColor: "#14a5f4",
                marginHorizontal: 18,
                borderRadius: 6,
                paddingHorizontal: 40,
              }}
              activeOpacity={0.5}
              onPress={() => {
                check_Key();
              }}
            >
              <Text
                style={{
                  color: "white",
                  paddingVertical: 10,
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                Create
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                color: "black",
                textAlign: "center",
                fontWeight: "bold",

                alignSelf: "center",
                padding: 10,
                marginTop: 10,
                fontSize: 15,
                //   borderBottomWidth: 1,
                borderColor: "#4d97f0",
              }}
              onPress={() => {
                SetChangesecrate(true);
              }}
            >
              Change Secret code?{" "}
              <Text
                style={{
                  color: "#4d97f0",
                  // borderBottomWidth: 1,
                  // borderColor: "#4d97f0",
                  textDecorationLine: "underline",
                  padding: 5,
                  fontSize: 15,
                }}
              >
                Change
              </Text>
            </Text>
            {/* <TouchableOpacity
            style={{
              justifyContent: "center",
              // flex: 1,
              marginTop: 20,
              alignItems: "center",
              backgroundColor: "#14a5f4",
              marginHorizontal: 18,
              borderRadius: 6,
              paddingHorizontal: 40,
            }}
            activeOpacity={0.5}
            onPress={() => {
              SetChangesecrate(true);
            }}
          >
            <Text
              style={{
                color: "white",
                paddingVertical: 10,
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              Change Secrate Code
            </Text>
          </TouchableOpacity> */}
          </View>
        ) : (
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <View
              style={{
                width: "90%",
                height: 50,
                // borderWidth: 1,
                marginTop: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "#fff",
                  //   borderBottomWidth: 1,
                  borderColor: "#000",
                  borderRadius: 10,
                  //   paddingBottom: 10,
                }}
              >
                <TextInput
                  style={{
                    flex: 1,
                    padding: 10,
                    borderColor: "#d9d9d9",
                    width: "100%",
                    height: 50,
                    borderRadius: 10,
                    textAlign: "left",
                  }}
                  keyboardType="numeric"
                  maxLength={6}
                  autoCorrect={false}
                  secureTextEntry={isSecureEntry1}
                  placeholder="Old Secret Password"
                  onChangeText={(password) => setoldSecratepassword(password)}
                  //   value={this.state.password}
                  // onChangeText={this.onPasswordEntry}
                />

                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      isSecureEntry1
                        ? setIsSecureEntry1(false)
                        : setIsSecureEntry1(true);
                    }}
                  >
                    {isSecureEntry1 ? (
                      <Entypo
                        name={"eye-with-line"}
                        size={22}
                        color="#0f87cf"
                      />
                    ) : (
                      <AntDesign name={"eye"} size={22} color="#0f87cf" />
                    )}
                  </TouchableOpacity>
                </View>

                {/* <Icon name="what_ever_icon_you_want" color="#000" size={14} /> */}
              </View>

              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "#fff",
                  //   borderBottomWidth: 1,
                  borderColor: "#000",
                  borderRadius: 10,
                  marginTop: 20,
                  //   paddingBottom: 10,
                }}
              >
                <TextInput
                  style={{
                    flex: 1,

                    padding: 10,
                    borderColor: "#d9d9d9",
                    width: "100%",
                    height: 50,
                    borderRadius: 10,
                    textAlign: "left",
                  }}
                  keyboardType="numeric"
                  maxLength={6}
                  autoCorrect={false}
                  secureTextEntry={isSecureEntry2}
                  placeholder="New Secret Password"
                  onChangeText={(password) => setnewSecratepassword(password)}
                  //   value={this.state.password}
                  //   onChangeText={this.onPasswordEntry}
                />

                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      isSecureEntry2
                        ? setIsSecureEntry2(false)
                        : setIsSecureEntry2(true);
                    }}
                  >
                    {isSecureEntry2 ? (
                      <Entypo
                        name={"eye-with-line"}
                        size={22}
                        color="#0f87cf"
                      />
                    ) : (
                      <AntDesign name={"eye"} size={22} color="#0f87cf" />
                    )}
                  </TouchableOpacity>
                </View>

                {/* <Icon name="what_ever_icon_you_want" color="#000" size={14} /> */}
              </View>
              {/* <TextInput
            style={{
              backgroundColor: "#fff",
              padding: 10,
              borderColor: "#d9d9d9",
              width: "100%",
              height: 50,
              borderRadius: 10,
              textAlign: "left",
            }}
            placeholder="Secrate Key"
            blurOnSubmit={false}
            returnKeyType="next"
          /> */}
            </View>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                // flex: 1,
                marginTop: 50,
                alignItems: "center",
                backgroundColor: "#14a5f4",
                marginHorizontal: 18,
                borderRadius: 6,
                paddingHorizontal: 40,
              }}
              activeOpacity={0.5}
              onPress={() => {
                if (oldSecratepassword == "") {
                  Alert.alert("Please Enter Old Secret Key");
                } else if (newSecratepassword == "") {
                  Alert.alert("Please Enter New Secret Key");
                } else {
                  SetSecratePasswordsUpdate(
                    oldSecratepassword,
                    newSecratepassword
                  );

                  // Alert.alert("Please Enter Valid Old Secret Key");
                }
                // Alert.alert("Please Enter   ")
              }}
            >
              <Text
                style={{
                  color: "white",
                  paddingVertical: 10,
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                Update
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Secratekey;
