import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Image, Text, TouchableOpacity, Dimensions } from 'react-native';
import { API_URL } from '@env'
import { ScreenWidth } from 'react-native-elements/dist/helpers';


const Product = ({ product, openProductOverlay }) => {

    const [image, setImage] = useState("");

    useEffect(() => {
        setImage(product.image ? API_URL + "/images/" + product.image : "")
    }, [product.image])

    return (
        <View style={styles.mainContainer} onTouchEnd={openProductOverlay}>
            <Image source={image ? {uri: image} : require('../../assets/adaptive-icon.png')} style={styles.productImage}></Image>
            <Text style={styles.productName}>{ product.name }</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    mainContainer: {
        zIndex: 1,
        backgroundColor: '#FFF',
        width: ScreenWidth / 3 - 15,
        height: ScreenWidth / 3 - 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginVertical: 22.5,
        // marginBottom: 22.5,
        marginHorizontal: 5
    },
    productImage: {
        height: '100%',
        aspectRatio: 1/1,
        borderRadius: 10,
    },
    productName: {
        textAlign: 'center',
        color:'gray',
        marginTop: 5
    }
});

export default Product