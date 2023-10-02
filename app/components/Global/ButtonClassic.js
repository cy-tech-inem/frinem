import React, { useEffect, useState } from 'react';
import {StyleSheet, Text, View } from 'react-native';

const ButtonClassic = ({ text, action }) => {
    return (
        <View onTouchEnd={action}>
            <Text style={styles.button} >{ text }</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        color: 'white',
        backgroundColor: "orange",
        borderRadius: 5,
        fontSize: 20,
        paddingHorizontal: 20,
        paddingVertical: 10
    }
})

export default ButtonClassic;
