import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";

const ChatInput = ({ onSend, isLoading, }) => {
    const [text, setText] = useState('');

    const handleSend = () => {
        onSend(text);
        setText('');
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type your message here..."
                    value={text}
                    onChangeText={setText}
                    onSubmitEditing={handleSend}
                    blurOnSubmit={false}
                    returnKeyType="send"
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={isLoading}>
                    {!isLoading ? <FontAwesome name={"send"} size={18} color={"#808080"} />
                        :
                        <ActivityIndicator size={18} color="#808080" />}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f1f1f1',
        padding: 10,
        width: "100%"
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 10,
    },
    input: {
        flex: 0.9,
        height: 40,
    },
    sendButton: {
        position: 'absolute',
        right: 17,
    },
    sendButtonText: {
        color: '#007AFF',
        fontWeight: 'bold',
    },
});

export default ChatInput;