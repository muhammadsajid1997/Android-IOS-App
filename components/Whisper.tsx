import * as React from "react";
import {
  Text,
  StyleSheet,
  View,
  Button,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import { Audio } from "expo-av";
import FormData from "form-data";
import axios from "axios";
import Mode from "./Mode";
import TranscribedOutput from "./TranscribeOutput";
// import RNPickerSelect from "react-native-picker-select";
import logo from './Images/homeLogo.jpg'
import * as Speech from 'expo-speech';

import { FontAwesome } from "@expo/vector-icons";
import { MotiView } from "moti";
// import { Easing } from "react-native-reanimated";
// import logo from './Images/heyAllilogo.jpg'
import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
} from "@react-native-voice/voice";
import Record from "./Record";
import Messaging from "./Messaging";
import Myapp from "./Rating";
import Home from "./Home";
import * as FileSystem from 'expo-file-system';
import { ScrollView } from "react-native-gesture-handler";

const RECORDING_OPTIONS_PRESET_HIGH_QUALITY = {
  isMeteringEnabled: true,
  android: {
    extension: '.wav',
    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_DEFAULT,
    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
  },
  ios: {
    extension: '.wav',
    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
};

export default () => {

  const [speechText, setSpeechText] = React.useState("")
  // const [recording, setRecording] = React.useState(false as any);
  const [recordings, setRecordings] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [transcribedData, setTranscribedData] = React.useState([] as any);
  const [interimTranscribedData] = React.useState("");
  // const [isRecording, setIsRecording] = React.useState(false);
  const [isTranscribing, setIsTranscribing] = React.useState(false);
  const [selectedLanguage, setSelectedLanguage] = React.useState("english");
  const [selectedModel, setSelectedModel] = React.useState(1);
  const [transcribeTimeout, setTranscribeTimout] = React.useState(5);
  const [started, setStarted] = React.useState(false)
  const [sound, setSound] = React.useState(null)
  const [stopTranscriptionSession, setStopTranscriptionSession] =
    React.useState(false);
  // const [isLoading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false)
  const intervalRef: any = React.useRef(null);

  const [recording, setRecording] = React.useState();
  const [isRecording, setIsRecording] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [audioData, setAudioData] = React.useState();
  const [dataaa, setData] = React.useState();

  const recordingRef = React.useRef(null);
  const soundRef = React.useRef(null);



  const stopTranscriptionSessionRef = React.useRef(stopTranscriptionSession);
  stopTranscriptionSessionRef.current = stopTranscriptionSession;

  const selectedLangRef = React.useRef(selectedLanguage);
  selectedLangRef.current = selectedLanguage;

  const selectedModelRef = React.useRef(selectedModel);
  selectedModelRef.current = selectedModel;

  //
  const handleRecordButtonPress = async () => {
    console.log('aaaaaaaaaaaaaaaaaaaaaaa');

    if (!isRecording) {
      try {
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const recording = new Audio.Recording();
        await recording.prepareToRecordAsync(RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        recordingRef.current = recording;
        await recording.startAsync();
        setIsRecording(true);
      } catch (err) {
        console.error('Failed to start recording', err);
      }
    } else {
      setIsLoading(true);
      setIsRecording(false);
      try {
        await recordingRef.current.stopAndUnloadAsync();
        const uri = recordingRef.current.getURI();
        setRecording(null);
        await uploadAudioAsync(uri);
      } catch (err) {
        console.error('Failed to stop recording', err);
      }
    }
  };

  const uploadAudioAsync = async (uri) => {
    const apiUrl = 'https://heyalli.azurewebsites.net/api/HeyAlli';

    const fileUrl = uri;
    const fileDest = `${FileSystem.documentDirectory}file.wav`;

    try {
      const downloadResumable = FileSystem.createDownloadResumable(fileUrl, fileDest);
      const { uri } = await downloadResumable.downloadAsync();
      console.log(`File downloaded to ${uri}`);
    } catch (error) {
      // console.error(error.message);
    }

    // const fileUri = `${FileSystem.documentDirectory}file.wav`;
    console.log('fileUri: ', uri)
    const formData1 = new FormData();
    formData1.append('speech', {
      uri,
      name: 'audio.wav',
      type: 'audio/wav',
    });

    try {
      const responses = await fetch(apiUrl, {
        method: "POST",
        headers: {
          'Content-Type': `multipart/form-data`,
        },
        timeout: 60000,
        body: formData1,
      })
        .then(response => response.json())
        .then(data2 => {
          console.log('data2: ', data2)
          setData(data2)
        })

      // if (responses.status !== 200) {
      //   throw new Error('Failed to upload audio');
      // }

      setIsLoading(false);
      setIsPlaying(true);
    } catch (err) {
      // console.error('Failed to upload audio', err);
      // console.error(err.stack);
      // setIsPlaying(false);
      setIsLoading(false);
    }

    if (isPlaying) {
      handlePlayButtonPress();
    }

  };

  const handlePlayButtonPress = async () => {
    try {
      if (soundRef.current !== null) {
        await soundRef.current.unloadAsync();
      }
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'data:audio/wav;base64,' + dataaa },
        { shouldPlay: true }
      );
      soundRef.current = sound;
    } catch (err) {
      console.error('Failed to play audio', err);
    }
  };
  //

  async function playSound(url) {


    ;


    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync({ uri: url })
      ;
    setSound(sound);

    console.log('Playing Sound');
    console.log(new Date())

    await sound.playAsync();
  }


  const speak = (thingToSay) => {

    Speech.speak(thingToSay);
  };

  const [modelOptions, setModelOptions] = React.useState(["tiny", "base", "small", "medium", "large"]);
  React.useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  async function startRecording() {
    try {
      setStarted(true)
      console.log("Requesting permissions..");
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        // alert("Starting recording..");
        const RECORDING_OPTIONS_PRESET_HIGH_QUALITY: any = {
          android: {
            extension: ".wav",
            outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
            audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AMR_NB,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
          },
          ios: {
            extension: ".wav",
            audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MIN,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
            linearPCMBitDepth: 16,
            linearPCMIsBigEndian: false,
            linearPCMIsFloat: false,
          },
        };
        const { recording }: any = await Audio.Recording.createAsync(
          RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording);
        console.log("Recording started");
        setStopTranscriptionSession(false);
        setIsRecording(true);
        intervalRef.current = setInterval(
          transcribeInterim,
          transcribeTimeout * 1000
        );
        console.log("erer", recording);
      } else {
        setMessage("Please grant permission to app to access microphone");
      }
    } catch (err) {
      console.error(" Failed to start recording", err);
    }
  }

  async function stopRecording() {
    setStarted(false)
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    let updatedRecordings = [...recordings] as any;
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    updatedRecordings.push({
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI(),
    });
    setRecordings(updatedRecordings);
    console.log("Recording stopped and stored at", uri);
    // Fetch audio binary blob data
    const filetype = uri.split(".").pop();
    const filename = uri.split("/").pop();
    console.log({
      uri,
      type: `audio/${filetype}`,
      name: filename,
    })
    const soundTest = new Audio.Sound();

    try {
      await soundTest.loadAsync({
        uri
      });
      await sound.playAsync();
    } catch (error) {
      alert("error")
    }
    setLoading(true);
    const formData = new FormData();
    formData.append(
      "speech",
      {
        "uri": uri,
        type: `audio/${filetype}`,
        name: filename,
      }
    );
    console.log(formData)
    const url = 'https://heyalli.azurewebsites.net/api/HeyAlli';
    axios({
      method: 'get',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        // handle successful response
        console.log(response.data);
      })


    if (!stopTranscriptionSessionRef.current) {
      setIsRecording(true);
    }

    clearInterval(intervalRef.current);
    setStopTranscriptionSession(true);
    setIsRecording(false);
    setIsTranscribing(false);
  }

  function getDurationFormatted(millis: any) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round(minutes - minutesDisplay) * 60;
    const secondDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondDisplay}`;
  }

  function getRecordingLines() {
    return recordings.map((recordingLine: any, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text style={styles.fill}>
            {" "}
            Recording {index + 1} - {recordingLine.duration}
          </Text>
          <Button
            style={styles.button}
            onPress={() => recordingLine.sound.replayAsync()}
            title="Play"
          ></Button>
        </View>
      );
    });
  }

  function transcribeInterim() {
    clearInterval(intervalRef.current);
    setIsRecording(false);
  }

  async function transcribeRecording() {
    const uri = recording.getURI();

  }

  function handleTranscribeTimeoutChange(newTimeout: any) {
    setTranscribeTimout(newTimeout);
  }

  return (
    <View style={styles.root}>
      <View style={{ alignSelf: 'flex-end', margin: 30, backgroundColor: 'black', padding: 1 }}>
        <Text style={{ color: 'white' }}>
          CC
        </Text>
      </View>
      <View style={{ flex: 1, marginHorizontal: 20, alignItems: 'center' }}>
        {speechText == "" &&
          <View>
            <Text style={styles.title}>Start Speaking </Text>
            <Text style={styles.title}> To Activate Alli </Text>
          </View>
        }
        <ScrollView>
          <Text style={styles.title}>{speechText}</Text>
        </ScrollView>
      </View>
      <View style={styles.settingsSection}>
        <Image style={{ borderRadius: 80 }} source={logo} />
      </View>

      <View style={styles.container}>
        <TouchableOpacity
          style={[
            styles.circleButton,
            { backgroundColor: isRecording ? '#fff' : '#000' },
          ]}
          onPress={handleRecordButtonPress}>
          {isLoading ? (
            <ActivityIndicator size={32} color="#fff" />
          ) : isRecording ? (
            <FontAwesome name="microphone" size={32} color="#000" />
          ) : (
            <FontAwesome name="microphone" size={32} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
      <View >
      </View>
      {getRecordingLines()}
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
  }
});

const customPickerStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 8,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "blue",
    borderRadius: 8,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});