import React, { useEffect } from 'react';
import { StyleSheet, Dimensions, Text, View, StatusBar, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KEY_TOKEN } from "@env"

const Splash = ({ route, navigation }) => {
    useEffect(() => {
        setTimeout(function(){
            try {
                AsyncStorage.getItem(KEY_TOKEN).then((token) => {
                    if (token) {
                        navigation.replace('Homepage')
                    } else {
                        navigation.replace('Password')
                    }
                }
                )
                .catch(() => {
                    console.log('error');
                })
            } catch (err) {
                navigation.replace('Password')
            }        
        }, 1500)
    }, [])

    return (
        <View style={styles.container}>
            <Image
                style={styles.iconSplash}
                source={require('../assets/logo.png')}
            >

            </Image>
            <Text
                style={styles.textSplash}
            >
                FRINEM
            </Text>
        </View>
    )
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        top: StatusBar.currentHeight,
        width: windowWidth,
        height: windowHeight - StatusBar.currentHeight,
        backgroundColor: 'orange',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'

    }, 
    iconSplash: {
        height: '20%',
        aspectRatio: 1/1,
        tintColor: 'white'
    },
    textSplash: {
        color: 'white',
        fontSize: 45, 
        fontWeight: 'bold'
    }

})

export default Splash;