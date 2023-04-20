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
} from "react-native";
import { useEffect, useRef, useState } from "react";
import Voice from "@react-native-voice/voice";
import axios from "axios";
// import { Audio } from "expo-av";
// import Logo from './Images/homeLogo.jpg'
// import { FontAwesome } from "@expo/vector-icons";
// import TextEffect from "./Shared/typeEffect"

import {
  PorcupineManager,
  BuiltInKeywords,
  PorcupineErrors,
} from "@picovoice/porcupine-react-native";

import CustomInput from "../component/Shared/customInput";
import ChatUI from "../component/Shared/chatUI";
import RNFetchBlob from "rn-fetch-blob";

// import { AntDesign } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { signOutFunc,auth } from "../firebaseConfig";
import AudioRecord from "react-native-audio-record";
// import SoundPlayer from "react-native-sound-player";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout } from "./Redux/authActions";
import { useDispatch, useSelector } from "react-redux";
import VoiceComponent from "./Record/Voice";
import Tts from "react-native-tts";
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

export default function whisper({ navigation }) {
  let [started, setStarted] = useState(false);
  const [isLoggingIn, setisLoggingIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  let [results, setResults] = useState("");
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
  console.log(state);
  const [isListening, setIsListening] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  let _accessKey = "qEufDJXOv4cnT4g4I3+ksyBgewy2MF0/320eWQAZ8QuQKkwILg4T1Q=="; // AccessKey obtained from Picovoice Console (https://console.picovoice.ai/)
  let _keyword = "hey alli";

  let _porcupineManager = PorcupineManager | undefined;

  useEffect(() => {
    abc();
  }, [isListening]);

  useEffect(() => {
    abc();
  }, [started]);

  const _toggleListening = () => {
    // console.log("isListening", isListening);
    if (isListening) {
      _stopProcessing();
    } else {
      _startProcessing();
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App has come to the foreground!");
      } else if (
        appState.current.match(/inactive|active/) &&
        nextAppState === "background"
      ) {
        console.log("app in bbb");
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log("AppState", appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const _startProcessing = async () => {
    let recordAudioRequest;
    if (Platform.OS === "android") {
      console.log("android");
      recordAudioRequest = _requestRecordAudioPermission();
    } else {
      console.log("android1");
      recordAudioRequest = new Promise(function (resolve, _) {
        resolve(true);
      });
    }

    recordAudioRequest.then(async (hasPermission) => {
      if (!hasPermission) {
        console.error(
          "Required permissions (Microphone)we're not found. Please add to platform code."
        );
        return;
      } else {
        try {
          await _porcupineManager?.delete();
          await _porcupineManager?.start().then((didStop) => {
            console.log("start recording");
            if (didStop) {
              setIsListening(true);
            }
          });
        } catch (e) {
          console.log("start error -- ", e);
        }
      }
    });
  };
  const _stopProcessing = async () => {
    try {
      await _porcupineManager?.delete();
      await _porcupineManager?.stop().then((didStop) => {
        console.log("stop recording");
        if (didStop) {
          setIsListening(false);
        }
      });
    } catch (error) {
      console.log("stop error", error);
    }
  };

  const _requestRecordAudioPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: "Microphone Permission",
          message:
            "Porcupine needs access to your microphone to listen for wake words.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      setIsError(true);
      setErrorMessage(err.toString());

      return false;
    }
  };

  const abc = async () => {
    console.log(_keyword, "--speack--");
    try {
      _porcupineManager = await PorcupineManager.fromKeywordPaths(
        _accessKey,
        ["resource/hey-alli_en_android_v2_2_0.ppn"],
        (keywordIndex) => {
          if (keywordIndex >= 0) {
            console.log("match hey alli");
            Tts.speak("welcome");
          }
        },
        (error) => {
          _stopProcessing();
          setIsError(true);
          setErrorMessage(error.message);
        },
        "",
        [0.5]
      );
    } catch (err) {
      let errorMessage = "";
      if (err instanceof PorcupineErrors.PorcupineInvalidArgumentError) {
        errorMessage = `${err.message}\nPlease make sure accessKey ${this._accessKey} is a valid access key.`;
      } else if (err instanceof PorcupineErrors.PorcupineActivationError) {
        errorMessage = "AccessKey activation error";
      } else if (err instanceof PorcupineErrors.PorcupineActivationLimitError) {
        errorMessage = "AccessKey reached its device limit";
      } else if (
        err instanceof PorcupineErrors.PorcupineActivationRefusedError
      ) {
        errorMessage = "AccessKey refused";
      } else if (
        err instanceof PorcupineErrors.PorcupineActivationThrottledError
      ) {
        errorMessage = "AccessKey has been throttled";
      } else {
        errorMessage = err.toString();
      }

      setIsError(true);
      setErrorMessage(errorMessage);
    }
  };
  // console.log(state.token);
  //   const soundRef = useRef(null);

  //   useEffect(() => {
  //     Voice.onSpeechError = onSpeechError;
  //     Voice.onSpeechResults = onSpeechResults;

  //     return () => {
  //       Voice.destroy().then(Voice.removeAllListeners);
  //     }
  //   }, []);

  useEffect(() => {
    // AudioRecord.init(options);
    setReceivedText("");
    setTypeText("");
    setResults("");
    // setVoiceResult('')
  }, [showInput]);

  const startSpeechToText = async () => {
    await Voice.start("en-NZ");
    setStarted(true);
    setResults("");
    setVoiceResult("");
  };

  const stopSpeechToText = async () => {
    await Voice.stop();
    setStarted(false);
  };

  //   const onSpeechResults = (result) => {
  //     sendAnswer(result?.value)
  //   };

  //   const onSpeechError = (error) => {
  //     console.log(error);
  //   };

  const sendAnswer = async (text) => {
    // const UsersData = await AsyncStorage.getItem("Token");
    setIsLoading(true);
    const url = `https://heyalli.azurewebsites.net/api/HeyAlli/brain?text=${text}`;
    axios
      .get(url, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${state.token}`,
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

  const getAnswerVoice = (text) => {
    setIsLoading(true);
    const timer = text.length * 50 + 20000;
    const url = `https://heyalli.azurewebsites.net/api/convert/tts?text=${text}`;
    axios
      .get(url, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${state.token}`,
        },
      })
      .then(function (response) {
        console.log("response", response);
        setVoiceResult(response?.data);

        setResults(text);
        setReceivedText(text);
        const dirs = RNFetchBlob.fs.dirs;
        const filePath = RNFS.DownloadDirectoryPath + "/audio.mp3";
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

  //   useEffect(() => {
  //     handlePlayButtonPress()
  //   }, [voiceResult])

  //   const handlePlayButtonPress = async () => {
  //     try {
  //       if (soundRef.current !== null) {
  //         await soundRef.current.unloadAsync();
  //       }
  //       const { sound } = await Audio.Sound.createAsync(
  //         { uri: 'data:audio/wav;base64,' + voiceResult },
  //         { shouldPlay: true }
  //       );
  //       soundRef.current = sound;
  //     } catch (err) {
  //       // console.error('Failed to play audio', err);
  //     }
  //   };
  //   const scrollViewRef = useRef();

  //   useEffect(() => {
  //     const interval = setInterval(() => {
  //       scrollViewRef?.current?.scrollToEnd({ animated: true });
  //     }, 3000);
  //     return () => clearInterval(interval);
  //   }, []);

  const handleInputField = () => {
    setShowInput(!showInput);
    // setShowInput(!showInput);
  };
  const handleSend = (text) => {
    // do something with the text (e.g. send a message to a server)
    setTypeText(text);
    sendAnswer(text);
  };

  const onStartRecord = async () => {
    // if (Platform.OS === "android") {
    //   try {
    //     const grants = await PermissionsAndroid.requestMultiple([
    //       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    //       PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    //       PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    //     ]);

    //     console.log("write external stroage", grants);

    //     if (
    //       grants["android.permission.WRITE_EXTERNAL_STORAGE"] ===
    //         PermissionsAndroid.RESULTS.GRANTED &&
    //       grants["android.permission.READ_EXTERNAL_STORAGE"] ===
    //         PermissionsAndroid.RESULTS.GRANTED &&
    //       grants["android.permission.RECORD_AUDIO"] ===
    //         PermissionsAndroid.RESULTS.GRANTED
    //     ) {
    console.log("permissions granted");
    AudioRecord.init(options);
    setStarted(true);
    AudioRecord.start();
    //   } else {
    //     console.log("All required permissions not granted");

    //     return;
    //   }
    // } catch (err) {
    //   // console.warn(err);

    return;
    // }
    // }
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
    console.log("hshahgsasgash");
    setStarted(false);
    AudioRecord.stop();
    const audioFile = await AudioRecord.stop();
    uploadAudioAsync(audioFile);
  };

  const uploadAudioAsync = async (uri) => {
    setisLoggingIn(true);
    // const UsersData = await AsyncStorage.getItem("Token");
    console.log();
    const formData1 = new FormData();

    const apiUrl = "https://heyalli.azurewebsites.net/api/HeyAlli";

    const Data = {
      uri: "file:////" + uri,
      name: "test.wav",
      type: "audio/wav",
    };
    // console.log("Data", JSON.stringify(Data))

    formData1.append("speech", Data);

    const { data } = await axios.post(apiUrl, formData1, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${state.token}`,
      },
    });

    if (data) {
      console.log("dataaaaa", data);
      setisLoggingIn(false);
      const dirs = RNFetchBlob.fs.dirs;
      const filePath = RNFS.DownloadDirectoryPath + "/audio.mp3";
      const fileData = data.split(",")[1];

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
  };

  const logoutCall = async () => {
    dispatch(logout());
  };

  return (
    <View style={styles.root}>
      {/* <VoiceComponent /> */}
      <SafeAreaView />
      {!showInput ? (
        <>
          <View
            style={{
              alignSelf: "flex-end",
              margin: 30,
              backgroundColor: "black",
              padding: 1,
            }}
          >
            <Text style={{ color: "white" }}> CC </Text>
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
                <TouchableOpacity
                  style={{
                    backgroundColor: !started ? "#fff" : "#000",
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    justifyContent: "center",
                    alignItems: "center",
                    alignItems: "center",
                  }}
                  // onPress={_toggleListening}
                  onPress={!started ? onStartRecord : onStopRecord}
                >
                  <FontAwesome
                    name="microphone"
                    size={32}
                    color={!started ? "#000" : "#fff"}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.circleButton, { backgroundColor: "#000" }]}
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
                          // value={text}
                          // onChangeText={setText}
                          // onSubmitEditing={handleSend}
                          blurOnSubmit={false}
                          returnKeyType="next"
                        />
                        <TextInput
                          style={[styles.input, { marginLeft: 10 }]}
                          placeholder="Last name"
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
                          placeholder="Email"
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
                          placeholder="Mobile No"
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
                          // value={text}
                          // onChangeText={setText}
                          // onSubmitEditing={handleSend}
                          blurOnSubmit={false}
                          returnKeyType="next"
                        />
                        <TextInput
                          style={[styles.input, { marginLeft: 10 }]}
                          placeholder="Gender"
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
                            height: 80,
                            borderWidth: 1,
                            borderRadius: 10,
                            textAlign: "left",
                          }}
                          placeholder="Address"
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
                          // value={text}
                          // onChangeText={setText}
                          // onSubmitEditing={handleSend}
                          blurOnSubmit={false}
                          returnKeyType="next"
                        />
                        <TextInput
                          style={[styles.input, { marginLeft: 10 }]}
                          placeholder="State"
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
                          // value={text}
                          // onChangeText={setText}
                          // onSubmitEditing={handleSend}
                          blurOnSubmit={false}
                          returnKeyType="next"
                        />
                        <TextInput
                          style={[styles.input, { marginLeft: 10 }]}
                          placeholder="Height"
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

                    {/* <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10 }}> */}

                    {/* <TouchableOpacity style={{ width: '85%', borderWidth: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 50 }} onPress={() => { setModalVisible(false), setSection("Profile") }}>
                        <Text>Submit</Text>
                      </TouchableOpacity> */}

                    {/* </View> */}

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
