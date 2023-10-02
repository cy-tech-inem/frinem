import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View, Dimensions } from 'react-native';
import ButtonClassic from '../components/Global/ButtonClassic';
import Header from '../components/Header/Header';

const LoadProduct = ({ route, navigation, isBurgerMenuOpen, setBurgerMenuOpen }) => {
    const { areaId } = route.params

    const createProduct = () => {
        if (!isBurgerMenuOpen) {
            navigation.navigate("CreateProduct", { areaId: areaId })
        }
    }
    const listProducts = () => {
        if (!isBurgerMenuOpen) {
            navigation.navigate("ListProducts", { areaId: areaId })
        }
    }

    return (
        <View style={styles.container}>
            <Header navigation={navigation} isBurgerMenuOpen={isBurgerMenuOpen} setBurgerMenuOpen={setBurgerMenuOpen} />
            <View style={styles.choice}>
                <ButtonClassic text={'Créer un nouveau produit'} action={createProduct} />
                <Text style={styles.separator}>--- ou ---</Text>
                <ButtonClassic text={'Voir la liste des produits connus'} action={listProducts} />
            </View>
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
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    choice: {
        width: '100%',
        height: windowHeight - (StatusBar.currentHeight + 75), 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    separator: {
        marginVertical: 70,
        fontSize: 20,
        color: 'gray'
    }
})

export default LoadProduct;