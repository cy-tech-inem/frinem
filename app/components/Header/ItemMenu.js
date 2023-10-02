import React, { Component, useEffect, useState } from 'react'
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';


const ItemMenu = ({ setRedirection, image, text, redirection, setBurgerMenuVisible }) => {

    const redirectTo = () => {
        setRedirection(redirection);
        setBurgerMenuVisible(false);
    }

    return (
        <View style={styles.item} onTouchEnd={redirectTo}>
            <Image source={image} style={styles.itemIcon}/>
            <Text style={styles.itemText}>{text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 15,
        color: 'gray',

    },
    itemIcon:{
        marginRight: 10,
        tintColor: "gray"
    },
    itemText:{
        fontSize: 20,
        color: 'gray',
        fontWeight: 'bold'
    }
});

export default ItemMenu