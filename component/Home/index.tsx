import axios from "axios";
import { useState, useEffect } from "react";
// import Speech from 'react-native-tts';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Pressable,
  ScrollView,
  Alert,
  SafeAreaView
} from "react-native";
import Record from "../Record";

const Home = (props:any) => {
  const [speechText, setSpeechText] = useState("");
  const [waveUrl, setWaveUrl] = useState("");
  const [response, setReponse] = useState("");
  const [animating, setAnimating] = useState(false)
  // const speak = () => {
  //   const thingToSay = speechText;
  //   Speech.speak(thingToSay);
  // };
  // function getReply(text:any){

  //   const headers = {
  //     'Content-Type': 'application/json',
  //     'Authorization': 'Bearer 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'
  //   }
  //   console.log("request text","I am an astronaut. "+ text)
  
  //   axios.post("https://api.openai.com/v1/completions", {
  //     "model": "text-davinci-003",
  //     "prompt": text,
  //     "max_tokens": 4000,
  //     "temperature": 1.0
  //   },{headers:headers}).then((res)=>{
  // console.log(res.data.choices[0]["text"])
  // Speech.speak(res.data.choices[0]["text"]);
  // props.changeText(res.data.choices[0]["text"])
  // setAnimating(false)
  
  // // setSpeechText(res.data.choices[0]["text"])
  
  
  //   }).catch((error)=>{
  //   Alert.alert("something went wrong "+error)});
  
  
  // }
  
  return (
    <View >
<SafeAreaView/>
      {/* <Text>{response}</Text> */}
      <ScrollView>
        <View style={{ paddingVertical: 50 }}>

          <Text
            style={styles.textInput}

          >

            {/* {speechText} */}
          </Text>
        </View>
      </ScrollView>


      <Record
        animating={animating}
        onSpeechEnd={(value) => {
          console.log(new Date())
          setSpeechText(value[0]);
          // getWave(value[0])
          // getReply(value[0])
          setAnimating(true)


        }}
        onSpeechStart={() => {
          setSpeechText("");
        }}
      />

    </View>
  );
};
export default Home;

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: '100%',
    backgroundColor: "#F5FCFF",
  },
  label: {
    fontWeight: "bold",
    fontSize: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
  inputContainer: {
    height: "100%",
    width: "100%",
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  textInput: {
    padding: 5,
    borderColor: "#d1d5db",
    height: 200,
    borderRadius: 5,
    color: 'black',
    fontSize: 40
  },
  saveButton: {
    right: 0,
  },
  voiceContainer: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around",
  },
});
