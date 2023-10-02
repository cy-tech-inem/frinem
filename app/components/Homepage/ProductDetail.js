import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View, Dimensions } from 'react-native';
import useMutation from '../../hooks/useMutation';
import ButtonClassic from '../Global/ButtonClassic';
import { API_URL } from '@env'


const ProductDetail = ({ product, removeFromArea }) => {
    const [mutate, state] = useMutation();

    const [image, setImage] = useState("");

    useEffect(() => {
        setImage(product.image ? API_URL + "/images/" + product.image : "")
    }, [product.image])


    return (
        <View style={styles.productDetail}>
            <Image source={image ? {uri: image} : require('../../assets/adaptive-icon.png')} style={styles.imageDetail}></Image>
            <Text style={styles.nameDetail}>{ product.name }</Text>
            <Text style={styles.quantityDetail}>{product.id ? "Quantité: " + product.quantity : null}</Text>
            <ButtonClassic style={styles.buttonRemove} text={"Retirer"} action={removeFromArea} />
        </View>
    )
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    productDetail: {
        width: windowWidth * 80 / 100,
        height: windowHeight * 60 / 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    imageDetail: {
        height: '60%',
        aspectRatio: 1/1,
        borderRadius: 10
    }, 
    nameDetail: {
        fontSize: 25,
        fontWeight: 'bold'

    },
    quantityDetail: {
        color: 'gray',
        fontSize: 17,
    }
})

export default ProductDetail;