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
// import { Audio } from "expo-av";
// import Logo from './Images/homeLogo.jpg'
// import { FontAwesome } from "@expo/vector-icons";
// import TextEffect from "./Shared/typeEffect"
import { SelectCountry } from "react-native-element-dropdown";

import CustomInput from "../component/Shared/customInput";
import ChatUI from "../component/Shared/chatUI";
import RNFetchBlob from "rn-fetch-blob";
import { Buffer } from "buffer";

// import { AntDesign } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { signOutFunc,auth } from "../firebaseConfig";
import AudioRecord from "react-native-audio-record";
// import SoundPlayer from "react-native-sound-player";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout, setLogout } from "./Redux/authActions";
import { useDispatch, useSelector } from "react-redux";
import VoiceComponent from "./Record/Voice";
import BackgroundTimer from "react-native-background-timer";
import Tts from "react-native-tts";
var RNFS = require("react-native-fs");
var Sound = require("react-native-sound");

// var { TextDecoder } = require("util");
// import { TextDecoder } from "util";
import base64js from "base64-js";
Sound.setCategory("Playback");
const dirs = RNFetchBlob.fs.dirs;

const options = {
  sampleRate: 16000, // default 44100
  channels: 1, // 1 or 2, default 1
  bitsPerSample: 16, // 8 or 16, default 16
  audioSource: 6, // android only (see below)
  wavFile: "test.wav", // default 'audio.wav'
};

