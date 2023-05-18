// import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  Button,
  View,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ScrollView,
  PermissionsAndroid,
  Platform,
  Modal,
  Alert,
  TextInput,
  SafeAreaView,
  AppState,
  BackHandler,
  Share,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
} from "@react-native-voice/voice";
import axios from "axios";
import RNFetchBlob from "rn-fetch-blob";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import Entypo from "react-native-vector-icons/Entypo";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Sound, { MAIN_BUNDLE } from "react-native-sound";
import Tts from "react-native-tts";
import { useIsFocused, useNavigationState } from "@react-navigation/native";
Sound.setCategory("Playback");
const dirs = RNFetchBlob.fs.dirs;
import KeepAwake from "react-native-keep-awake";
export default function whisper({ navigation }) {
  const [started, setStarted] = useState(false);
  const [loading, setisloading] = useState(false);
  const { navigate } = useNavigation();
  const navigationState = useNavigationState((state) => state);
  const currentRoute1 = navigationState.routes[navigationState.index];
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [recognized, setRecognized] = useState("");
  const [end, setEnd] = useState("");
  const [color, setcolors] = useState("grey");
  const navigatation = useNavigation();

  var DataName = "Active";
  var Data = "";
  var detectHeyAlli = 0;
  var current = "";
  var previous = "";
  var apiCallRunning = false;
  var speechTimeout = null;

  useEffect(async () => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechResults = onSpeechResults;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  React.useEffect(() => {
    KeepAwake.activate();
    const unsubscribe = navigatation.addListener("focus", () => {
      detectHeyAlli = false;
      previous = "";
      current = "";
      _startRecognizing();
    });
    return unsubscribe;
  }, []);

  const startTimerSec = () => {
    if (speechTimeout != null) {
      clearTimeout(speechTimeout);
    }
    speechTimeout = setTimeout(() => {
      setcolors("grey");
      // console.log("Timer has hit, restarting speech recognition...");
      detectHeyAlli = 0;
      previous = "";
      current = "";
    }, 10000);
  };

  useEffect(() => {
    if (currentRoute1.name == "home") {
      const subscription = AppState.addEventListener(
        "change",
        handleAppStateChange
      );
      return () => {
        subscription.remove();
      };
    }
  }, [currentRoute1]);

  const handleAppStateChange = (nextAppState) => {
    if (appState != nextAppState) {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App State: " + "App has come to the foreground!");
      }
      if (nextAppState == "background") {
        console.log("App Statedddd: " + nextAppState);
        _stopRecognizing();
        setcolors("grey");
        detectHeyAlli = 0;
        previous = "";
        current = "";
        setAppStateVisible(nextAppState);
        DataName = "background";
      } else if (nextAppState == "inactive") {
        detectHeyAlli = 0;
        previous = "";
        current = "";
        DataName = "inactive";
        return null;
      } else {
        detectHeyAlli = 0;
        previous = "";
        current = "";
        DataName = "Active";
        _startRecognizing();
        setAppStateVisible(nextAppState);
      }
    }
    console.log("App State: " + nextAppState);
  };

  const onSpeechResults = (e: any) => {};

  const onSpeechStart = (e: any) => {
    if (detectHeyAlli == 1) {
      startTimerSec();
    }
    setStarted("√");
  };

  const onSpeechRecognized = (e: SpeechRecognizedEvent) => {
    setRecognized("√");
  };

  const onSpeechEnd = (e: any) => {
    setEnd("√");
  };

  const onSpeechError = (e: SpeechErrorEvent) => {
    if (e.error.code == 2) {
      setcolors("grey");
    }
  };

  var myArray = [
    "hey ali",
    " hey ali",
    "hey alli",
    " hey alli",
    "hi alli",
    " hi alli",
    "hi ali",
    " hi ali",
    "ali",
    " ali",
    "alli",
    " alli",
    "yo ali",
    " yo ali",
    "yo alli",
    " yo alli",
    "ali help",
    " ali help",
    "alli help",
    " alli help",
    "help me ali",
    " help me ali",
    "help me alli",
    " help me alli",
  ];

  const onSpeechPartialResults = async (e: SpeechResultsEvent) => {
    Data = e.value;
    console.log("3. Detectheyall", Data);
    if (detectHeyAlli == 1) {
      if (Data.length > 0 && Data[0].length > 0) {
        if (speechTimeout) {
          clearTimeout(speechTimeout); // Clear the timer
          speechTimeout = null;
        }
        previous = Data[0];
        // console.log("if API Call", previous);
        const timer = setTimeout(() => {
          startApi();
        }, 2000);
        return () => {
          clearTimeout(timer);
        };
      }
    } else {
      if (Data.length) {
        const lowerCaseData = Data[0].toLocaleLowerCase(); // Convert 'data' to lowercase
        if (
          myArray.some(
            (element) => element.toLocaleLowerCase() === lowerCaseData
          )
        ) {
          setcolors("red");
          detectHeyAlli = 1;
          previous = "";
          current = "";
        }
      }
    }
    //   Data.map((index, i) => {
    //     myArray.map((index1, i) => {
    //       if (index.toLocaleLowerCase().includes(index1)) {
    //         setcolors("red");
    //         detectHeyAlli = 1;
    //         previous = "";
    //         current = "";
    //       }
    //     });
    //   });
    // }
    // console.log("Speech started!");
    // }
    // console.log("methodcalled");
  };

  const startApi = () => {
    if (previous.length > 0 && !apiCallRunning) {
      // console.log("API CALLed", previous);
      apiCallRunning = true;
      current = previous;
      sendAnswer(current);
      previous = "";
      console.log("currentvalue", current);
    }
  };

  const _startRecognizing = async () => {
    // console.log("1. Detectheyall", detectHeyAlli);
    try {
      await Voice.start("en-US", {
        EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS: 300000,
        EXTRA_LANGUAGE_MODEL: "LANGUAGE_MODEL_FREE_FORM",
        EXTRA_MAX_RESULTS: 1,
        EXTRA_PARTIAL_RESULTS: true,
      });
      setisloading(false);
    } catch (e) {
      // console.error(e);
    }
  };

  const _stopRecognizing = async () => {
    setcolors("grey");
    // console.log("2. Detectheyall", detectHeyAlli);
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  const sendAnswer = async (text) => {
    console.log("SpeakText", text);
    const startTime = performance.now();
    setisloading(true);
    const token = await AsyncStorage.getItem("token");
    const url = `https://heyalli.azurewebsites.net/api/HeyAlli/brain?text=${text}`;
    axios
      .get(url, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(async function (response) {
        const endTime = performance.now();
        const elapsedTime = endTime - startTime;
        console.log(`API call took ${elapsedTime} milliseconds.`);
        if (response) {
          setisloading(false);
          Tts.speak(response.data);
          _stopRecognizing();
          Tts.addEventListener("tts-finish", (event) => {
            console.log("finish", event);
            if (DataName == "background") {
              _stopRecognizing();
            } else {
              apiCallRunning = false;
              previous = "";
              _startRecognizing();
              setcolors("red");
            }
          });
        }
      })
      .catch(function (error) {
        // console.log("sendAnswer", error);
        setisloading(false);
      });
  };
  const handleInputField = () => {
    _stopRecognizing();
    navigate("TexttoSpeechScreen");
  };

  const ShareApp = async () => {
    _stopRecognizing();
    navigate("ShareScreen");
  };

  return (
    <View style={styles.root}>
      <SafeAreaView />
      <View
        style={{
          justifyContent: "space-between",
          paddingHorizontal: 20,
          alignItems: "center",
          paddingVertical: 10,
          flexDirection: "row",
          width: "100%",
        }}
      >
        <TouchableOpacity
          style={{ padding: 10 }}
          onPress={() => {
            ShareApp();
          }}
        >
          <Image
            source={require("../assets/share.png")}
            style={{
              height: 30,
              width: 30,
            }}
          />
        </TouchableOpacity>
        <View
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity style={{ padding: 10 }}>
            <FontAwesome name={"closed-captioning"} size={23} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ padding: 10, marginLeft: 10 }}
            onPress={() => {
              _stopRecognizing();
              navigate("ReferralData");
            }}
          >
            <FontAwesome name={"people-arrows"} size={22} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flex: 1, marginHorizontal: 20, alignItems: "center" }}>
        <View>
          {
            <>
              <Text style={styles.title}>Start Speaking </Text>
              <Text style={styles.title}> To Activate Alli </Text>
            </>
          }
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          {!loading ? (
            <View>
              <TouchableOpacity
                style={{
                  backgroundColor: color,
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  justifyContent: "center",
                  alignItems: "center",
                  alignItems: "center",
                }}
                // onPress={_startRecognizing}
                // onPress={!started ? onStartRecord : onStopRecord}
              >
                <FontAwesome name="microphone" size={32} color={"#fff"} />
              </TouchableOpacity>
              {/* <Text>{}</Text> */}
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.circleButton, { backgroundColor: "grey" }]}
              disabled
            >
              <ActivityIndicator size={32} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {/* {partialResults.length == 0 ? (
            <View>
              <Text style={{ fontSize: 15, color: "grey" }}></Text>
            </View>
          ) : (
            partialResults.map((index, i) => {
              return (
                <View style={{}}>
                  <Text style={{ fontSize: 15, color: "grey" }}>"{index}"</Text>
                </View>
              );
            })
          )} */}

      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={handleInputField}>
          <Image
            source={require("./Images/go-back-arrow.png")}
            style={{ height: 20, width: 20 }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigate("MenuScreen");
            _stopRecognizing();
          }}
        >
          <Entypo name="menu" size={28} color={"#000"} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
