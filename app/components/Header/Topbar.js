import React, { Component, useEffect, useState } from 'react'
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import BurgerMenu from './BurgerMenu';


const Topbar = ({ visible, setVisible, setRedirection }) => {
    const redirect = () => {
      setRedirection("Homepage");
    }
    return (
        <View style={styles.header}>
          <Text style={styles.appName} onPress={redirect}>FRINEM</Text>
          <BurgerMenu setVisible={setVisible} visible={visible} />
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        zIndex: 5,
      	height: 75,
      	width: '100%',
      	backgroundColor: 'orange',
      	display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    }, 
    appName:{
        width : '100%',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        color: 'white',
        fontSize : 30,
		fontWeight : 'bold'
    },
  });

export default Topbar