const local_data = [
  {
    value: "1",
    lable: "male",
  },
  {
    value: "2",
    lable: "female",
  },
];

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

  const [isListening, setIsListening] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState("active");
  const [manageState, SetmanageState] = useState(false);
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
  const route = useRoute();
  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    // Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    // Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigatation.addListener("focus", () => {
      _startRecognizing();
    });

    return unsubscribe;
  }, []);

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

  // useEffect(() => {
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
  //       console.log("app in bbb");
  //       // onStartRecord();
  //     }
  //     console.log("AppState1", appState.current);

  //     // appState.current = nextAppState;

  //     setAppStateVisible(appState.current);
  //     console.log("AppState2", route);
  //   });

  //   return () => {
  //     subscription.remove();
  //   };
  // }, [appStateVisible]);

  const onSpeechStart = (e: any) => {
    console.log("onSpeechStart: ", e);
    setStarted("√");
  };

  const onSpeechRecognized = (e: SpeechRecognizedEvent) => {
    console.log("onSpeechRecognized: ", e);
    setRecognized("√");
  };

  const onSpeechEnd = (e: any) => {
    console.log("onSpeechEnd: ", e);
    setEnd("√");
  };

  const onSpeechError = (e: SpeechErrorEvent) => {
    console.log("onSpeechError: ", e);
    setError(JSON.stringify(e.error));
  };

  // const onSpeechResults = (e: SpeechResultsEvent) => {
  // var Data = e.value;
  // console.log("Data", Data);
  // Data.length == 0
  //   ? []
  //   : Data.map((index, i) => {
  //       if (index.toLocaleLowerCase().includes("hey ali")) {
  //         Tts.speak("Welcome");
  //         onStartRecord();
  //       } else {
  //         _startRecognizing();
  //       }
  //       // console.log("index", index);
  //       // console.log("i", i);
  //       // console.log("onSpeechResults: ", Data);
  //     });
  // setResults(Data);
  // };

  const onSpeechPartialResults = (e: SpeechResultsEvent) => {
    var Data = e.value;
    console.log("Data", Data);
    Data.map((index, i) => {
      if (index.toLocaleLowerCase().includes("hey ali")) {
        // Tts.speak("Welcome");

        _stopRecognizing();
        onStartRecord();
      } else {
        // console.log("else part");
        // _startRecognizing();
      }
      // console.log("index", index);
      // console.log("i", i);
      // console.log("onSpeechResults: ", Data);
    });
    // console.log("onSpeechPartialResults: ", e);
    // setPartialResults(e.value);
  };

  // const onSpeechVolumeChanged = (e: any) => {
  //   console.log("onSpeechVolumeChanged: ", e);
  //   setVolume(e.value);
  // };

  const _startRecognizing = async () => {
    // console.log("appStateVisible", strappState);
    // if (strappState == "active") {
    try {
      await Voice.start("en-US", {
        EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS: 300000,
      });
      console.log("Recording start");
      setisLoggingIn(false);
    } catch (e) {
      console.error(e);
    }
    // }
  };

  const _stopRecognizing = async () => {
    console.log("Recording stop");
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  const _cancelRecognizing = async () => {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  };

  // const _destroyRecognizer = async () => {
  //   try {
  //     await Voice.destroy();
  //   } catch (e) {
  //     console.error(e);
  //   }
  //   _clearState();
  // };

  const _clearState = () => {
    setRecognized("");
    setVolume("");
    setError("");
    setEnd("");
    setStarted("");
    setResults([]);
    setPartialResults([]);
  };

  useEffect(() => {
    // AudioRecord.init(options);
    setReceivedText("");
    setTypeText("");
    setResults("");
    // setVoiceResult('')
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
        getAnswerVoice(response?.data);
        setIsLoading(true);
      })
      .catch(function (error) {
        console.log("sendAnswer", error);
        setIsLoading(false);
      });
  };

  const getAnswerVoice = async (text) => {
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
        console.log("response", response);
        setVoiceResult(response?.data);

        setResults(text);
        setReceivedText(text);
        const dirs = RNFetchBlob.fs.dirs;
        const filePath = RNFS.CachesDirectoryPath + "/audio.mp3";
        const fileData = response?.data.split(",")[1];

        RNFetchBlob.fs
          .writeFile(filePath, response?.data, "base64")
          .then(() => {
            console.log("File converted successfully");
            setisLoggingIn(false);
          })
          .catch((error) => {
            setisLoggingIn(false);
            console.log(`Error converting file: ${error}`);
          });
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
                console.log("successfully finished playing");
              } else {
                console.log("playback failed due to audio decoding errors");
              }
            });
          });
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
    setShowInput(!showInput);
  };
  const handleSend = (text) => {
    setTypeText(text);
    sendAnswer(text);
  };

  const onStartRecord = async () => {
    setcolors("red");
    AudioRecord.init(options);
    setStarted(true);
    AudioRecord.start();

    BackgroundTimer.runBackgroundTimer(() => {
      onStopRecord();
    }, 5000);
    return;
  };

  const PlayAudio = (filePath) => {
    try {
      // SoundPlayer.playUrl(filePath);
      var whoosh = new Sound(filePath, Sound.MAIN_BUNDLE, (error) => {
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
            onStartRecord();
            console.log("successfully finished playing");
          } else {
            console.log("playback failed due to audio decoding errors");
          }
        });
      });
      setIsLoading(false);
    } catch (e) {
      // Alert('Cannot play the file');
      console.log("cannot play the song file", e);
    }
  };

  const onStopRecord = async () => {
    // console.log("RecordStop");

    // console.log("hshahgsasgash");
    setStarted(false);
    AudioRecord.stop();
    const audioFile = await AudioRecord.stop();

    // console.log("_startRecognizing();", audioFile);
    BackgroundTimer.stopBackgroundTimer();
    setcolors("grey");
    checkspeechData(audioFile);
  };

  const checkspeechData = async (uri) => {
    try {
      setisLoggingIn(true);
      const token = await AsyncStorage.getItem("token");
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
          Authorization: `Bearer ${token}`,
        },
      });

      if (data == "") {
        setisLoggingIn(false);
        _startRecognizing();
      } else {
        setisLoggingIn(true);
        uploadAudioAsync(uri);
      }
    } catch (error) {
      setisLoggingIn(false);
      Alert.alert("Internal server Error");

      // Alert('Cannot play the file');
      console.log("API Error", error);
    }
  };

  const uploadAudioAsync = async (uri) => {
    try {
      const token = await AsyncStorage.getItem("token");
      // setisLoggingIn(true);
      // const UsersData = await AsyncStorage.getItem("Token");
      console.log();
      const formData1 = new FormData();

      const apiUrl = "https://heyalli.azurewebsites.net/api/HeyAlli";

      const Data = {
        uri: "file:////" + uri,
        name: "test.wav",
        type: "audio/wav",
      };
      // console.log("Data", JSON.stringify(Data));

      formData1.append("speech", Data);

      const { data } = await axios.post(apiUrl, formData1, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (data) {
        setisLoggingIn(false);
        const filePath = RNFS.CachesDirectoryPath + "/audio.mp3";
        RNFetchBlob.fs
          .writeFile(filePath, data, "base64")
          .then(() => {
            console.log("File converted successfully");
            setisLoggingIn(false);
            PlayAudio(filePath);
          })
          .catch((error) => {
            setisLoggingIn(false);
            console.log(`Error converting file: ${error}`);
          });
        // this.setState({isLoggingIn:false})
      }
    } catch (error) {
      setisLoggingIn(false);
      Alert.alert("Internal server Error");

      // Alert('Cannot play the file');
      console.log("API Error", error);
    }
  };

  const Submitdata = async (data) => {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.put(
      "https://heyalli.azurewebsites.net/api/Profile",

      // '{\n  "firstName": "Parth",\n  "lastName": "soni",\n  "phone": "+919512058950",\n  "email": "Parth@gmail.com",\n  "age": 20,\n  "gender": "male",\n  "weight": "50",\n  "height": "20",\n  "address": "there",\n  "city": "New York",\n  "state": "New York",\n  "zipCode": "10001",\n  "questionsAsked": 0\n}\n',
      data,
      {
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data) {
      getProfile();
      Alert.alert(response.data);
    }
    // console.log("response", response);
  };

  const getProfile = async () => {
    const token = await AsyncStorage.getItem("token");

    const response = await axios.get(
      "https://heyalli.azurewebsites.net/api/Profile",
      {
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data) {
      // _toggleListening();

      // abc();
      setForm({
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email,
        phone: response.data.phone,
        age: response.data.age.toString(),
        gender: response.data.gender,
        address: response.data.address,
        city: response.data.city,
        state: response.data.state,
        zipCode: response.data.zipCode,
        weight: response.data.weight,
        height: response.data.height,
      });
    }
  };

  const onSubmit = () => {
    // console.log(form);

    if (!/^[a-zA-Z]+(\s{1}[a-zA-Z]+)*$/.test(form.lastName)) {
      Alert.alert("Please enter valid lastName");
    } else if (!/^[a-zA-Z]+(\s{1}[a-zA-Z]+)*$/.test(form.city)) {
      Alert.alert("Please  enter valid city");
    } else if (!/^[a-zA-Z]+(\s{1}[a-zA-Z]+)*$/.test(form.state)) {
      Alert.alert("Please  enter valid state");
    } else {
      Submitdata(form);
    }
    // if (!/^[a-zA-Z]+(\s{1}[a-zA-Z]+)*$/.test(form.firstName)) {
    //   Alert.alert("ivalid Name");
    // } else {
    //   Alert.alert("Acceptable valid Name");
    // }
    // var regName = `/^[a-zA-Z]+ [a-zA-Z]+$/`;
    // var name = form.firstName;
    // if (!regName.test(name)) {
    //   Alert.alert("Please enter your full name (first & last name).");
    //   // document.getElementById("name").focus();
    //   return false;
    // } else {
    //   Alert.alert("Valid name given.");
    //   return true;
    // }
    // if (form.firstName.match(alphaExp)) {
    //   Alert.alert("Please enter string");
    // }
    // Submitdata(form);
    // if (!form.firstName) {
    //   setErrors((prev) => {
    //     return { ...prev, firstName: "Please enter a first name" };
    //   });
    // console.log("form", form);
    // }
  };
  const logoutCall = async () => {
    dispatch(setLogout());
  };

  const ShareApp = async () => {
    _stopRecognizing();
    navigate("ShareScreen");
    // const number = await AsyncStorage.getItem("number");
    // console.log(number);
    // const refcode = number;
    // const palylink =
    //   "https://play.google.com/store/apps/details?id=com.heyalli";

    // try {
    //   await Share.share(
    //     {
    //       message: `hello this is link to joint to hey alli app ${palylink}&ReferralCode=${refcode}`,
    //     },
    //     { dialogTitle: "Share BAM goodness" }
    //   );
    // } catch (error) {
    //   console.log(error, "--share link error--");
    // }
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
              <Entypo name={"share"} size={21} color={"#000000cc"} />
            </TouchableOpacity>
            <View
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <TouchableOpacity style={{ padding: 10 }}>
                <FontAwesome name={"closed-captioning"} size={22} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ padding: 10, marginLeft: 10 }}
                onPress={() => {
                  navigate("ReferralData");
                }}
              >
                <FontAwesome name={"people-arrows"} size={19} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ flex: 1, marginHorizontal: 20, alignItems: "center" }}>
            <View>
              {!results ? (
                <>
                  <Text style={styles.title}>Start Speaking </Text>
                  <Text style={styles.title}> To Activate Alli </Text>
                </>
              ) : null}
            </View>
          </View>

          <View style={styles.settingsSection}>
            {/* <Image style={{ borderRadius: 80 }} source={Logo} /> */}
          </View>
          <View>
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
        </>
      ) : null}

      <View style={{ flex: 1 }}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showInput}
          onRequestClose={() => {
            // Alert.alert("Modal has been closed.");
            // AudioRecord.stop();
            setShowInput(!showInput);
          }}
        >
          <View style={{ flex: 1 }}>
            <View style={{ marginTop: 10, width: "100%" }}>
              <SafeAreaView />
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

              <CustomInput onSend={handleSend} isLoading={isLoading} />
            </View>
            <View style={{ marginTop: 10, width: "100%" }}>
              <ChatUI TypeText={typeText} ReceivedText={receivedText} />
            </View>
          </View>
        </Modal>
      </View>

      {showInput == true ? null : (
        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={handleInputField}>
            <Image
              source={require("./Images/go-back-arrow.png")}
              style={{ height: 20, width: 20 }}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Entypo name="menu" size={28} color={"#000"} />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.centeredView}>
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            // Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={{ flex: 1 }}>
            <SafeAreaView />
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View style={{ marginTop: 10, width: "100%" }}>
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
                    {/* <CustomInput onSend={handleSend} isLoading={isLoading} /> */}
                  </View>

                  <View style={{ padding: 10 }}>
                    <View style={styles.container}>
                      <View
                        style={{ width: "90%", paddingVertical: 10 }}
                        onPress={() => {
                          setModalVisible(false), setSection("Profile");
                        }}
                      >
                        <Text style={{ fontSize: 15, fontWeight: "500" }}>
                          Profile
                        </Text>
                      </View>
                      <View style={styles.inputContainer}>
                        <TextInput
                          style={styles.input}
                          placeholder="First name"
                          onChangeText={(value) => {
                            var value = value == "" ? null : value;
                            onChange({ name: "firstName", value });
                          }}
                          // blurOnSubmit={true}
                          value={form.firstName || null}
                          editable={false}
                          // value={text}
                          // onChangeText={setText}
                          // onSubmitEditing={handleSend}

                          returnKeyType="next"
                        />
                        {/* {errors.firstName && (
                          <Text style={{ paddingHorizontal: 21 }}>
                            {errors.firstName}
                          </Text>
                        )} */}
                        <TextInput
                          style={[styles.input, { marginLeft: 10 }]}
                          placeholder="Last name"
                          onChangeText={(value) => {
                            var value = value == "" ? null : value;
                            onChange({ name: "lastName", value });
                          }}
                          value={form.lastName || null}
                          // value={text}
                          // onChangeText={setText}
                          // onSubmitEditing={handleSend}
                          blurOnSubmit={false}
                          returnKeyType="next"
                        />
                      </View>
                    </View>
                    {/* <View style={styles.container}>
                      <View style={styles.inputContainer}>
                        <TextInput
                          style={styles.input}
                          placeholder="Email"
                          onChangeText={(value) => {
                            var value = value == "" ? null : value;
                            onChange({ name: "email", value });
                          }}
                          value={form.email || null}
                          // value={text}
                          // onChangeText={setText}
                          // onSubmitEditing={handleSend}
                          blurOnSubmit={false}
                          returnKeyType="next"
                        />
                      </View>
                    </View> */}
                    <View style={styles.container}>
                      <View style={styles.inputContainer}>
                        <TextInput
                          style={styles.input}
                          placeholder="Mobile No"
                          onChangeText={(value) => {
                            var value = value == "" ? null : value;
                            onChange({ name: "phone", value });
                          }}
                          value={form.phone || null}
                          keyboardType="phone-pad"
                          // value={text}
                          // onChangeText={setText}
                          // onSubmitEditing={handleSend}
                          blurOnSubmit={false}
                          returnKeyType="next"
                        />
                      </View>
                    </View>
                    <View style={styles.container}>
                      <View style={styles.inputContainer}>
                        <TextInput
                          style={styles.input}
                          placeholder="Age"
                          onChangeText={(value) => {
                            var value = value == "" ? null : parseInt(value);
                            onChange({ name: "age", value });
                          }}
                          value={form.age || null}
                          keyboardType="number-pad"
                          // value={text}
                          // onChangeText={setText}
                          // onSubmitEditing={handleSend}
                          blurOnSubmit={false}
                          returnKeyType="next"
                        />

                        <SelectCountry
                          style={[styles.input, { marginLeft: 10 }]}
                          selectedTextStyle={{ fontSize: 14, marginLeft: 8 }}
                          placeholderStyle={{ fontSize: 14 }}
                          maxHeight={200}
                          value={form.gender}
                          data={local_data}
                          valueField="value"
                          labelField="lable"
                          imageField="null"
                          placeholder="Select gender"
                          onChange={(e) => {
                            // setCountry(e.value);
                            var value = e.value == "" ? null : e.value;
                            onChange({ name: "gender", value });
                          }}
                        />
                        {/* <TextInput
                          style={[styles.input, { marginLeft: 10 }]}
                          placeholder="Gender"
                          onChangeText={(value) => {
                            var value = value == "" ? null : value;
                            onChange({ name: "gender", value });
                          }}
                          value={form.gender || null}
                          // value={text}
                          // onChangeText={setText}
                          // onSubmitEditing={handleSend}
                          blurOnSubmit={false}
                          returnKeyType="next"
                        /> */}
                      </View>
                    </View>
                    <View style={styles.container}>
                      <View style={styles.inputContainer}>
                        <TextInput
                          style={{
                            flex: 1,
                            backgroundColor: "#fff",
                            padding: 10,
                            // borderWidth: 1,
                            borderColor: "#d9d9d9",

                            // width: 20,
                            height: 80,
                            borderWidth: 1,
                            borderRadius: 10,
                            textAlign: "left",
                          }}
                          multiline={true}
                          placeholder="Address"
                          onChangeText={(value) => {
                            var value = value == "" ? null : value;
                            onChange({ name: "address", value });
                          }}
                          value={form.address || null}
                          // value={text}
                          // onChangeText={setText}
                          // onSubmitEditing={handleSend}
                          blurOnSubmit={false}
                          returnKeyType="next"
                        />
                      </View>
                    </View>

                    <View style={styles.container}>
                      <View style={styles.inputContainer}>
                        <TextInput
                          style={styles.input}
                          placeholder="City"
                          onChangeText={(value) => {
                            var value = value == "" ? null : value;
                            onChange({ name: "city", value });
                          }}
                          value={form.city || null}
                          // value={text}
                          // onChangeText={setText}
                          // onSubmitEditing={handleSend}
                          blurOnSubmit={false}
                          returnKeyType="next"
                        />
                        <TextInput
                          style={[styles.input, { marginLeft: 10 }]}
                          placeholder="State"
                          onChangeText={(value) => {
                            var value = value == "" ? null : value;
                            onChange({ name: "state", value });
                          }}
                          value={form.state || null}
                          // value={text}
                          // onChangeText={setText}
                          // onSubmitEditing={handleSend}
                          blurOnSubmit={false}
                          returnKeyType="next"
                        />
                      </View>
                    </View>
                    <View style={styles.container}>
                      <View style={styles.inputContainer}>
                        <TextInput
                          style={{
                            flex: 1,
                            backgroundColor: "#fff",
                            padding: 10,
                            // borderWidth: 1,
                            borderColor: "#d9d9d9",

                            // width: 20,
                            height: 40,
                            borderWidth: 1,
                            borderRadius: 10,
                            textAlign: "left",
                          }}
                          placeholder="Zip"
                          onChangeText={(value) => {
                            var value = value == "" ? null : value;
                            onChange({ name: "zipCode", value });
                          }}
                          value={form.zipCode || null}
                          keyboardType="number-pad"
                          // value={text}
                          // onChangeText={setText}
                          // onSubmitEditing={handleSend}
                          blurOnSubmit={false}
                          returnKeyType="next"
                        />
                      </View>
                    </View>
                    <View style={styles.container}>
                      <View style={styles.inputContainer}>
                        <TextInput
                          style={styles.input}
                          placeholder="Weight"
                          onChangeText={(value) => {
                            var value = value == "" ? null : value;
                            onChange({ name: "weight", value });
                          }}
                          value={form.weight || null}
                          keyboardType="number-pad"
                          // value={text}
                          // onChangeText={setText}
                          // onSubmitEditing={handleSend}
                          blurOnSubmit={false}
                          returnKeyType="next"
                        />
                        <TextInput
                          style={[styles.input, { marginLeft: 10 }]}
                          placeholder="Height"
                          onChangeText={(value) => {
                            var value = value == "" ? null : value;
                            onChange({ name: "height", value });
                          }}
                          value={form.height || null}
                          keyboardType="number-pad"
                          // value={text}
                          // onChangeText={setText}
                          // onSubmitEditing={handleSend}
                          blurOnSubmit={false}
                          returnKeyType="done"
                        />
                      </View>
                    </View>
                    {/* <View style={{ flexDirection: 'row', width: '100%' }}>





                        <View style={{ padding: 5 }}>
                          <TextInput
                            style={{
                              flex: 0.9,
                              height: 40,
                            }}
                            placeholder="Type your message here..."


                            blurOnSubmit={false}
                            returnKeyType="send"
                          />

                        </View> */}

                    {/* <View style={{ padding: 5 }}>
                        <TextInput
                          label="First name"
                          mode="outlined"
                          style={{
                            // width: 150,
                            // paddingHorizontal: 5,
                            // fontSize: 15,
                          }}
                        />
                        <View style={{ padding: 5 }}>
                          <TextInput
                            label="last name"
                            mode="outlined"
                            style={{
                              // width: 150,
                              // paddingHorizontal: 5,
                              fontSize: 15,
                            }}
                          />

                        </View>
                      </View>
                      <View style={{ padding: 5 }}>
                        <TextInput
                          label="Mobile"
                          mode="outlined"
                        />

                      </View>
                      <View style={{ padding: 5 }}>
                        <TextInput
                          label="email"
                          mode="outlined"
                        />

                      </View>
                      <View style={{ padding: 5 }}>
                        <TextInput
                          label="Age"
                          mode="outlined"
                        />

                      </View>
                      <View style={{ padding: 5 }}>
                        <TextInput
                          label="Gender"
                          mode="outlined"
                        />

                      </View>
                      <View style={{ padding: 5 }}>
                        <TextInput
                          label="Height"
                          mode="outlined"
                        />

                      </View>
                      <View style={{ padding: 5 }}>
                        <TextInput
                          label="Weight"
                          mode="outlined"
                        />

                      </View> */}

                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 10,
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          width: "50%",
                          // borderWidth: 1,
                          paddingVertical: 10,
                          alignItems: "center",
                          borderRadius: 50,
                          backgroundColor: "#0f87cf",
                        }}
                        onPress={() => {
                          onSubmit();
                          // setModalVisible(false), setSection("Profile");
                        }}
                      >
                        <Text style={{ color: "#ffff" }}>Update</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.container}>
                      <View
                        style={{ width: "100%" }}
                        onPress={() => {
                          setModalVisible(false), setSection("Profile");
                        }}
                      >
                        <Text style={{ fontSize: 15, fontWeight: "500" }}>
                          Settings
                        </Text>
                        <View style={{ flexDirection: "column" }}>
                          <TouchableOpacity
                            style={{
                              flexDirection: "row",
                              height: 50,
                              borderBottomWidth: 1,
                              borderBottomColor: "#d9d9d9",
                              alignItems: "center",
                              flex: 3,
                            }}
                          >
                            <View style={{}}>
                              <AntDesign
                                name="appstore-o"
                                size={22}
                                color="#0f87cf"
                              />
                            </View>
                            <TouchableOpacity style={{ marginLeft: 10 }}>
                              <Text>Apps</Text>
                            </TouchableOpacity>
                            <View
                              style={{
                                justifyContent: "flex-end",
                                alignItems: "flex-end",
                                flex: 0.9,
                              }}
                            >
                              <AntDesign
                                name="right"
                                size={22}
                                color="#0f87cf"
                              />
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={{ flexDirection: "column" }}>
                        <TouchableOpacity
                          onPress={() => {
                            setModalVisible(false), navigate("myApps");
                          }}
                          style={{
                            flexDirection: "row",
                            height: 50,
                            borderBottomWidth: 1,
                            borderBottomColor: "#d9d9d9",
                            alignItems: "center",
                            flex: 3,
                          }}
                        >
                          <View style={{}}>
                            <AntDesign
                              name="appstore1"
                              size={22}
                              color="#0f87cf"
                            />
                          </View>

                          {/* <TouchableOpacity style={{ marginLeft: 10 }}> */}
                          <Text style={{ marginLeft: 10 }}>My Apps</Text>
                          {/* </TouchableOpacity> */}
                          <View
                            style={{
                              justifyContent: "flex-end",
                              alignItems: "flex-end",
                              flex: 0.9,
                            }}
                          >
                            <AntDesign name="right" size={22} color="#0f87cf" />
                          </View>
                        </TouchableOpacity>
                        {/* <TouchableOpacity>
                          <Text>Apps</Text>
                          </TouchableOpacity>
                          <TouchableOpacity>
                          <Text>Apps</Text>
                          </TouchableOpacity>
                          <TouchableOpacity>
                          <Text>Apps</Text>
                          </TouchableOpacity> */}
                      </View>
                      <View style={{ flexDirection: "column" }}>
                        <TouchableOpacity
                          style={{
                            flexDirection: "row",
                            height: 50,
                            borderBottomWidth: 1,
                            borderBottomColor: "#d9d9d9",
                            alignItems: "center",
                            flex: 3,
                          }}
                          onPress={() => {
                            setModalVisible(false), navigate("Secratekey");
                          }}
                        >
                          <View style={{}}>
                            <Entypo name="code" size={22} color="#0f87cf" />
                          </View>

                          {/* <TouchableOpacity style={{ marginLeft: 10 }}> */}
                          <Text style={{ marginLeft: 10 }}>Secret Code</Text>
                          {/* </TouchableOpacity> */}
                          <View
                            style={{
                              justifyContent: "flex-end",
                              alignItems: "flex-end",
                              flex: 0.9,
                            }}
                          >
                            <AntDesign name="right" size={22} color="#0f87cf" />
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            flexDirection: "row",
                            height: 50,
                            borderBottomWidth: 1,
                            borderBottomColor: "#d9d9d9",
                            alignItems: "center",
                            flex: 3,
                          }}
                          onPress={() => {
                            setModalVisible(false);
                            navigate("BussinessUpgrade");
                            // setModalVisible(false), navigate("Secratekey");
                          }}
                        >
                          <View style={{}}>
                            <FontAwesome
                              name="building"
                              size={22}
                              color="#0f87cf"
                            />
                          </View>

                          {/* <TouchableOpacity style={{ marginLeft: 10 }}> */}
                          <Text style={{ marginLeft: 10 }}>
                            Business Upgrade
                          </Text>
                          {/* </TouchableOpacity> */}
                          <View
                            style={{
                              justifyContent: "flex-end",
                              alignItems: "flex-end",
                              flex: 0.9,
                            }}
                          >
                            <AntDesign name="right" size={22} color="#0f87cf" />
                          </View>
                        </TouchableOpacity>
                        {/* <TouchableOpacity>
                          <Text>Apps</Text>
                          </TouchableOpacity>
                          <TouchableOpacity>
                          <Text>Apps</Text>
                          </TouchableOpacity>
                          <TouchableOpacity>
                          <Text>Apps</Text>
                          </TouchableOpacity> */}
                      </View>
                    </View>

                    <View style={styles.container}>
                      <View
                        style={{
                          width: "90%",
                          alignItems: "center",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginTop: 5,
                        }}
                        onPress={() => {
                          setModalVisible(false), setSection("Profile");
                        }}
                      >
                        <Text style={{ fontSize: 15, fontWeight: "500" }}>
                          Connected Apps
                        </Text>

                        <Image
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: 10,
                          }}
                          source={{
                            uri: "https://reactnative.dev/img/tiny_logo.png",
                          }}
                        />
                      </View>
                    </View>

                    {/* 
                      <View style={{ width: '100%', paddingVertical: 5, marginTop: 10, }} onPress={() => { setModalVisible(false), setSection("Profile") }}>
                        <Text style={{ fontSize: 15 }}>Secret code</Text>
                        <View style={{ alignItems: 'center', justifyContent: 'center', height: 50, width: "100%", marginTop: 10 }}>
                          <Text>Secret code Sections</Text>
                        </View>
                      </View> */}

                    <View
                      style={{
                        width: "90%",
                        alignItems: "center",
                        marginTop: 10,
                      }}
                      onPress={() => {
                        setModalVisible(false), setSection("Profile");
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          logoutCall();
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Ionicons
                            name="md-exit-outline"
                            size={22}
                            color="#0f87cf"
                          />

                          <Text
                            style={{
                              marginLeft: 5,
                              fontSize: 18,
                              fontWeight: "500",
                              color: "#0f87cf",
                            }}
                          >
                            Logout
                          </Text>
                        </View>
                      </TouchableOpacity>
                      {/* <View style={{ alignItems: 'center', justifyContent: 'center', height: 50, width: "100%", marginTop: 10 }}>
                        <Text>Secret code Sections</Text>
                      </View> */}
                    </View>

                    {/* <TouchableOpacity style={{ width: '85%', borderWidth: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 50, marginTop: 10 }} onPress={() => { setModalVisible(false), setSection("ConnectedApps") }}>
                      <Text>Secret code</Text>
                    </TouchableOpacity> */}
                    {/* <TouchableOpacity style={{ width: '85%', borderWidth: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 50, marginTop: 10 }} onPress={() => { setModalVisible(false), setSection("ConnectedApps") }}>
                      <Text>Logout</Text>
                    </TouchableOpacity> */}
                  </View>

                  {/* <Text style={styles.modalText}>Hello World!</Text>    
              <Text style={styles.modalText}>Hello World!</Text>     */}
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   text:{
//     flex: 1,
//     margin:9,
//     alignItems: 'center',
//     justifyContent: 'center',
//   }
// });

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
