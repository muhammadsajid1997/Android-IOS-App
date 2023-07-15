import React, { useState, createRef, useRef, useEffect } from "react";
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
  AppState,
  PermissionsAndroid,
  Platform,
  Alert,
  EventEmitter,
} from "react-native";
import logoBack from "./Images/logoback.png";
import Tts from "react-native-tts";
import AudioRecord from "react-native-audio-record";
import axios from "axios";
import RNFetchBlob from "rn-fetch-blob";
import AsyncStorage from "@react-native-async-storage/async-storage";
var RNFS = require("react-native-fs");
var Sound = require("react-native-sound");
const dirs = RNFetchBlob.fs.dirs;

import { Buffer } from "buffer";

const options = {
  sampleRate: 16000, // default 44100
  channels: 1, // 1 or 2, default 1
  bitsPerSample: 16, // 8 or 16, default 16
  audioSource: 6, // android only (see below)
  wavFile: "test.wav", // default 'audio.wav'
};
import BackgroundTimer from "react-native-background-timer";
const LandingScreen = ({ navigation }) => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [name, setname] = useState("");
  const [text, Settext] = useState();
  var index = 0;
  const String = [
    "Hello there! I am ALLI. My name stands for Artificial Language and Logic Interface. What is your name, please?",
    `Please confirm should I call you as {name}Say yes tot confirm else Say no`,
    "please Say your cell phone number ",
    "Please confirm your cell phone number is {} . Say yes if correct  else Say no",
    "App will try to detect OTP on its own if not, please speak OTP",
  ];

  var enterMobilesNo = false;
  var enterCallmsg = false;
  var timer = true;
  var otptimer = false;

  // const PlayAudio = () => {
  //   var whoosh = new Sound(filePath, Sound.MAIN_BUNDLE, (error) => {
  //     if (error) {
  //       console.log("failed to load the sound", error);
  //       return;
  //     }
  //     whoosh.play((success) => {
  //       if (success) {
  //         whoosh.stop();
  //         whoosh.release();
  //       } else {
  //         console.log("playback failed due to audio decoding errors");
  //       }
  //     });
  //     // playSound(filePath, record, nextMessage, timer);
  //   }).catch((error) => {
  //     console.log(`Error converting file: ${error}`);
  //   });
  // };

  // useEffect(() => {
  //   const subscription = AppState.addEventListener("change", (nextAppState) => {
  //     if (
  //       appState.current.match(/inactive|background/) &&
  //       nextAppState === "active"
  //     ) {
  //       console.log("App has come to the foreground!");
  //     } else if (
  //       appState.current.match(/inactive|active/) &&
  //       nextAppState === "background"
  //     ) {
  //       console.log("app in bbb", nextAppState);
  //     }

  //   appState.current = nextAppState;
  //   setAppStateVisible(appState.current);
  //   console.log("AppState", appState.current);

  //   if (appState.current == "background") {
  //     AudioRecord.init(options);
  //     AudioRecord.start();
  //     AudioRecord.on("data", (data) => {
  //       // console.log("daatatata", data);
  //       chunk = Buffer.from(data, "base64");
  //       chunk.toString("base64");
  //       console.log(chunk);
  //       // console.log("chunk", chunk);
  //       const dirs = RNFetchBlob.fs.dirs;
  //       const filePath = RNFS.DownloadDirectoryPath + "/audio.mp3";
  //       RNFetchBlob.fs
  //         .writeFile(filePath, chunk.toString("utf8"), "base64")
  //         .then(() => {
  //           console.log("File converted successfully");
  //           PlayAudio(filePath);
  //           // base64-encoded audio data chunks
  //         });
  //       //   /
  //     });
  //   }
  //   });

  //   // setTimeout(() => onStopAudio(), 4000);
  //   return () => {
  //     subscription.remove();
  //   };
  // }, []);

  const onStopAudio = async () => {
    console.log("4 scound ");
    AudioRecord.stop();
    const audioFile = await AudioRecord.stop();
    SpeechtoTextData(audioFile);
  };

  const SpeechtoTextData = async (uri) => {
    const formData1 = new FormData();
    const apiUrl = "https://heyalli.azurewebsites.net/api/convert/stt";
    const Data = {
      uri: "file:////" + uri,
      name: "test.wav",
      type: "audio/wav",
    };
    // console.log("Data", JSON.stringify(Data))

    formData1.append("audio", Data);

    const { data } = await axios.post(apiUrl, formData1, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (data) {
      var name;
      Settext("Listening mode");
      switch (index) {
        case 1:
          SpeakAudio(
            data,
            false,
            `Please confirm should I call you as ${data}Say yes tot confirm else Say no`
          );
          index++;
          await AsyncStorage.setItem("name", data);
          break;

        case 2:
          if (data.toLowerCase() == "yes.") {
            SpeakAudio(data, false, String[index], timer);
            index++;
          } else {
            SpeakAudio(
              data,
              false,
              "please tell me what should i call you again. Only speak the word that you want me to call you"
            );
            index = 1;
          }
          break;
        case 3:
          SpeakAudio(
            data,
            false,
            `Please confirm your cell phone number is ${data} . Say yes if correct  else Say no`
          );
          index++;

          await AsyncStorage.setItem("mobileno", data);
          break;
        case 4:
          if (data.toLowerCase() == "yes.") {
            const Name = await AsyncStorage.getItem("name");
            const MO = await AsyncStorage.getItem("mobileno");
            RegisterData(Name, MO);
          } else {
            SpeakAudio(
              data,
              false,
              "please tell your cell phone number Again "
            );
            index = 3;
          }
          break;
        case 5:
          SpeakAudio(data, false, null, otptimer);
          TokenStore(data);
          // case 5:
          //   const Name = await AsyncStorage.getItem("name");
          //   const MO = await AsyncStorage.getItem("mobileno");
          //   RegisterData(Name, MO, data, data);
          break;
        default:
          // console.log("test...", "default case...");
          break;
      }
    }
  };

  const RegisterData = async (name, mobile) => {
    const mobileDAta = mobile.replace(/[\(\)\-\\.\s]+/g, "");
    const username = name.replace(/[\(\)\-\\.\s]+/g, "");
    console.log("mobileDAta", mobileDAta);
    console.log("username", username);
    axios
      .post(
        "https://heyalli.azurewebsites.net/api/Identity/register",
        {
          FullName: username,
          PhoneNumber: `+91 ${mobileDAta}`,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((data) => {
        console.log(data.data);

        SpeakAudio(
          data.data,
          false,
          "App will try to detect OTP on its own if not, please speak OTP"
        );
        index++;
      })
      .catch((error) => {
        // console.log("axios error:", error.request._response);
        SpeakAudio(
          error.request._response
            ? error.request._response
            : error.request._response.errors.FullName[0]
            ? error.request._response.errors.FullName[0]
            : error.request._response.errors.PhoneNumber[0],
          false,
          null
        );

        // Alert.alert(error.request._response.errors.PhoneNumber[0]);
      });
  };

  const TokenStore = async (otp) => {
    const mobile = await AsyncStorage.getItem("mobileno");
    const mobileDAta = mobile.replace(/[\(\)\-\\\/\.\s]+/g, "");
    const Otp = otp.replace(/[\(\)\-\\.\s]+/g, "");

    console.log("mobile", mobileDAta);
    console.log("Otp", Otp);

    axios
      .post(
        "https://heyalli.azurewebsites.net/api/Identity/token",
        {
          PhoneNumber: `+91${mobileDAta}`,
          OTP: Otp,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(async (data) => {
        console.log("TokenStore", data);
        if (data) {
          await AsyncStorage.setItem("usersData", data.data);
          navigation.navigate("Home");
          ProfileStore();
        }
      })
      .catch((error) => {
        SpeakAudio(error.request._response, false, null);
        console.log("axios error123:", error.request._response);
        // Alert.alert(error.request._response);
      });
  };

  const ProfileStore = async () => {
    const Name = await AsyncStorage.getItem("name");
    const MO = await AsyncStorage.getItem("mobileno");
    const UsersData = await AsyncStorage.getItem("usersData");
    const username = Name.replace(/[\(\)\-\\.\s]+/g, "");
    const mobileDAta = MO.replace(/[\(\)\-\\.\s]+/g, "");

    console.log("username", username);
    console.log("mobileDAta", mobileDAta);
    console.log("ALLData", UsersData);
    axios
      .post(
        "https://heyalli.azurewebsites.net/api/Profile",
        {
          FullName: username,
          PhoneNumber: `+91${mobileDAta}`,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: UsersData.accessToken,
          },
        }
      )
      .then((data) => {
        console.log("ProfileStore", data.data);
        // SpeakAudio(
        //   data.data,
        //   false,
        //   "App will try to detect OTP on its own if not, please speak OTP"
        // );
        // index++;
      })
      .catch((error) => {
        console.log("axios error:", error.request._response);
        // SpeakAudio(error.request._response, false, null);
        // Alert.alert(error.request._response.errors.PhoneNumber[0]);
      });
  };

  const SpeakAudio = async (msg, record, nextMessage, timer) => {
    console.log("timer", timer);
    const response = await axios.get(
      "https://heyalli.azurewebsites.net/api/convert/tts",
      {
        params: {
          text: msg,
        },
        headers: {
          accept: "*/*",
        },
      }
    );
    if (response) {
      // console.log(response.data);
      const dirs = RNFetchBlob.fs.dirs;
      const filePath = RNFS.DownloadDirectoryPath + "/audio.mp3";
      const fileData = response.data.split(",")[1];
      Settext("Listening mode");
      RNFetchBlob.fs
        .writeFile(filePath, response.data, "base64")
        .then(() => {
          console.log("File converted successfully");
          playSound(filePath, record, nextMessage, timer);
        })
        .catch((error) => {
          console.log(`Error converting file: ${error}`);
        });
      // this.setState({isLoggingIn:false})
    }
  };

  const playSound = (filePath, record, nextMessage, timer) => {
    console.log("timer", timer);
    try {
      // SoundPlayer.playUrl(filePath);
      Sound.setCategory("Playback");
      var whoosh = new Sound(filePath, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log("failed to load the sound", error);
          playSound(filePath, record, nextMessage, timer);
          return;
        }

        whoosh.play((success) => {
          if (success) {
            console.log("record ", record);
            whoosh.stop();
            whoosh.release();
            if (record) {
              AudioRecord.init(options);
              AudioRecord.start();
              Settext("Speech mode");
              if (timer) {
                setTimeout(() => onStopAudio(), 10000);
              } else if (timer == false) {
                setTimeout(() => onStopAudio(), 60000);
              } else {
                setTimeout(() => onStopAudio(), 4000);
              }

              console.log("successfully finished playing");
            } else {
              SpeakAudio(nextMessage, true, null);
            }
          } else {
            console.log("playback failed due to audio decoding errors");
          }
        });
      });
    } catch (e) {
      // Alert('Cannot play the file');
      console.log("cannot play the song file", e);
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
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

            {/* {errortext != '' ? ( <Text style={styles.errorTextStyle}>  {errortext}</Text> ) : null} */}

            <TouchableOpacity
              style={{
                justifyContent: "center",
                flex: 1,
                alignItems: "center",
                backgroundColor: "#14a5f4",
                marginHorizontal: 20,
                borderRadius: 6,
                marginTop: 20,
              }}
              activeOpacity={0.5}
              onPress={() => {
                SpeakAudio(String[0], true, null);
                index = 1;
                // navigation.navigate("otp")
              }}
            >
              {/* <Image style={{ borderRadius: 10, marginVertical: 10 }} source={signInButton}>
              </Image> */}

              <Text style={styles.buttonTextStyle}>Start</Text>
            </TouchableOpacity>

            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: 200,
              }}
            >
              <Text>{text}</Text>
            </View>

            {/* <Text
              style={styles.registerTextStyle}
              onPress={() => navigation.navigate("signUp")}
            >
              Don't have a Account ?{" "}
              <Text style={{ color: "#4d97f0" }}>Sign Up</Text>
            </Text> */}
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
};
export default LandingScreen;

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
