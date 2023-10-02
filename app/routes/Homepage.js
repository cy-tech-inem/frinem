import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, StatusBar, Dimensions, RefreshControl, ScrollView } from 'react-native';
import ErrorText from '../components/Global/ErrorText';
import Header from '../components/Header/Header';
import Fridge from '../components/Homepage/Fridge';
import useMutation from '../hooks/useMutation';
import ButtonClassic from '../components/Global/ButtonClassic';
import { Overlay } from 'react-native-elements';
import ProductDetail from '../components/Homepage/ProductDetail';
import QRCodeOverlay from '../components/Homepage/QRCodeOverlay';

const Homepage = ({ route, navigation, isBurgerMenuOpen, setBurgerMenuOpen }) => {
    const [mutate, state] = useMutation();
    const [areas, setAreas] = useState([]);
    const [isProductOverlayVisible, setProductOverlayVisible] = useState(false);
    const [isQRCodeOverlayVisible, setQRCodeOverlayVisible] = useState(false);
    const [productDetail, setProductDetail] = useState(null)
    const [reload, setReload] = useState(false)
    const [error, setError] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
      }
      
    useEffect(() => {
        if (route?.params?.reload) {
            setReload(true);
        }
    }, [route.params])

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadProductsInAreas();
        wait(1000).then(() => setRefreshing(false));
      }, []);
    

    const loadProductsInAreas = () => {
        mutate("/products/in/areas", "GET").then(res => {
            if (res.error) {
                setError(res.error.message)
            } else if (res.data) {
                setError("");
                setAreas(res.data.areas)
            } else {
                setError("La réponse reçue n'est pas dans le bon format");
            }
        })
    }

    useEffect(() => {
        loadProductsInAreas();
    }, [])

    useEffect(() => {
        if (reload) {
            loadProductsInAreas()
            setReload(false);
        }
    }, [reload])

    const openProductOverlay = (product) => {
        setProductDetail(product);
        setProductOverlayVisible(true);
    }

    const loadProduct = (areaId) => {
        navigation.navigate('LoadProduct', { areaId: areaId })
    }

    const removeFromArea = () => {
        const areaId = areas.find(area => area.product.id === productDetail.id).area
        setProductOverlayVisible(false)
        mutate("/areas/" + areaId + "/products/null", "PUT").then(res => {
            if (res.error) {
                setError(res.error.message)
            } else if (res.data) {
                setError("");
                setReload(true);
            } else {
                setError("La réponse reçue n'est pas dans le bon format");
            }
        })
    }

    return (
        <View style={styles.container} >
            

            <Header navigation={navigation} isBurgerMenuOpen={isBurgerMenuOpen} setBurgerMenuOpen={setBurgerMenuOpen} />
            <ScrollView 
                style={styles.scrollViewHomepage}
                refreshControl={
                    <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    />
            }>
                <Fridge 
                    areas={areas} 
                    openProductOverlay={(product) => {if (!isBurgerMenuOpen){openProductOverlay(product)} }} 
                    loadProduct={(areaId) => { if (!isBurgerMenuOpen) {loadProduct(areaId)}}} 
                />
                <View style={styles.bottomHomepage}>
                    <ButtonClassic text={'Afficher le QR code'} action={() => {if (!isBurgerMenuOpen) {setQRCodeOverlayVisible(true)} }}/>
                </View>
            </ScrollView>
            <ErrorText text={error} />
            <Overlay isVisible={isProductOverlayVisible} onBackdropPress={() => setProductOverlayVisible(false)}>
                <ProductDetail product={productDetail} removeFromArea={removeFromArea} />
            </Overlay>
            <Overlay isVisible={isQRCodeOverlayVisible} onBackdropPress={() => setQRCodeOverlayVisible(false)} >
                <QRCodeOverlay />
            </Overlay>
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
    scrollViewHomepage: {
        position: 'absolute',
        bottom: 0,
        height: windowHeight - (StatusBar.currentHeight + 75),

    },
    bottomHomepage: {
        width: windowWidth,
        height: 70,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',       
    },
})

export default Homepage;