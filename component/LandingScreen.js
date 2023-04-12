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
var RNFS = require("react-native-fs");
var Sound = require("react-native-sound");
Sound.setCategory("Playback");
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
  var index = 0;
  const String = [
    "Hello there! I am ALLI. My name stands for Artificial Language and Logic Interface. What is your name, please?",
    "Please confirm should I call you as recording? yes or no",
    "what is your cell phone number",
    "Please confirm your cell phone number? yes or no",
  ];

  var enterMobilesNo = false;
  var enterCallmsg = false;

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
      switch (index) {
        case 1:
          console.log("case1");
          SpeakAudio(data, false, String[index]);
          index++;
          break;
        case 2:
          SpeakAudio(data, false, String[index]);
          index++;
          break;
        case 3:
          SpeakAudio(data, false, String[index]);
          index++;
          break;
        case 4:
          if (data.toLowerCase() == "yes.") {
            navigation.navigate("Home");
            index++;
          }
          break;
        default:
          console.log("test...", "default case...");
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

  const SpeakAudio = async (msg, record, nextMessage) => {
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
      console.log(response.data);
      const dirs = RNFetchBlob.fs.dirs;
      const filePath = RNFS.DownloadDirectoryPath + "/audio.mp3";
      const fileData = response.data.split(",")[1];

      RNFetchBlob.fs
        .writeFile(filePath, response.data, "base64")
        .then(() => {
          console.log("File converted successfully");
        })
        .catch((error) => {
          console.log(`Error converting file: ${error}`);
        });
      // this.setState({isLoggingIn:false})

      try {
        // SoundPlayer.playUrl(filePath);
        var whoosh = new Sound(filePath, Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            console.log("failed to load the sound", error);
            return;
          }
          // loaded successfully
          console.log(
            "duration in seconds: " +
              whoosh.getDuration() +
              "number of channels: " +
              whoosh.getNumberOfChannels()
          );

          // Play the sound with an onEnd callback
          whoosh.play((success) => {
            if (success) {
              console.log("record ", record);
              if (record) {
                AudioRecord.init(options);
                AudioRecord.start();
                setTimeout(() => onStopAudio(), 4000);
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
                index++;
                // navigation.navigate("otp")
              }}
            >
              {/* <Image style={{ borderRadius: 10, marginVertical: 10 }} source={signInButton}>
              </Image> */}

              <Text style={styles.buttonTextStyle}>Start</Text>
            </TouchableOpacity>

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
