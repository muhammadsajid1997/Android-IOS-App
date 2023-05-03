import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ToastAndroid,
  TextInput,
  Alert,
  PermissionsAndroid,
  Platform,
  ListItem,
  Modal,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Contacts from "react-native-contacts";
const ShareScreen = () => {
  const navigation = useNavigation();
  const [userphoneNumber, setUserphoneNumber] = useState("");
  const [userEmail, setuserEmail] = useState("");
  let [contacts, setContacts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const phoneAPI = async () => {
    setIsLoading(true);
    const token = await AsyncStorage.getItem("token");
    axios
      .post(
        "https://heyalli.azurewebsites.net/api/Invite/user/phone",
        {
          PhoneNumber: userphoneNumber,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("API RESPonse", response);
        if (response.data) {
          setIsLoading(false);
          Alert.alert(response.data);
          //   console.log("erroe");
        } else {
          Alert.alert("Invalid PhoneNumber");
          setIsLoading(false);
          //   console.log("erroe");
        }
        // navigation.navigate("Home", { screen: "home" });
      })
      .catch((error) => {
        Alert.alert(error.response.data);
        setIsLoading(false);
        console.log("axios error:", error.response.data);
      });
  };

  const EmailAPI = async () => {
    setIsLoading(true);
    const token = await AsyncStorage.getItem("token");
    axios
      .post(
        "https://heyalli.azurewebsites.net/api/Invite/user/email",
        {
          email: userEmail,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("API RESPonse", response);
        if (response.data) {
          setIsLoading(false);
          Alert.alert(response.data);
          //   console.log("erroe");
        } else {
          Alert.alert("Invalid PhoneNumber");
          setIsLoading(false);
          //   console.log("erroe");
        }
        // navigation.navigate("Home", { screen: "home" });
      })
      .catch((error) => {
        Alert.alert("Please Enter Valid Email");
        setIsLoading(false);
        console.log("axios error:", error.response.data);
      });
  };

  const contactsget = async () => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: "Contacts",
      message: "This app would like to view your contacts.",
      buttonPositive: "Please accept bare mortal",
    })
      .then((res) => {
        console.log("Permission: ", res);
        setIsLoading(true);
        Contacts.getAll()
          .then((contacts) => {
            setContacts(contacts);
            setModalVisible(true);
            setIsLoading(false);
            // work with contacts
            console.log(contacts);
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((error) => {
        console.error("Permission error: ", error);
      });
  };

  return (
    <View style={styles.container}>
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
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>
            Invite Referral Code
          </Text>
        </View>
      </View>
      <View style={{ paddingVertical: 40 }}>
        <View style={{ ...styles.SectionStyle }}>
          {/* <MaterialIcons name="email" style={{ top: 12, right: 4 }} size={16} color="#b1b6c6" /> */}

          <TextInput
            style={styles.inputStyle}
            onChangeText={(userphoneNumber) =>
              setUserphoneNumber(userphoneNumber)
            }
            value={userphoneNumber}
            placeholder="Enter phone number" //dummy@abc.com
            placeholderTextColor="#9ea3b7"
            autoCapitalize="none"
            keyboardType="phone-pad"
            returnKeyType="next"
            underlineColorAndroid="#f000"
            blurOnSubmit={false}
          />
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              //   marginRight: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                contactsget();
              }}
            >
              <AntDesign name={"contacts"} size={22} color="#0f87cf" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontWeight: "bold" }}>OR</Text>
        </View>

        <View style={{ ...styles.SectionStyle }}>
          {/* <MaterialIcons name="email" style={{ top: 12, right: 4 }} size={16} color="#b1b6c6" /> */}

          <TextInput
            style={styles.inputStyle}
            onChangeText={(email) => setuserEmail(email)}
            placeholder="Enter email address" //dummy@abc.com
            placeholderTextColor="#9ea3b7"
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
            underlineColorAndroid="#f000"
            blurOnSubmit={false}
          />
        </View>
      </View>

      <TouchableOpacity
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#14a5f4",
          marginHorizontal: 18,
          borderRadius: 6,
        }}
        activeOpacity={0.5}
        onPress={() => {
          if (userphoneNumber == "" && userEmail == "") {
            Alert.alert("Please enter Phonenumber or Email");
          } else if (userphoneNumber) {
            phoneAPI();
          } else if (userEmail) {
            if (
              /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail)
            ) {
              EmailAPI();
            } else {
              Alert.alert("Please enter valid Email");
            }
          } else {
            phoneAPI();
          }
        }}
      >
        {/* <Image style={{ borderRadius: 10, marginVertical: 10 }} source={signInButton}>
              </Image> */}

        <Text style={styles.buttonTextStyle}>Share</Text>
      </TouchableOpacity>
      {isLoading ? (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <TouchableOpacity
            style={[styles.circleButton, { backgroundColor: "grey" }]}
            disabled
          >
            <ActivityIndicator size={32} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : (
        <View></View>
      )}

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          //   Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
          setIsLoading(false);
        }}
      >
        <FlatList
          data={contacts}
          renderItem={(contact) => {
            return (
              <View style={{ alignItems: "center" }}>
                <TouchableOpacity
                  style={{ width: "80%" }}
                  onPress={() => {
                    setUserphoneNumber(contact.item.phoneNumbers[0].number);
                    setModalVisible(false);
                  }}
                >
                  <View
                    style={{
                      //   flex: 1,
                      //   padding: 10,
                      alignItems: "center",
                      justifyContent: "center",
                      paddingVertical: 10,
                      borderWidth: 1,
                      borderRadius: 10,
                      marginTop: 10,
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>
                      {contact.item.phoneNumbers.length == 0
                        ? ""
                        : contact.item.phoneNumbers[0].number}
                    </Text>

                    <Text style={{ fontSize: 16 }}>
                      {contact.item.displayName == undefined
                        ? null
                        : contact.item.displayName}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
          keyExtractor={(item) => item.recordID}
        />
      </Modal>

      {/* <TouchableOpacity
        style={{
          margin: 10,
          padding: 15,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#00ff00aa",
          borderRadius: 12,
        }}
        onPress={() => {
          _onPress_getInstallReferrerInfo();
        }}
      >
        <Text style={{ fontSize: 18, color: "#ff00ffcc" }}>
          Get referral Data
        </Text>
      </TouchableOpacity> */}
      {/* <FlatList
        data={referralData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        contentContainerStyle={styles.listContentContainer}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  list: {
    flex: 1,
  },
  listContentContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  avatarContainer: {
    padding: 10,
    backgroundColor: "#e6e6e6",
    borderRadius: 50,
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  infoContainer: {
    flex: 0.55,
    paddingVertical: 10,
    paddingRight: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
  SectionStyle: {
    flexDirection: "row",
    height: 40,
    // top: -100,
    // marginTop: 20,
    marginLeft: "5%",
    marginRight: "5%",
    marginVertical: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 0.2,
    borderRadius: 2,
    borderColor: "#E5E4E2",
    backgroundColor: "#e9ebf2",
  },
  inputStyle: {
    flex: 1,
    color: "black",
    marginLeft: 5,
  },
  buttonTextStyle: {
    color: "white",
    paddingVertical: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  circleButton: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ShareScreen;
