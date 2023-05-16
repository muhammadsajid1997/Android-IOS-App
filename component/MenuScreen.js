import React, { useEffect, useRef, useState } from "react";
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
import { SelectCountry } from "react-native-element-dropdown";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout, setLogout } from "./Redux/authActions";
import { useDispatch, useSelector } from "react-redux";
var RNFS = require("react-native-fs");
import Sound from "react-native-sound";
import { useIsFocused, useNavigationState } from "@react-navigation/native";
import axios from "axios";
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
const MenuScreen = () => {
  const [value, setValue] = useState("");
  const [form, setForm] = useState({ email: null });
  const navigatation = useNavigation();
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const navigation = useNavigation();
  useEffect(() => {
    getProfile();
  }, []);

  const onChange = ({ name, value }) => {
    setForm({ ...form, [name]: value });

    if (value !== "") {
      setErrors((prev) => {
        return { ...prev, [name]: null };
      });
    }
  };

  const logoutCall = async () => {
    dispatch(setLogout());
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
    if (!/^[a-zA-Z]+(\s{1}[a-zA-Z]+)*$/.test(form.lastName)) {
      Alert.alert("Please enter valid lastName");
    } else if (!/^[a-zA-Z]+(\s{1}[a-zA-Z]+)*$/.test(form.city)) {
      Alert.alert("Please  enter valid city");
    } else if (!/^[a-zA-Z]+(\s{1}[a-zA-Z]+)*$/.test(form.state)) {
      Alert.alert("Please  enter valid state");
    } else {
      Submitdata(form);
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
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ marginTop: 10, width: "100%" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ marginLeft: 5 }}>
                  <TouchableOpacity
                    style={{ padding: 10 }}
                    onPress={() => navigation.goBack()}
                  >
                    <Ionicons name={"arrow-back"} size={25} />
                  </TouchableOpacity>
                </View>
                <View style={{ width: "80%", alignItems: "center" }}>
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
                </View>
              </View>

              {/* <CustomInput onSend={handleSend} isLoading={isLoading} /> */}
            </View>

            <View style={{ padding: 10 }}>
              <View style={styles.container}>
                <View
                  style={{ width: "90%", paddingVertical: 10 }}
                  onPress={() => {}}
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
                    detectHeyAlli = 0;
                    previous = "";
                    current = "";
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
                        <AntDesign name="right" size={22} color="#0f87cf" />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ flexDirection: "column" }}>
                  <TouchableOpacity
                    onPress={() => {
                      navigate("myApps");
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
                      <AntDesign name="appstore1" size={22} color="#0f87cf" />
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
                      navigate("Secratekey");
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
                      navigate("BussinessUpgrade");
                      // setModalVisible(false), navigate("Secratekey");
                    }}
                  >
                    <View style={{}}>
                      <FontAwesome name="building" size={22} color="#0f87cf" />
                    </View>

                    {/* <TouchableOpacity style={{ marginLeft: 10 }}> */}
                    <Text style={{ marginLeft: 10 }}>Business Upgrade</Text>
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
                  onPress={() => {}}
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
                onPress={() => {}}
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
  );
};
export default MenuScreen;

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
