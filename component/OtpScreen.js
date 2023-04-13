import React, { useState, createRef } from 'react';
import {
    StyleSheet,
    TextInput,
    View,
    Text,
    ScrollView,
    Image,
    Keyboard,
    TouchableOpacity,
    KeyboardAvoidingView,
    SafeAreaView
} from 'react-native';
import axios from "axios"
import logoBack from './Images/logoback.png'
const OtpScreen = ({ navigation }) => {
    const [verifyOtp, setVerifyOtp] = useState('');
    const passwordInputRef = createRef();

    
   const userOtp=()=>{
        console.log(verifyOtp)
        // axios.
    }


    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <SafeAreaView/>
            <ScrollView
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <View>
          <KeyboardAvoidingView enabled>
            <View>
              <Image style={{ width: '100%' }} source={logoBack} />
            </View>
            <View style={{ ...styles.SectionStyle }}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(verifyOtp) =>
                    setVerifyOtp(verifyOtp)
                }
                placeholder="Enter your opt" //dummy@abc.com
                placeholderTextColor="#9ea3b7"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() =>
                  passwordInputRef.current &&
                  passwordInputRef.current.focus()
                }
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            </View>
          
            {/* {errortext != '' ? ( <Text style={styles.errorTextStyle}>  {errortext}</Text> ) : null} */}

            <TouchableOpacity
              style={{ justifyContent: 'center', flex: 1, alignItems: 'center',backgroundColor:"#14a5f4",marginHorizontal:18, borderRadius:6 }}
              activeOpacity={0.5}
              onPress={() => {
                // props.navigation.navigate("home")
                navigation.navigate("Home", { screen: "home" })
                userOtp()
              }}>
              <Text style={styles.buttonTextStyle}>Verify otp</Text>
            </TouchableOpacity>

          
            {/* <Text
              style={styles.registerTextStyle}
              onPress={() => navigation.navigate('signUp')}>
              Don't have a Account ? <Text style={{ color: '#4d97f0' }}>Sign Up</Text>
            </Text> */}

          </KeyboardAvoidingView>

        </View>

      </ScrollView>

        </View>
    );
};
export default OtpScreen;

const styles = StyleSheet.create({
    mainBody: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
        alignContent: 'center',
    },
    SectionStyle: {
        flexDirection: 'row',
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
        borderColor: '#E5E4E2',
        backgroundColor: "#e9ebf2"
    },
    buttonStyle: {
        backgroundColor: '#4d97f0',
        borderWidth: 0,
        color: '#FFFFFF',
        borderColor: '#7DE24E',
        height: 40,
        alignItems: 'center',
        borderRadius: 30,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 0,
        marginBottom: 25,
    },
    buttonTextStyle: {
        color: 'white',
        paddingVertical: 10,
        fontSize: 18,
        fontWeight: "bold"

    },
    inputStyle: {
        flex: 1,
        color: 'black',
        marginLeft: 5
    },
    registerTextStyle: {
        color: 'black',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 14,
        alignSelf: 'center',
        padding: 10,
    },
    errorTextStyle: {
        color: 'red',
        textAlign: 'center',
        fontSize: 14,
    },
    socialMediaIcon: {
        height: 35,
        width: 35,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'grey',
        margin: 10
    },
    socialMediaImg: { height: 20, width: 20, alignSelf: 'center', marginTop: 6 }
});