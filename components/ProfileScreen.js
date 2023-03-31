import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-paper';
const ProfileScreen = () => {


    return (
        <View
            style={{
                flex: 1,
                paddingHorizontal: 20,
                marginTop: 20,

            }}>
                <View style={{height:50}}>
                    <TouchableOpacity>
                        </TouchableOpacity>

                </View>
            <ScrollView>
                <View style={{alignItems:'center',justifyContent:'center'}}>
                <Text style={{fontSize:25}}>Profile Details</Text>
                </View>
               
                <View style={{ padding: 5 }}>
                    <TextInput
                        label="first name"
                        style={{
                            paddingHorizontal: 5,
                            fontSize: 15,
                        }}
                        mode="outlined"
                       

                    />

                </View>
                <View style={{ padding: 5 }}>
                    <TextInput
                        label="last name"
                        mode="outlined"
                    />

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

                </View>

            </ScrollView>

            {/* <Text>ProfileScreen! 🎉</Text>  */}



        </View>
    );
};

export default ProfileScreen;