import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View, Dimensions } from 'react-native';
import useMutation from '../../hooks/useMutation';
import ButtonClassic from '../Global/ButtonClassic';
import { API_URL } from '@env'


const ProductValidation = ({ product, validateProduct }) => {
    const [mutate, state] = useMutation();

    const [image, setImage] = useState("");

    useEffect(() => {
        setImage(product.image ? API_URL + "/images/" + product.image : "")
    }, [product.image])

    return (
        <View style={styles.productValidation}>
            <Image source={image ? {uri: image} : require('../../assets/adaptive-icon.png')} style={styles.imageValidation}></Image>
            <Text style={styles.nameValidation}>{ product.name }</Text>
            <Text style={styles.quantityValidation}>{product.id ? "Quantité: " + product.quantity : null}</Text>
            <ButtonClassic text={"Choisir"} action={validateProduct} style={styles.buttonValidation}/>
        </View>
    )
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    productValidation: {
        width: windowWidth * 80 / 100,
        height: windowHeight * 60 / 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    imageValidation: {
        height: '60%',
        aspectRatio: 1/1,
        borderRadius: 10
    }, 
    nameValidation: {
        fontSize: 25,
        fontWeight: 'bold'

    },
    quantityValidation: {
        color: 'gray',
        fontSize: 17,
    }
    
})

export default ProductValidation;