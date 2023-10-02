import React, { Component, useEffect, useRef, useState } from 'react'
import { StyleSheet, View, Image, Text, Dimensions, StatusBar, Animated, Easing } from 'react-native';
import ItemMenu from './ItemMenu';


const items = [
    {
        image: require("../../assets/home.png"),
        text: "Accueil",
        redirection: "Homepage"
    },
    {
        image: require("../../assets/grid.png"),
        text: "Liste des produits",
        redirection: "ListProducts"
    }
]

const ScreenHeight = Dimensions.get("window").height - StatusBar.currentHeight;
const ScreenWidth = Dimensions.get("window").width;

const Menu = ({ setRedirection, setBurgerMenuOpen, isBurgerMenuOpen, visible, setVisible }) => {
    const translateX = useRef(new Animated.Value(-ScreenWidth)).current
    const fade = useRef(new Animated.Value(0)).current

    const [isAnimation, setIsAnimation] = useState(true);

    useEffect(() => {
        if (isBurgerMenuOpen) {
            setVisible(true);
        }
    }, [isBurgerMenuOpen])
    
    useEffect(() => {
        if (visible) {
            Animated.timing(translateX, { 
                toValue: 0, 
                duration: 600,
                useNativeDriver: true,
                easing: Easing.bounce
            }).start(() => setIsAnimation(false))
        }
    }, [translateX, visible])

    useEffect(() => {
        if (visible) {
            Animated.timing(fade, { 
                toValue: 0.5, 
                duration: 200,
                useNativeDriver: true,
                easing: Easing.in
            }).start()
        }
    }, [fade, visible])

    useEffect(() => {
        if (!visible) {
            Animated.timing(translateX, { 
                toValue: -ScreenWidth, 
                duration: 300,
                useNativeDriver: true,
                easing: Easing.ease
            }).start(() => {setBurgerMenuOpen(false)})
        }
    }, [translateX, visible])

    useEffect(() => {
        if (!visible) {
            Animated.timing(fade, { 
                toValue: 0, 
                duration: 200,
                useNativeDriver: true,
                easing: Easing.in,
            }).start()
        }
    }, [fade, visible])

    const closeBurgerMenu = () => {
        setIsAnimation(true);
        setVisible(false)
    }

    return (
        <View style={styles.menu}>
            
            <Animated.View style={[styles.background, {opacity: fade}]}>
                <View style={styles.backdrop} onTouchEnd={closeBurgerMenu}></View>
            </Animated.View>

            { !visible || isAnimation ? (
                <Animated.View style={[styles.itemsList, {translateX: translateX}]}>
                    {
                        items.map((item, index) => {
                            return <ItemMenu key={index} image={item.image} text={item.text} redirection={item.redirection}/>
                        })
                    }
                </Animated.View>
            ) : (
                <View style={styles.itemsList}>
                    {
                        items.map((item, index) => {
                            return <ItemMenu setRedirection={setRedirection} key={index} image={item.image} text={item.text} redirection={item.redirection} setBurgerMenuVisible={setVisible} />
                        })
                    }
                </View> 
            )}
        </View>
    )
}


const styles = StyleSheet.create({
    menu:{
		flex:1,
        width : ScreenWidth,
		height: ScreenHeight,
		position: 'absolute',
		top: 75,
        zIndex:4,
    }, 
    itemsList: {
        width: 5*ScreenWidth/7, 
        backgroundColor: "#fff",
		height: ScreenHeight,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    background: {
        position: 'absolute',
        width: ScreenWidth,
		height: ScreenHeight,
        backgroundColor: "#000", 
    },
    backdrop: {
        width: 2*ScreenWidth/7, 
        left: 5*ScreenWidth/7, 
		height: ScreenHeight,
        backgroundColor: "#000",
        opacity: 0
    }
});

export default Menu