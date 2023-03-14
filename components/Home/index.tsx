// import { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   Button,
//   Pressable,
// } from "react-native";
// import { getAuth, signOut } from "firebase/auth";

// // import { useMutation, useQueryClient } from "react-query";
// import useCreateNote from "../../hooks/useCreateNote";
// import Record from "../Record";
// import * as Speech from 'expo-speech';
// import { Audio } from 'expo-av';
// import axios from "axios";
// export default function Home() {
//   const [speechText, setSpeechText] = useState("");
//   const [waveUrl, setWaveUrl] = useState("");

//   // const { mutate, isError, isLoading, isSuccess } = useCreateNote();
//   // const queryClient = useQueryClient();
//   const speak = () => {
//     const thingToSay = speechText;
//     Speech.speak(thingToSay);
//   };
   

//    const [sound, setSound] = useState();
// function getWave(text){
//   axios.post("https://voice.dev.bhuman.ai/api/voice/clip", {
//     "text": text,
//     "voice_id": "405b58e3"
//   }).then((res)=>{
// console.log(res.data.result.url)
// setWaveUrl(res.data.result.url)
// playSound(res.data.result.url)

//   });


// }

//  function logOut(){
  
// const auth = getAuth();
// signOut(auth).then((res) => {
//   // Sign-out successful.
//   console.log(res,"signou")
// }).catch((error) => {
//   // An error happened.
// });
//  }
//   async function playSound(url) {
   
   
//   ;


//     console.log('Loading Sound');
//     const { sound } = await Audio.Sound.createAsync( {uri: url})
//     ;
//     setSound(sound);

//     console.log('Playing Sound');
//     console.log(new Date())

//     await sound.playAsync();
//   }

//  useEffect(() => {
//     return sound
//       ? () => {

//           console.log('Unloading Sound');
//           sound.unloadAsync();
//         }
//       : undefined;
//   }, [sound]);

//   useEffect(() => {
//     // if (isSuccess) {
//       setSpeechText("");
//       // queryClient.invalidateQueries(["notes"]);
//     // }
//   // }, [isSuccess]);
// },[])

//   return (
//     <View style={styles.container}>
//       <View style={styles.inputContainer}>
//         <Text style={styles.label}>Output</Text>
//         <TextInput
//           multiline
//           style={styles.textInput}
//           numberOfLines={6}
//           value={speechText}
//           maxLength={500}
//           editable={true}
//         />

//         <View
//           style={{
//             alignItems: "flex-end",
//             flex: 1,
//             flexDirection: "row",
//             justifyContent: "space-between",
//           }}
//         >
//           <Button
//             title="Save"
//             color={"#007AFF"}
//             onPress={async () => {
//               console.log("save");
//               try {
//                 // await mutate(speechText);
//               } catch (e) {
//                 console.log(e);
//               }
//             }}
//           />

//           <Button
//             title="logOut"
//             color={"#007AFF"}
//             onPress={() => {
//               logOut();
//             }}
//           />
//         </View>
//       </View>

//       <View style={styles.voiceContainer}>
//         <Record
//           onSpeechEnd={(value) => {
// console.log(new Date())
//             setSpeechText(value[0]);
//             getWave(value[0])


//           }}
//           onSpeechStart={() => {
//             setSpeechText("");
//           }}
//         />
//       </View>
//       <View >
//       {/* <Button title="Press to hear " onPress={playSound)} /> */}
//     </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     width: "100%",
//     backgroundColor: "#F5FCFF",
//   },
//   label: {
//     fontWeight: "bold",
//     fontSize: 15,
//     paddingTop: 10,
//     paddingBottom: 10,
//   },
//   inputContainer: {
//     height: "50%",
//     width: "100%",
//     flex: 1,
//     padding: 10,
//     justifyContent: "center",
//   },
//   textInput: {
//     padding: 10,
//     borderColor: "#d1d5db",
//     borderWidth: 1,
//     height: 200,
//     borderRadius: 5,
//   },
//   saveButton: {
//     right: 0,
//   },
//   voiceContainer: {
//     height: "50%",
//     width: "100%",
//     alignItems: "center",
//     justifyContent: "space-around",
//   },
// });
import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Pressable,
} from "react-native";
import { getAuth, signOut } from "firebase/auth";

// import { useMutation, useQueryClient } from "react-query";
import useCreateNote from "../../hooks/useCreateNote";
import Record from "../Record";
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import axios from "axios";
import { ScrollView } from "react-native-gesture-handler";

export default function Home(props) {
  const [speechText, setSpeechText] = useState("");
  const [waveUrl, setWaveUrl] = useState("");
  const [response,setReponse]=useState("");
  const[animating,setAnimating]=useState(false)

  // const { mutate, isError, isLoading, isSuccess } = useCreateNote();
  // const queryClient = useQueryClient();
  const speak = () => {
    const thingToSay = speechText;
    Speech.speak(thingToSay);
  };
   

   const [sound, setSound] = useState();
function getReply(text){

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer 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'
  }
  console.log("request text","I am an astronaut. "+ text)

  axios.post("https://api.openai.com/v1/completions", {
    "model": "text-davinci-003",
    "prompt": text,
    "max_tokens": 4000,
    "temperature": 1.0
  },{headers:headers}).then((res)=>{
console.log(res.data.choices[0]["text"])
Speech.speak(res.data.choices[0]["text"]);
props.changeText(res.data.choices[0]["text"])
setAnimating(false)

// setSpeechText(res.data.choices[0]["text"])


  }).catch((error)=>{
  alert("something went wrong "+error)});


}

 function logOut(){
  
const auth = getAuth();
signOut(auth).then((res) => {
  // Sign-out successful.
  console.log(res,"signou")
}).catch((error) => {
  // An error happened.
});
 }
  async function playSound(url) {
   
   
  ;


    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync( {uri: url})
    ;
    setSound(sound);

    console.log('Playing Sound');
    console.log(new Date())

    await sound.playAsync();
  }

//  useEffect(() => {
//     return sound
//       ? () => {

//           console.log('Unloading Sound');
//           sound.unloadAsync();
//         }
//       : undefined;
//   }, [sound]);

  useEffect(() => {
    // if (isSuccess) {
      setSpeechText("");
      // queryClient.invalidateQueries(["notes"]);
    // }
  // }, [isSuccess]);
},[])

  return (
    <View >
      
        {/* <Text>{response}</Text> */}
        <ScrollView>
        <View style={{paddingVertical:50}}>
          
        <Text
          style={styles.textInput}
          
        >

          {speechText}
        </Text>
        </View>
        </ScrollView>


        <Record
        animating={animating}
          onSpeechEnd={(value) => {
console.log(new Date())
            setSpeechText(value[0]);
            // getWave(value[0])
            getReply(value[0])
            setAnimating(true)


          }}
          onSpeechStart={() => {
            setSpeechText("");
          }}
        />
       
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop:30,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height:'100%',
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
    color:'black',
    fontSize:40
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
