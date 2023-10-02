import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View, Dimensions, RefreshControl, ActivityIndicator } from 'react-native';
import Product from '../components/ListProducts/Product';
import useMutation from '../hooks/useMutation';
import Header from '../components/Header/Header';
import { Overlay } from 'react-native-elements';
import ProductValidation from '../components/ListProducts/ProductValidation';
import ErrorText from '../components/Global/ErrorText';
import ProductModify from '../components/ListProducts/ProductModify';

const ListProducts = ({ route, navigation, isBurgerMenuOpen, setBurgerMenuOpen }) => {
    const { areaId } = route.params ? route.params : { areaId: null };
    const [mutate, state] = useMutation();
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState(null);
    const [isProductOverlayVisible, setProductOverlayVisible] = useState(false);
    const [error, setError] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
      }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadProducts();
        wait(1000).then(() => setRefreshing(false));
    }, []);

    const openProductOverlay = (product) => {
        setProduct(product);
        setProductOverlayVisible(true);
    }

    const validateProduct = () => {
        setProductOverlayVisible(false);
        mutate("/areas/" + areaId + "/products/" + product.id, "PUT").then(res => {
            if (res.error) {
                setError(res.error.message)
            } else if (res.data) {
                setError("");
                navigation.navigate("Homepage", { reload: true })
            } else {
                setError("La réponse reçue n'est pas dans le bon format");
            }
        })
    }

    const loadProducts = () => {
        mutate("/products", "GET").then(res => {
            if (res.error) {
                setError(error.message)
            } else if (res.data) {
                setError("")
                setProducts(res.data.products)
            } else {                
                setError("La réponse reçue n'est pas dans le bon format");
            }
        })
    }

    const deleteProduct = () => {
        mutate("/products/" + product.id, "DELETE").then(res => {
            if (res.error) {
                setError(res.error.message)
            } else if (res.data) {
                setError("");
                loadProducts();
            } else {
                setError("La réponse reçue n'est pas dans le bon format");
            }
            setProductOverlayVisible(false)
        })
    }
    
    useEffect(() => {
        loadProducts()
    }, [])
    
    return (
        <View style={styles.container}>
            <Header navigation={navigation} isBurgerMenuOpen={isBurgerMenuOpen} setBurgerMenuOpen={setBurgerMenuOpen} />
            { state.loading ? <ActivityIndicator size={"large"} color={"#0000FF"} /> : null }
            <View style={styles.allProducts}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        />
                    }>
                    <View style={styles.allProductsScrollView}>
                {
                    products.map(product => {
                        return (
                            <Product key={product.id} product={product} openProductOverlay={() => { if (!isBurgerMenuOpen) { openProductOverlay(product) }}} />
                        )
                    })
                }
                    </View>
                </ScrollView>
            </View>
            <Overlay isVisible={isProductOverlayVisible} onBackdropPress={() => setProductOverlayVisible(false) }>
                { areaId ? <ProductValidation product={product} validateProduct={validateProduct} />
                 : <ProductModify product={product} deleteProduct={deleteProduct}/> }
            </Overlay>
            <ErrorText text={error} />

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
    allProducts : {
        width: windowWidth,
        height: windowHeight - (StatusBar.currentHeight + 75), 
    },
    allProductsScrollView: {
        width: '100%',
        display: 'flex', 
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        paddingHorizontal: 7,
        paddingBottom: 22.5
    }
})

export default ListProducts;