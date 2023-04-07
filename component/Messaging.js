import React, { useState } from "react";
import { TextInput, View } from "react-native";
export default function Messaging(){

    const [value,setValue]=useState("");
    return(
        <View style={{marginBottom:20,borderWidth:1,marginHorizontal:10, width:'95%', borderRadius:20}}>

            <TextInput style={{margin:20}} placeholder="start chatting with Alli"    value ={value}/>
            
        </View>
    )
}