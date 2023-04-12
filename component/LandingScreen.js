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

const options = {
  sampleRate: 16000, // default 44100
  channels: 1, // 1 or 2, default 1
  bitsPerSample: 16, // 8 or 16, default 16
  audioSource: 6, // android only (see below)
  wavFile: "test.wav", // default 'audio.wav'
};

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
  ];

  var enterMobilesNo = false;
  var enterCallmsg = false;
  var timer = true;

  const onStopAudio = async () => {
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
            // console.log("Name", Data);
            // console.log("Mobileno", MO);
            // navigation.navigate("Home");
            index++;
          } else {
            SpeakAudio(
              data,
              false,
              "please tell your cell phone number Again "
            );
            index = 3;
          }
          break;
        default:
          // console.log("test...", "default case...");
          break;
        // code block
      }

      // console.log("datadatadata", data);
      // if (data.toLowerCase() == "yes.") {
      //   enterMobilesNo = true;
      //   SpeakAudio(data, false, String[2]);
      // } else {
      //   if (!enterMobilesNo) {
      //     SpeakAudio(data, false, String[1]);
      //   } else {
      //     // if (!enterMobilesNo) {
      //     SpeakAudio(data, false, String[3]);
      //     // }
      //     //
      //   }
      // }
    }
  };

  const RegisterData = async (name, mobile) => {
    const form = new FormData();
    form.append("FullName", "abddddd");
    form.append("PhoneNumber", "52414524");

    const { response } = await axios.post(
      "https://heyalli.azurewebsites.net/api/Identity/register",
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    // console.log("response", response);
  };

  const SpeakAudio = async (msg, record, nextMessage, timer) => {
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
              Settext("Speek mode");
              if (timer) {
                setTimeout(() => onStopAudio(), 9000);
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
