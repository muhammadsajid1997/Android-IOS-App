import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  SafeAreaView,
  View,
  StyleSheet,
} from "react-native";
import ChatUI from "../component/Shared/chatUI";
import CustomInput from "../component/Shared/customInput";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNFetchBlob from "rn-fetch-blob";
import Sound from "react-native-sound";
import axios from "axios";
var RNFS = require("react-native-fs");
import Ionicons from "react-native-vector-icons/Ionicons";
const TexttoSpeechComponent = () => {
  const [isLoggingIn, setisLoggingIn] = useState(false);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [typeText, setTypeText] = useState("");
  const [receivedText, setReceivedText] = useState("");
  const [results, setResults] = useState([]);
  const [voiceResult, setVoiceResult] = useState("");
  const handleSend = (text) => {
    setTypeText(text);
    sendAnswer(text);
  };

  const sendAnswer = async (text) => {
    const token = await AsyncStorage.getItem("token");
    console.log("sendAnswer", token);
    setIsLoading(true);
    const url = `https://heyalli.azurewebsites.net/api/HeyAlli/brain?text=${text}`;
    axios
      .get(url, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        // console.log("responseddd", response);
        getAnswerVoice(response?.data);
        setIsLoading(true);
      })
      .catch(function (error) {
        console.log("sendAnswer", error);
        setIsLoading(false);
      });
  };

  const getAnswerVoice = async (text) => {
    console.log("TTS: Started: ", new Date().toLocaleTimeString());
    text = "hi"
    text = "playback failed due to audio decoding errors playback failed due to audio decoding errors playback failed due to audio decoding errors playback failed due to audio decoding errors playback failed due to audio decoding errors playback failed due to audio decoding errors playback failed due to audio decoding errors playback failed due to audio decoding errors playback failed due to audio decoding errorsplayback failed due to audio decoding errors playback failed due to audio decoding errors playback failed due to audio decoding errors playback failed due to audio decoding errors"
    setIsLoading(true);
    const baseUrl = "https://api.elevenlabs.io/v1/text-to-speech";
    const voiceId = "21m00Tcm4TlvDq8ikWAM";
    const headers = {
      "Content-Type": "application/json",
      "xi-api-key": "",
    };
    const requestBody = {
      text,
      voice_settings: {
        stability: 0,
        similarity_boost: 0
      },
    };
    console.log("TTS: calling api");
    const response = await axios.post(`${baseUrl}/${voiceId}`, requestBody, {
      headers,
      responseType: "arraybuffer",
    });
    const filePath = RNFS.CachesDirectoryPath + "/audio.mp3";
    console.log("TTS: response.status: ", response.status);
    if (response.status === 200) {
      const fileData = response.request._response;
      RNFetchBlob.fs
        .writeFile(filePath, fileData, "base64")
        .then(() => {
          console.log("File converted successfully ok ok");
          setisLoggingIn(false);
        })
        .catch((error) => {
          setisLoggingIn(false);
          console.log(`Error converting file: ${error}`);
        });

    } else {
      console.error("Error fetching audio:", error);
      setError("Error: Unable to stream audio.");
    }
    try {
      var whoosh = new Sound(filePath, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log("failed to load the sound", error);
          return;
        }
        whoosh.play((success) => {
          if (success) {
            console.log("successfully finished playing");
          } else {
            console.log("playback failed due to audio decoding errors");
          }
        });
      });
      setIsLoading(false);
    } catch (e) {
      console.log("cannot play the song file", e);
    }
    console.log("TTS: Ended: ", new Date().toLocaleTimeString());
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginTop: 10, width: "100%" }}>
        <SafeAreaView />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ marginLeft: 5 }}>
            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name={"arrow-back"} size={25} />
            </TouchableOpacity>
          </View>
          <View style={{ width: "80%", alignItems: "center" }}>
            <Text
              style={{
                ...styles.title,
                fontWeight: "700",
                fontSize: 35,
                color: "#0f87cf",
                marginVertical: 10,
              }}
            >
              Hey Alli{" "}
            </Text>
          </View>
        </View>
        <CustomInput onSend={handleSend} isLoading={isLoading} />
      </View>
      <View style={{ marginTop: 10, width: "100%" }}>
        <ChatUI TypeText={typeText} ReceivedText={receivedText} />
      </View>
    </View>
  );
};

export default TexttoSpeechComponent;

const styles = StyleSheet.create({
  root: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    textAlign: "center",
    flexDirection: "column",
  },
  title: {
    marginTop: 0,
    fontWeight: "400",
    fontSize: 30,
    alignSelf: "center",
    justifyContent: "center",
  },
  settingsSection: {
    flex: 1,
  },
  buttonsSection: {
    flex: 1,
    flexDirection: "row",
  },
  transcription: {
    flex: 1,
    flexDirection: "row",
  },
  recordIllustration: {
    width: 100,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 50,
  },
  fill: {
    flex: 1,
    margin: 16,
  },
  // button: {
  //   margin: 5,
  // },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: '#fff',
  },
  button: {
    width: 200,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  circleButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollViewText: {
    marginBottom: 15,
    // borderWidth: 1,
    // borderStyle: 'solid',
    // borderColor: 'gray',
    paddingHorizontal: 10,
    overflow: "scroll",
    flex: 1,
  },
  bottomBar: {
    justifyContent: "space-between",
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    // marginTop: 22,
    backgroundColor: "#fff",
    // backgroundColor: '#f1f1f1',
  },
  modalView: {
    flex: 1,
    // borderWidth: 1,
    width: "100%",
    // height: 800,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  container: {
    padding: 5,
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    // borderWidth:1,
    // borderRadius: 20,
    // paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    // borderWidth: 1,
    borderColor: "#d9d9d9",
    color: "black",

    // width: 20,
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    textAlign: "left",
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,

    // elevation: 5,
  },
  sendButton: {
    position: "absolute",
    right: 17,
  },
  sendButtonText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
});
