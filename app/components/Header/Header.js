import React, { Component, useEffect, useState } from 'react'
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import Menu from './Menu';
import Topbar from './Topbar';

const ScreenHeight = Dimensions.get("window").height;

const Header = ({ navigation, isBurgerMenuOpen, setBurgerMenuOpen }) => {
    
    const [visible, setVisible] = useState(isBurgerMenuOpen);
    const [redirectionState, setRedirection] = useState("")

    useEffect(() => {
      if (visible) {
        setBurgerMenuOpen(true);
      }
    }, [visible])

    useEffect(() => {
      if (redirectionState && !isBurgerMenuOpen) {
        navigation.navigate(redirectionState)
      }
    }, [isBurgerMenuOpen, redirectionState])

    return (
        <View style={{height: 75}}>
          <Topbar visible={visible} setVisible={setVisible} setBurgerMenuOpen={setBurgerMenuOpen} setRedirection={setRedirection} />
          { isBurgerMenuOpen ? <Menu setRedirection={setRedirection} visible={visible} setVisible={setVisible} setBurgerMenuOpen={setBurgerMenuOpen} isBurgerMenuOpen={isBurgerMenuOpen} /> : null }
        </View>
    )
}

const styles = StyleSheet.create({

});

export default Header