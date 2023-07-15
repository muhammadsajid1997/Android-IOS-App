import React, { useState, useRef } from "react";
import { View, StyleSheet, Text, SafeAreaView } from "react-native";
import TextEffect from "../../component/Shared/typeEffect";
// import { LinearGradient } from "expo-linear-gradient";
import LinearGradient from "react-native-linear-gradient";

const ChatScreen = ({ TypeText, ReceivedText }) => {
  return (
    <View style={styles.container}>
      <SafeAreaView />
      <View style={styles.messageList}>
        {TypeText && (
          <View style={styles.messageContainer}>
            {/* <LinearGradient
                        locations={[0.5, 2, 0.8]}
                        colors={["#8e9eab", "#eef2f3", "#8e9eab"]}
                        style={styles.messageBubble}>
                        <Text style={styles.messageText}>{TypeText}</Text>
                    </LinearGradient> */}
          </View>
        )}

        {ReceivedText && (
          <View style={styles.messageContainerMe}>
            <LinearGradient
              locations={[0.5, 2, 0.8]}
              colors={["#1FA2FF", "#12D8FA", "#1FA2FF"]}
              style={styles.messageBubbleMe}
            >
              <Text style={{ ...styles.messageText, color: "white" }}>
                <TextEffect text={ReceivedText?.replace(/\s+/g, " ")} />
              </Text>
            </LinearGradient>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#f1f1f1",
    width: "100%",
  },
  messageList: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "flex-end",
  },
  messageContainerMe: {
    flexDirection: "row-reverse",
    marginBottom: 10,
    alignItems: "flex-end",
  },
  messageBubble: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    maxWidth: "80%",
  },
  messageBubbleMe: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    maxWidth: "80%",
  },
  messageText: {
    fontSize: 14,
    color: "#000",
  },
});

export default ChatScreen;
