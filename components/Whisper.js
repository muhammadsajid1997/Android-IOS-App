import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, Button, View, ActivityIndicator, TextInput, Image, TouchableOpacity, ScrollView, Modal, Alert, Pressable, BackHandler } from 'react-native';
import { useEffect, useRef, useState } from 'react';

import axios from "axios";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import Logo from './Images/homeLogo.jpg'
import { FontAwesome, Entypo, Ionicons } from "@expo/vector-icons";
import TextEffect from "./Shared/typeEffect"
import CustomInput from './Shared/customInput';
import ChatUI from './Shared/chatUI';
import { AntDesign } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOutFunc, auth } from "../firebaseConfig";
import { DrawerActions, useNavigation } from '@react-navigation/native';
import * as BackgroundFetch from "expo-background-fetch"
import * as TaskManager from "expo-task-manager"
import * as Location from 'expo-location';
// import { TextInput } from 'react-native-paper';
import Voice from '@react-native-voice/voice';
export default function App({ }) {
  let [started, setStarted] = useState(false);
  let [results, setResults] = useState([]);
  let [voiceResult, setVoiceResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [typeText, setTypeText] = useState("");
  const [receivedText, setReceivedText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSection, setSection] = useState("Home");
  const soundRef = useRef(null);
  const [partialResults, setPartialResults] = useState([]);
  const {navigate} = useNavigation();

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);



  useEffect(() => {
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    }
  }, []);


  const startSpeechToText = async () => {
    await Voice.start("en-NZ");
    setStarted(true);
    setResults("")
    setVoiceResult("")
  };
