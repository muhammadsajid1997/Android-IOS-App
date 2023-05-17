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
import { SelectCountry } from "react-native-element-dropdown";
import CustomInput from "../component/Shared/customInput";
import ChatUI from "../component/Shared/chatUI";
import RNFetchBlob from "rn-fetch-blob";
import AudioRecord from "react-native-audio-record";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout, setLogout } from "./Redux/authActions";
import { useDispatch, useSelector } from "react-redux";
import VoiceComponent from "./Record/Voice";
var RNFS = require("react-native-fs");
import Sound, { MAIN_BUNDLE } from "react-native-sound";
import Tts from "react-native-tts";
import { useIsFocused, useNavigationState } from "@react-navigation/native";
Sound.setCategory("Playback");
const dirs = RNFetchBlob.fs.dirs;
import KeepAwake from "react-native-keep-awake";
const options = {
  sampleRate: 16000, // default 44100
  channels: 1, // 1 or 2, default 1
  bitsPerSample: 16, // 8 or 16, default 16
  audioSource: 6, // android only (see below)
  wavFile: "test.wav", // default 'audio.wav'
};

export default function whisper({ navigation }) {
  let [started, setStarted] = useState(false);
  const [isLoggingIn, setisLoggingIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  let [voiceResult, setVoiceResult] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSection, setSection] = useState("Home");
  const [showInput, setShowInput] = useState(false);
  const [typeText, setTypeText] = useState("");
  const [receivedText, setReceivedText] = useState("");
  const { navigate } = useNavigation();
  const dispatch = useDispatch();
  const scrollViewRef = useRef();
  const state = useSelector((state) => state.authReducers);
  const navigationState = useNavigationState((state) => state);
  const currentRoute1 = navigationState.routes[navigationState.index];
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [form, setForm] = useState({ email: null });
  const [errors, setErrors] = useState({});
  const [recognized, setRecognized] = useState("");
  const [volume, setVolume] = useState("");
  const [error, setError] = useState("");
  const [end, setEnd] = useState("");
  const [results, setResults] = useState([]);
  const [partialResults, setPartialResults] = useState([]);
  const [color, setcolors] = useState("grey");
  const navigatation = useNavigation();
  const [timerCount, setTimer] = useState(60);
  const [RecognizeData, setRecognizeData] = useState([]);
  const [timerId, setTimerId] = useState(null);
  const [currentTranscript, setCurrentTranscript] = useState(null);
  const [processedTranscript, setProcessedTranscript] = useState(null);

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

  // useEffect(async () => {
  //   const data = await AsyncStorage.getItem("isFirstTime");
  //   if (data == null) {
  //     _startRecognizing();
  //     const jsonValue = JSON.stringify(true);
  //     await AsyncStorage.setItem("isFirstTime", jsonValue);
  //   }
  // }, []);

  // useEffect(async () => {
  //   const subscription = AppState.addEventListener("change", (nextAppState) => {
  //     if (
  //       appState.current.match(/inactive|background/) &&
  //       nextAppState === "active"
  //     ) {
  //       _startRecognizing();
  //       console.log("App has come to the foreground!");
  //     } else if (
  //       appState.current.match(/inactive|active/) &&
  //       nextAppState === "background"
  //     ) {
  //       _stopRecognizing();
  //     }

  //     appState.current = nextAppState;
  //     setAppStateVisible(appState.current);
  //     // console.log("methodcalled");
  //     // console.log("AppState", appState.current);
  //   });

  //   return () => {
  //     subscription.remove();
  //   };
  // }, []);
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
        // alert("App State: " + "App has come to the foreground!");
      }
      // console.log("App Statedddd: " + nextAppState);
      if (nextAppState == "background") {
        _stopRecognizing();
        setcolors("grey");
        console.log("Timer has hit, restarting speech recognition...");
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
        // if (Platform.OS == "ios") {
        //   return null;
        // } else {
        //   _startRecognizing();
        // }
        DataName = "Active";
        _startRecognizing();
        setAppStateVisible(nextAppState);
      }
    }
    console.log("App State: " + nextAppState);
  };

  const onSpeechResults = (e: any) => {
    console.log("Resultsddssddssdsd", e);
  };

  const onSpeechStart = (e: any) => {
    if (detectHeyAlli == 1) {
      startTimerSec();
    }
    setStarted("√");
  };

  const onSpeechRecognized = (e: SpeechRecognizedEvent) => {
    console.log("onSpeechRecognized: ", e);
    setRecognized("√");
  };

  const onSpeechEnd = (e: any) => {
    console.log("onSpeechEnd: ", e);
    if (Platform.OS === "ios") {
      console.log("current", current);
      // use this.state.results here
    }
    setEnd("√");
  };

  const onSpeechError = (e: SpeechErrorEvent) => {
    console.log("onSpeechError: ", e.error);
    if (e.error.code == 2) {
      setcolors("grey");
    }
  };

  const myArray = [
    "hey ali",
    "hey alli",
    "hi alli",
    "hi ali",
    "ali",
    "alli",
    "yo ali",
    "yo alli",
    "ali help",
    "alli help",
    "help me ali",
    "help me alli",
  ];

  // var prevSpeechResultArray = [];
  const onSpeechPartialResults = async (e: SpeechResultsEvent) => {
    Data = e.value;
    // const myArray = Data[0].split(" ");
    // console.log("sdjhdjjdsjhddsdd", myArray);
    // if (Platform.OS == "ios") {
    // const myArray = Data[0].split(" ");
    // if (prevSpeechResultArray.length > 0) {
    //   if (myArray.length > prevSpeechResultArray.length) {
    //     const tempPrevSpeechResultArray = [];
    //     tempPrevSpeechResultArray.push(
    //       myArray.slice(prevSpeechResultArray.length, myArray.length)
    //     );
    //     console.log("2. new Data :===> ", tempPrevSpeechResultArray);
    //     prevSpeechResultArray.push(myArray);
    //   }
    // } else {
    //   prevSpeechResultArray.push(myArray);
    //   console.log("1. new Data :===> ", prevSpeechResultArray);
    // }
    // await Voice.cancel();
    // this.setState({
    //   end: true,
    // });
    // } else {
    if (detectHeyAlli == 1) {
      if (Data.length > 0 && Data[0].length > 0) {
        if (speechTimeout) {
          clearTimeout(speechTimeout); // Clear the timer
          speechTimeout = null;
        }
        setPartialResults(e.value);
        previous = Data[0];
        console.log("if API Call", previous);
        const timer = setTimeout(() => {
          startApi();
        }, 3000);
        return () => {
          clearTimeout(timer);
        };
      } else {
        console.log("Else API Call");
        startApi();
      }
    } else {
      console.log("3. Detectheyall", detectHeyAlli);
      Data.map((index, i) => {
        myArray.map((index1, i) => {
          // console.log("index", index1);
          if (index.toLocaleLowerCase().includes(index1)) {
            setcolors("red");
            detectHeyAlli = 1;
            previous = "";
            current = "";
          } else {
            setPartialResults([]);
          }
        });
      });
    }
    console.log("Speech started!");
    // }
    // console.log("methodcalled");
  };

  const startApi = () => {
    if (previous.length > 0 && !apiCallRunning) {
      // console.log("API CALLed", previous);
      apiCallRunning = true;
      current = previous;
      setisLoggingIn(true);
      sendAnswer(current);
      previous = "";
      console.log("currentvalue", current);
    }
  };

  // console.log("Partiicaulater", partialResults);

  const _startRecognizing = async () => {
    // console.log("1. Detectheyall", detectHeyAlli);
    try {
      await Voice.start("en-US", {
        EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS: 300000,
        EXTRA_LANGUAGE_MODEL: "LANGUAGE_MODEL_FREE_FORM",
        EXTRA_MAX_RESULTS: 1,
        EXTRA_PARTIAL_RESULTS: true,
      });

      setisLoggingIn(false);
    } catch (e) {
      console.error(e);
    }
  };

  const _stopRecognizing = async () => {
    setcolors("grey");
    console.log("2. Detectheyall", detectHeyAlli);
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setReceivedText("");
    setTypeText("");
    setResults("");
  }, [showInput]);

  const onChange = ({ name, value }) => {
    setForm({ ...form, [name]: value });

    if (value !== "") {
      setErrors((prev) => {
        return { ...prev, [name]: null };
      });
    }
  };

  const sendAnswer = async (text) => {
    console.log("SpeakText", text);
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
      .then(async function (response) {
        if (Platform.OS === "ios") {
          getAnswerVoice(response?.data);
        } else {
          getAnswerVoice(response?.data);
          // await RNFS.unlink(`${RNFS.CachesDirectoryPath}/audio.mp3`);
        }
        // console.log("responseddd", response);

        setIsLoading(true);
      })
      .catch(function (error) {
        console.log("sendAnswer", error);
        setIsLoading(false);
      });
  };

  const getAnswerVoice = async (text) => {
    console.log("texttexttext", text);
    const token = await AsyncStorage.getItem("token");
    setIsLoading(true);
    const timer = text.length * 50 + 20000;
    const url = `https://heyalli.azurewebsites.net/api/convert/tts?text=${text}`;
    axios
      .get(url, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        // console.log("response", response);
        setVoiceResult(response?.data);
        setIsLoading(false);
        setResults(text);
        setReceivedText(text);
        _stopRecognizing();
        const dirs = RNFetchBlob.fs.dirs;
        const filePath = RNFS.CachesDirectoryPath + "/audio.mp3";
        const fileData = response?.data.split(",")[1];
        RNFetchBlob.fs
          .writeFile(filePath, response?.data, "base64")
          .then(() => {
            console.log("File converted successfully");
            PlayAudio(filePath);
            setisLoggingIn(false);
          })
          .catch((error) => {
            setisLoggingIn(false);
            console.log(`Error converting file: ${error}`);
          });
        try {
          // SoundPlayer.playUrl(filePath);

          // loaded successfully
          // console.log(
          //   "duration in seconds: " +
          //     whoosh.getDuration() +
          //     "number of channels: " +
          //     whoosh.getNumberOfChannels()
          // );

          // Play the sound with an onEnd callback
          //   whoosh.play((success) => {
          //     if (success) {
          //       // setPartialResults([]);
          //       apiCallRunning = false;
          //       previous = "";
          //       _startRecognizing();
          //       setcolors("red");
          //       console.log("successfully finished playing");
          //     } else {
          //       console.log("playback failed due to audio decoding errors");
          //     }
          //   });
          // });
          setIsLoading(false);
        } catch (e) {
          // Alert('Cannot play the file');
          console.log("cannot play the song file", e);
        }

        setTimeout(() => {
          setResults("");
        }, timer);
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log("getAnswerVoice", error);
        setIsLoading(false);
      });
  };

  const handleInputField = () => {
    _stopRecognizing();
    // detectHeyAlli = 0;
    // previous = "";
    // current = "";
    navigate("TexttoSpeechScreen");
  };
  // const handleSend = (text) => {
  //   setTypeText(text);
  //   sendAnswer(text);
  // };

  // const onStartRecord = async () => {
  //   setcolors("red");
  //   AudioRecord.init(options);
  //   setStarted(true);
  //   AudioRecord.start();
  //   setTimeout(() => {
  //     onStopRecord();
  //   }, 5000);
  //   // BackgroundTimer.runBackgroundTimer(() => {
  //   //   onStopRecord();
  //   // }, 5000);
  //   return;
  // };

  const PlayAudio = (filePath) => {
    try {
      // SoundPlayer.playUrl(filePath);
      var whoosh = new Sound(
        filePath,
        Platform.OS == "ios" ? "" : MAIN_BUNDLE,
        (error) => {
          if (error) {
            PlayAudio(filePath);
            // console.log("failed to load the sound", error);
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
              whoosh.stop();
              whoosh.release();

              if (DataName == "background") {
                // AudioRecord.stop();
                _stopRecognizing();
              } else {
                apiCallRunning = false;
                previous = "";
                _startRecognizing();
                setcolors("red");
                // onStartRecord();
              }
              console.log("successfully finished playing");
            } else {
              console.log("playback failed due to audio decoding errors");
            }
          });
        }
      );
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      // Alert('Cannot play the file');
      console.log("cannot play the song file", e);
    }
  };

  // const onStopRecord = async () => {
  //   console.log("stop");
  //   setStarted(false);
  //   AudioRecord.stop();
  //   const audioFile = await AudioRecord.stop();
  //   console.log("audioFile", audioFile);
  //   setcolors("grey");
  //   checkspeechData(audioFile);
  // };

  // const RecordStop = async () => {
  //   setStarted(false);
  //   setcolors("grey");
  //   AudioRecord.stop();
  // };

  // const checkspeechData = async (uri) => {
  //   try {
  //     // console.log("API Calle");
  //     setisLoggingIn(true);
  //     const token = await AsyncStorage.getItem("token");
  //     const formData1 = new FormData();
  //     const apiUrl = "https://heyalli.azurewebsites.net/api/convert/stt";
  //     const Data = {
  //       uri: "file:////" + uri,
  //       name: "test.wav",
  //       type: "audio/wav",
  //     };
  //     console.log("Data", JSON.stringify(Data));

  //     formData1.append("audio", Data);

  //     const { data } = await axios.post(apiUrl, formData1, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     // console.log("datataaaatat", data);
  //     // console.log("APPdssdsbhbsddb", uri);
  //     if (data == "") {
  //       setisLoggingIn(false);
  //       _stopRecognizing();
  //       detectHeyAlli = 0;
  //       previous = "";
  //       current = "";
  //       _startRecognizing();
  //     } else {
  //       setisLoggingIn(true);
  //       uploadAudioAsync(uri);
  //     }
  //   } catch (error) {
  //     setisLoggingIn(false);
  //     console.log("API Error", error);
  //   }
  // };

  // const uploadAudioAsync = async (uri) => {
  //   console.log("uploadAudioAsync");
  //   try {
  //     const token = await AsyncStorage.getItem("token");
  //     const formData1 = new FormData();
  //     const apiUrl = "https://heyalli.azurewebsites.net/api/HeyAlli";

  //     const Data = {
  //       uri: "file:////" + uri,
  //       name: "test.wav",
  //       type: "audio/wav",
  //     };
  //     // console.log("Data", JSON.stringify(Data));

  //     formData1.append("speech", Data);

  //     const { data } = await axios.post(apiUrl, formData1, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (data) {
  //       setisLoggingIn(false);
  //       const filePath = RNFS.CachesDirectoryPath + "/audio.mp3";
  //       RNFetchBlob.fs
  //         .writeFile(filePath, data, "base64")
  //         .then(() => {
  //           console.log("File converted successfully");
  //           setisLoggingIn(false);
  //           PlayAudio(filePath);
  //         })
  //         .catch((error) => {
  //           setisLoggingIn(false);
  //           console.log(`Error converting file: ${error}`);
  //         });
  //       // this.setState({isLoggingIn:false})
  //     }
  //   } catch (error) {
  //     setisLoggingIn(false);
  //     Alert.alert("Internal server Error");

  //     // Alert('Cannot play the file');
  //     console.log("API Error", error);
  //   }
  // };

  const ShareApp = async () => {
    detectHeyAlli = 0;
    previous = "";
    current = "";
    _stopRecognizing();
    navigate("ShareScreen");
  };

  return (
    <View style={styles.root}>
      {/* <VoiceComponent /> */}
      <SafeAreaView />
      {!showInput ? (
        <>
          {/* <View
            style={{
              alignSelf: "flex-end",
              margin: 30,
              backgroundColor: "black",
              padding: 1,
            }}
          >
            <Text style={{ color: "white" }}> CC </Text>
          </View> */}
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
                  detectHeyAlli = 0;
                  previous = "";
                  current = "";
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
              {!isLoggingIn ? (
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
        </>
      ) : null}

      {showInput == true ? null : (
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
              // setModalVisible(true);
              // clearTimeout(speechTimeout);
            }}
          >
            <Entypo name="menu" size={28} color={"#000"} />
          </TouchableOpacity>
        </View>
      )}
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
