//
// Copyright 2020-2021 Picovoice Inc.
//
// You may not use this file except in compliance with the license. A copy of the license is located in the "LICENSE"
// file accompanying this source.
//
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
// an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.
//

import React, { Component } from "react";
import {
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  AppState,
} from "react-native";
import { StyleSheet, Text, View } from "react-native";

import {
  PorcupineManager,
  PorcupineErrors,
} from "@picovoice/porcupine-react-native";
import Tts from "react-native-tts";

type Props = {};
type State = {
  buttonText: string;
  buttonDisabled: boolean;
  isListening: boolean;
  isError: boolean;
  errorMessage: string;
};

export default class Voice extends Component<Props, State> {
  _porcupineManager: PorcupineManager | undefined;
  _accessKey: string =
    "qEufDJXOv4cnT4g4I3+ksyBgewy2MF0/320eWQAZ8QuQKkwILg4T1Q=="; // AccessKey obtained from Picovoice Console (https://console.picovoice.ai/)

  constructor(props: Props) {
    super(props);
    this.state = {
      buttonText: "Start",
      buttonDisabled: false,
      isListening: false,
      isError: false,
      errorMessage: null,
    };
  }

  async componentDidMount() {
    this._loadNewKeyword("hey alli");
  }

  componentWillUnmount() {
    if (this.state.isListening) {
      this._stopProcessing();
    }
    this._porcupineManager?.delete();
  }

  async _startProcessing() {
    this.setState({
      buttonDisabled: true,
    });

    let recordAudioRequest;
    if (Platform.OS === "android") {
      recordAudioRequest = this._requestRecordAudioPermission();
    } else {
      recordAudioRequest = new Promise(function (resolve, _) {
        resolve(true);
      });
    }

    recordAudioRequest.then((hasPermission) => {
      if (!hasPermission) {
        console.error(
          "Required permissions (Microphone) we're not found. Please add to platform code."
        );
        this.setState({
          buttonDisabled: false,
        });
        return;
      }

      this._porcupineManager?.start().then((didStart) => {
        if (didStart) {
          this.setState({
            buttonText: "Stop",
            buttonDisabled: false,
            isListening: true,
          });
        }
      });
    });
  }

  _stopProcessing() {
    this.setState({
      buttonDisabled: true,
    });

    this._porcupineManager?.stop().then((didStop) => {
      if (didStop) {
        this.setState({
          buttonText: "Start",
          buttonDisabled: false,
          isListening: false,
        });
      }
    });
  }

  _toggleListening() {
    if (this.state.isListening) {
      this._stopProcessing();
    } else {
      this._startProcessing();
    }
  }

  async _loadNewKeyword(keyword: "hey alli") {
    if (this.state.isListening) {
      this._stopProcessing();
    }
    this._porcupineManager?.delete();
    console.log(keyword, "speack");

    try {
      this._porcupineManager = await PorcupineManager.fromKeywordPaths(
        this._accessKey,
        ["resource/hey-alli_en_android_v2_2_0.ppn"],
        (keywordIndex: number) => {
          if (keywordIndex >= 0) {
            console.log("match hey alli");
            Tts.speak("hello alli");
          }
        },
        (error) => {
          this._stopProcessing();
          this.setState({
            isError: true,
            errorMessage: error.message,
          });
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

      this.setState({
        isError: true,
        errorMessage: errorMessage,
      });
    }
  }

  async _requestRecordAudioPermission() {
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
      this.setState({
        isError: true,
        errorMessage: err.toString(),
      });
      return false;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <View style={styles.statusBar}>
          <Text style={styles.statusBarText}>Porcupine</Text>
        </View>
        <View style={styles.keyword}>
          <Text style={styles.keywordText}>Keyword</Text>
          <View style={styles.picker}>
            <Text>Hey Alli</Text>
          </View>
        </View> */}

        <View style={styles.button}>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => this._toggleListening()}
            disabled={this.state.buttonDisabled || this.state.isError}
          >
            <Text style={styles.buttonText}>{this.state.buttonText}</Text>
          </TouchableOpacity>
        </View>
        {/* {this.state.isError && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{this.state.errorMessage}</Text>
          </View>
        )} */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    // backgroundColor: "#F5FCFF",
  },
  subContainer: {
    flex: 1,
    justifyContent: "center",
  },
  statusBar: {
    flex: 0.4,
    backgroundColor: "#377DFF",
    justifyContent: "flex-end",
  },
  statusBarText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    marginLeft: 15,
    marginBottom: 15,
  },
  keyword: {
    flex: 1,
    paddingTop: "10%",
  },
  keywordText: {
    color: "#666666",
    marginLeft: 15,
    marginBottom: 5,
  },
  picker: {
    width: "90%",
    height: "40%",
    alignContent: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    width: 250,
    // height: 100,
    // backgroundColor: "",
  },
  buttonStyle: {
    width: "50%",
    // height: "50%",
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "#377DFF",
    borderRadius: 100,
  },
  buttonText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  itemStyle: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  footerView: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 25,
  },
  instructions: {
    textAlign: "center",
    color: "#666666",
  },
  errorBox: {
    backgroundColor: "red",
    borderRadius: 5,
    margin: 20,
    padding: 20,
    textAlign: "center",
  },
  errorText: {
    color: "white",
    fontSize: 16,
  },
});