;

  const stopSpeechToText = async () => {
    await Voice.stop();
    setStarted(false);
  };

  const onSpeechResults = (result) => {
    setResults(result.value);
  };

  const onSpeechError = (error) => {
    console.log(error);
  };



  const TASK_NAME = "BACKGROUND_TASK"

  TaskManager.defineTask(TASK_NAME, () => {
    try {
      // fetch data here...
      const receivedNewData = "Simulated fetch " + Math.random()
      // console.log("My task ", receivedNewData)
      return receivedNewData
        ? BackgroundFetch.Result.NewData
        : BackgroundFetch.Result.NoData
    } catch (err) {
      return BackgroundFetch.Result.Failed
    }
  })


  RegisterBackgroundTask = async () => {
    try {
      await BackgroundFetch.registerTaskAsync(TASK_NAME, {
        minimumInterval: 5, // seconds,
      })
      // console.log("Task registered")
    } catch (err) {
      // console.log("Task Register failed:", err)
    }
  }

  useEffect(() => {
    // const backAction = () => {
    //   setModalVisible(false),
    //     setSection("Home")
    //   return true;
    // };

    // const backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   backAction,
    // );

    // return () => backHandler.remove();
  }, []);


  // useEffect(() => {
  //   (async () => {

  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== 'granted') {
  //       setErrorMsg('Permission to access location was denied');
  //       return;
  //     }

  //     let location = await Location.getCurrentPositionAsync({});
  //     console.log(location)
  //     setLocation(location);
  //   })();
  // }, []);

  // let text = 'Waiting..';
  // if (errorMsg) {
  //   text = errorMsg;
  // } else if (location) {
  //   text = JSON.stringify(location);
  // }



  useEffect(() => {
    setReceivedText("")
    setTypeText("")
    setResults("")
    setVoiceResult('')
  }, [showInput]);



  const sendAnswer = (text) => {
    setIsLoading(true)
    const url = `https://heyalli.azurewebsites.net/api/HeyAlli/brain?text=${text}`
    axios.get(url)
      .then(function (response) {
        getAnswerVoice(response?.data)
        setIsLoading(true)
      })
      .catch(function (error) {
        console.log("sendAnswer", error);
        setIsLoading(false)
      });
  }

  const getAnswerVoice = (text) => {
    setIsLoading(true)
    const timer = (text.length * 50) + 20000
    const url = `https://heyalli.azurewebsites.net/api/convert/tts?text=${text}`
    axios.get(url)
      .then(function (response) {
        setVoiceResult(response?.data)
        setResults(text)
        setReceivedText(text)
        setTimeout(() => {
          setResults("")
        }, timer);
        setIsLoading(false)
      })
      .catch(function (error) {
        console.log("getAnswerVoice", error);
        setIsLoading(false)

      });
  }

  useEffect(() => {
    handlePlayButtonPress()
  }, [voiceResult])

  const handlePlayButtonPress = async () => {
    try {
      if (soundRef.current !== null) {
        await soundRef.current.unloadAsync();
      }
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'data:audio/wav;base64,' + voiceResult },
        { shouldPlay: true }
      );
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        interruptionModeIOS: InterruptionModeIOS.DuckOthers,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
        playThroughEarpieceAndroid: false
      });
      soundRef.current = sound;
    } catch (err) {
      // console.error('Failed to play audio', err);
    }
  };
  const scrollViewRef = useRef();

  useEffect(() => {
    const interval = setInterval(() => {
      scrollViewRef?.current?.scrollToEnd({ animated: true });
    }, 3000);
    return () => clearInterval(interval);
  }, []);



  const handleInputField = () => {
    setShowInput(!showInput)
  }
  const handleSend = (text) => {
    // do something with the text (e.g. send a message to a server)
    setTypeText(text)
    sendAnswer(text)
  };

  // const logout = async () => {
  //   try {
  //     await signOutFunc;
  //     navigation.navigate('login')
  //     console.log('User signed out successfully.');
  //   } catch (error) {
  //     console.error('Error signing out: ', error);
  //   }
  // }


  const RenderSections = () => {
    if (modalSection == 'Home') {
      return <View style={styles.root}>
        {!showInput ?
          <>

            <View style={{ alignSelf: 'flex-end', margin: 30, backgroundColor: 'black', padding: 1 }}>
              <Text style={{ color: 'white' }}> CC </Text>
            </View>

            <View style={{ flex: 1, marginHorizontal: 20, alignItems: 'center' }}>
              <View>
                {!results ?
                  <>
                    <Text style={styles.title}>Start Speaking </Text>
                    {/* <Text>{text}</Text> */}



                    <Text style={styles.title}> To Activate Alli </Text>
                  </>
                  :
                  <ScrollView ref={scrollViewRef} style={styles.scrollViewText}>
                    <TextEffect text={results} />
                  </ScrollView>

                }

              </View>
            </View>

            <View style={styles.settingsSection}>
              <Image style={{ borderRadius: 80 }} source={Logo} />
            </View>
            {!isLoading ?
              <TouchableOpacity style={[styles.circleButton, { backgroundColor: !started ? '#fff' : "#000" },]}
                onPress={!started ? startSpeechToText : stopSpeechToText}>
                <FontAwesome name="microphone" size={32} color={!started ? "#000" : "#fff"} />
              </TouchableOpacity>
              :
              <TouchableOpacity style={[styles.circleButton, { backgroundColor: "#000" }]} disabled>
                <ActivityIndicator size={32} color="#fff" />
              </TouchableOpacity>
            }


          </>
          :
          <>
            <View style={{ marginTop: 10, width: "100%" }}>
              <Text style={{ ...styles.title, fontWeight: "700", fontSize: 35, color: "#0f87cf", marginVertical: 10, }}>Hey Alli </Text>
              <CustomInput onSend={handleSend} isLoading={isLoading} />
            </View>
            <View style={{ marginTop: 10, width: "100%" }}>
              <ChatUI TypeText={typeText} ReceivedText={receivedText} />
            </View>
          </>
        }
        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={handleInputField}>
            {!showInput ?
              <AntDesign name="form" size={24} color="black" />
              :
              <AntDesign name="enter" size={24} color="black" />}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Entypo name="menu" size={28} color={"#000"} />
          </TouchableOpacity>

        </View>


        <View style={styles.centeredView}>
          <Modal

            animationType="none"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}>
            <View style={{ flex: 1, }}>
              <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <View style={{ marginTop: 10, width: "100%" }}>
                      <Text style={{ ...styles.title, fontWeight: "700", fontSize: 35, color: "#0f87cf", marginVertical: 10, }}>Hey Alli </Text>
                      {/* <CustomInput onSend={handleSend} isLoading={isLoading} /> */}
                    </View>

                    <View style={{ padding: 10 }}>



                      <View style={styles.container}>

                        <View style={{ width: '90%', paddingVertical: 10, }} onPress={() => { setModalVisible(false), setSection("Profile") }}>
                          <Text style={{ fontSize: 15, fontWeight: '500' }}>Profile</Text>
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
                        <View style={{ width: '100%', }} onPress={() => { setModalVisible(false), setSection("Profile") }}>
                          <Text style={{ fontSize: 15, fontWeight: '500' }}>Settings</Text>
                          <View style={{ flexDirection: 'column', }}>
                            <TouchableOpacity style={{ flexDirection: 'row', height: 50, borderBottomWidth: 1, borderBottomColor: '#d9d9d9', alignItems: 'center', flex: 3 }}>
                              <View style={{}}>
                                <AntDesign name="appstore-o" size={22} color="#0f87cf" />
                              </View>
                              <TouchableOpacity style={{ marginLeft: 10 }}>
                                <Text>Apps</Text>
                              </TouchableOpacity>
                              <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', flex: 0.9 }}>
                                <AntDesign name="right" size={22} color="#0f87cf" />
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                        <View style={{ flexDirection: 'column', }}>
                          <TouchableOpacity onPress={() =>{setModalVisible(false),navigate("MyApps")}}  style={{ flexDirection: 'row', height: 50, borderBottomWidth: 1, borderBottomColor: '#d9d9d9', alignItems: 'center', flex: 3 }}>
                            <View style={{}}>
                              <AntDesign name="appstore1" size={22} color="#0f87cf" />
                            </View>

                            <TouchableOpacity style={{ marginLeft: 10 }} >
                              <Text>My Apps</Text>
                            </TouchableOpacity>
                            <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', flex: 0.9 }}>
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
                        <View style={{ flexDirection: 'column', }}>
                          <TouchableOpacity style={{ flexDirection: 'row', height: 50, borderBottomWidth: 1, borderBottomColor: '#d9d9d9', alignItems: 'center', flex: 3 }}>
                            <View style={{}}>
                              <Entypo name="code" size={22} color="#0f87cf" />
                            </View>

                            <TouchableOpacity style={{ marginLeft: 10 }}>
                              <Text>Secret Code</Text>
                            </TouchableOpacity>
                            <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', flex: 0.9 }}>
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
                        <View style={{ width: '90%', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }} onPress={() => { setModalVisible(false), setSection("Profile") }}>
                          <Text style={{ fontSize: 15, fontWeight: '500' }}>Connected Apps</Text>




                          <Image
                            style={{
                              width: 50,
                              height: 50,
                              borderRadius: 10

                            }}
                            source={{
                              uri: 'https://reactnative.dev/img/tiny_logo.png',
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

                      <View style={{ width: '90%', alignItems: 'center', marginTop: 10 }} onPress={() => { setModalVisible(false), setSection("Profile") }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                          <Ionicons name="md-exit-outline" size={22} color="#0f87cf" />

                          <Text style={{ marginLeft: 5, fontSize: 18, fontWeight: '500', color: '#0f87cf' }}>Logout</Text>
                        </View>

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
    }

  }

  return (


    RenderSections()


  )
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
    alignSelf: 'center',
    justifyContent: 'center'
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
    marginHorizontal: 50
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
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1
    // backgroundColor: '#fff',
  },
  button: {
    width: 200,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  circleButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewText: {
    marginBottom: 15,
    // borderWidth: 1,
    // borderStyle: 'solid',
    // borderColor: 'gray', 
    paddingHorizontal: 10,
    overflow: "scroll",
    flex: 1
  },
  bottomBar: {
    justifyContent: "space-between", flexDirection: "row", position: 'absolute', bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: "100%",
    // marginTop: 22,
    backgroundColor: '#fff'
    // backgroundColor: '#f1f1f1',
  },
  modalView: {
    flex: 1,
    borderWidth: 1,
    width: "100%",
    // height: 800,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold'
  },
  container: {
    padding: 5,
    width: "100%"
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // borderWidth:1,
    // borderRadius: 20,
    // paddingHorizontal: 10,


  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderWidth: 1,
    borderColor: '#d9d9d9',

    // width: 20,
    height: 40,
    // borderWidth: 1,
    borderRadius: 10,
    textAlign: 'left',
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
    position: 'absolute',
    right: 17,
  },
  sendButtonText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});
