import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

const ErrorText = ({ text }) => {
    return (
        <Text style={{color: '#ff0000'}}>{ text }</Text>
    )
}

export default ErrorText;
