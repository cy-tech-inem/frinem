import React, { Component, useEffect, useState } from 'react'
import { StyleSheet, View, Image, Text } from 'react-native';


const BurgerMenu = ({ setVisible, visible }) => {

    return (
        <View style={styles.burgerMenu} onTouchEnd={() => setVisible(!visible) }>
            <Image
                source={require('../../assets/burgerMenu.png')} 
                style={styles.burgerMenuIcon}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    burgerMenu: {
        textAlign: 'center',
        height: 55,
        width: 55,
        position: 'absolute',
        top: 10,
        left: 10,
    },
    burgerMenuIcon : {
        position: 'absolute',
        width: 55,
        height: 55,
        tintColor: "white"
    }
});

export default BurgerMenu