import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Button, View, ActivityIndicator, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import Voice from '@react-native-voice/voice';
import axios from "axios";
import { Audio } from "expo-av";
import Logo from './Images/homeLogo.jpg'
import { FontAwesome } from "@expo/vector-icons";
import TextEffect from "./Shared/typeEffect"
import CustomInput from './Shared/customInput';
import ChatUI from './Shared/chatUI';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOutFunc,auth } from "../firebaseConfig";


export default function App({ navigation }) {
  let [started, setStarted] = useState(false);
  let [results, setResults] = useState("");
  let [voiceResult, setVoiceResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [typeText, setTypeText] = useState("");
  const [receivedText, setReceivedText] = useState("");

  const soundRef = useRef(null);

  useEffect(() => {
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    }
  }, []);

  useEffect(() => {
    setReceivedText("")
    setTypeText("")
    setResults("")
    setVoiceResult('')
  }, [showInput]);

  const startSpeechToText = async () => {
    await Voice.start("en-NZ");
    setStarted(true);
    setResults("")
    setVoiceResult("")
  };

  const stopSpeechToText = async () => {
    await Voice.stop();
    setStarted(false);
  };

  const onSpeechResults = (result) => {
    sendAnswer(result?.value)
  };

  const onSpeechError = (error) => {
    console.log(error);
  };

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

  const logout = async () => {
    try {
      await signOutFunc;
      navigation.navigate('login')
      console.log('User signed out successfully.');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  }

  return (

    <View style={styles.root}>

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

          <View style={styles.container}>

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

          </View>
        </>
        :
        <>
          <View style={{ marginTop: 10, width: "100%" }}>
      <Text style={{...styles.title,fontWeight: "700",fontSize: 35, color:"#0f87cf",marginVertical: 10,}}>Hey Alli </Text>

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

        <TouchableOpacity onPress={logout}>
          {/* <AntDesign name="bars" size={28} color={"#000"} /> */}
          <AntDesign name="logout" size={28} color={"#000"} />
        </TouchableOpacity>

      </View>

    </View>
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
  }
});
