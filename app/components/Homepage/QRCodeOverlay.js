import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View, Dimensions } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import jwt_decode from "jwt-decode"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { KEY_TOKEN } from '@env'


const QRCodeOverlay = ({  }) => {

    const [name, setName] = useState("no$name$in$token")
    const windowWidth = Dimensions.get('window').width;

    const getNameFromToken = () => {
        return AsyncStorage.getItem(KEY_TOKEN).then(token => {
            if (token) {
                return jwt_decode(token)?.name
            } else {
                return "no$name$in$token"
            }
        })
    }

    useEffect(()=> {
        getNameFromToken().then((res) => setName(res) );
    }, [])

    return (
        <QRCode value={name} size={windowWidth*70/100} />
    )
}


const styles = StyleSheet.create({
    productArea: {
        width: 250,
        height: 250,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'black',
    },
    
})

export default QRCodeOverlay;