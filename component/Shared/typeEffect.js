import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';

const TypingText = ({ text, typingDelay = 30 }) => {
  const [currentText, setCurrentText] = useState('');

  useEffect(() => {
    let timer = null;
    let i = 0;
    const typing = () => {
      if (i < text.length) {
        setCurrentText(text.substring(0, i + 1));
        i++;
        timer = setTimeout(typing, typingDelay);
      }
    };
    typing();
    return () => clearTimeout(timer);
  }, [text]);

  return <Text >{currentText}</Text>;
};

export default TypingText;