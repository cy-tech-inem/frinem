import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import useMutation from '../../hooks/useMutation';
import { API_URL } from '@env'


const Area = ({ product, openProductOverlay, loadProduct }) => {

    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setImage(product.image ? API_URL + "/images/" + product.image : "")
    }, [product.image])

    const openNextPage = () => {
        if (product.id) {
            openProductOverlay(product)
        } else {
            loadProduct();
        }
    }

    return (
        <View style={styles.productArea} onTouchEnd={openNextPage}>
            <Image 
                source={image ? {uri: image} : require('../../assets/add.png')} 
                style={image ? styles.image : {height: 50, width: 50} } 
                onLoadStart={() => setLoading(true)}
                onLoadEnd={() => setLoading(false)}
            /> 
            { loading ? 
                <ActivityIndicator size={"large"} color={"#0000FF"} /> : null
            }
            {/* <Text style={styles.name}>{ product.name }</Text>
            <Text style={styles.quantity}>Quantité: { product.quantity }</Text> */}
            <Text style={styles.name}>{ product.name ?  product.name : 'Ajouter un produit'}</Text>
            <Text style={styles.quantity}>{product.id ? "Quantité: " + product.quantity : null}</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    productArea: {
        width: '50%',
        height: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'black',
        padding: 10
    },
    image: {
        width: '70%',
        aspectRatio: 1/1,
        borderRadius: 10
    }, 
    name: {
        fontSize: 17,
        fontWeight: 'bold',
        textAlign: 'center'

    },
    quantity: {
        color: 'gray'
    }
    
})

export default Area;