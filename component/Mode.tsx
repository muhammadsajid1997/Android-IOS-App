import React from "react";
import { View, Text, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
// import RNPickerSelect from "react-native-picker-select";

const Mode = ({
  onModelChange,
  transcribeTimeout,
  onTranscribeTimeoutChanged,
  selectedModel,
  setSelectedModel,
  setOpen,
  setModelOptions,
  modelOptions,

  open
}: any) => {
  function onModelChangeLocal(value: any) {
    onModelChange(value);
  }



  function onTranscribeTimeoutChangedLocal(event: any) {
    onTranscribeTimeoutChanged(event.target.value);
  }

  return (
    <View>
      <Text style={styles.title}>Model Size</Text>
      <View style={{ flexDirection: "row" }}>
        {/* <DropDownPicker
        open={open}

        setOpen={setOpen}
        setValue={setSelectedModel}
        value={selectedModel} //companyValue
        items={modelOptions}
        setItems={setModelOptions}
          
       
        placeholder="Select model"
        // placeholderStyle={styles.placeholderStyles}
        // loading={loading}
        // activityIndicatorColor="#5188E3"
        // searchable={true}
        searchPlaceholder="Search your country here..."
        // onOpen={onCompanyOpen}
        onChangeValue={(value) => onModelChangeLocal(value)}
        //  zIndex={1000}
        // zIndexInverse={3000}



        //   onValueChange={(value) => onModelChangeLocal(value)}
          useNativeAndroidPickerStyle={false}
         
          style={customPickerStyles}
        /> */}
      </View>
      <View>
        <Text style={styles.title}>Timeout :{transcribeTimeout}</Text>
      </View>
    </View>
  );
};

export default Mode;
const styles = StyleSheet.create({
  title: {
    fontWeight: "200",
    fontSize: 25,
    float: "left",
  },
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