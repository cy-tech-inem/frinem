import React, { useEffect, useState } from 'react';
import { Image, StatusBar, StyleSheet, Text, View, TextInput, Dimensions, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker'
import { ScreenHeight } from 'react-native-elements/dist/helpers';
import * as ImagePicker from 'expo-image-picker'
import Header from '../components/Header/Header';
import useMutation from '../hooks/useMutation';
import ErrorText from '../components/Global/ErrorText';
import ButtonClassic from '../components/Global/ButtonClassic';
import { API_URL, KEY_TOKEN } from '@env'
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Overlay } from 'react-native-elements';


const CreateProduct = ({ route, navigation, isBurgerMenuOpen, setBurgerMenuOpen }) => {
    const { areaId } = route.params;
    const [mutate, state] = useMutation();
    const [image, setImage] = useState(require("../assets/addPicture.png"));
    const [quantity, setQuantity] = useState(1);
    const [name, setName] = useState("");
    
    const [families, setFamilies] = useState([]);
    const [family, setFamily] = useState(0);
    
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Load families
        mutate("/families", "GET").then(res => {
            if (res.error) {
                setError(res.error.message)
            } else if (res.data) {
                setError("");
                setFamilies(res.data.families);
            } else {
                setError("La réponse reçue n'est pas dans le bon format");
            }
        })
    }, [])

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

        if (!result.cancelled) {
            setImage(result);
        }
    };

    const addProduct = () => {
        setLoading(true);
        if (name && image.uri && family) {
            var body = {
                "name": name,
                "familyId": family,
                "quantity": quantity
            }

            mutate("/products", "POST", body).then(res => {
                setLoading(false)
                if (res.error) {
                    setError(res.error.message)
                } else if (res.data) {
                    savePicture(res.data.productId);
                } else {
                    setError("La réponse reçue n'est pas dans le bon format");
                }
            })
        } else {
            setLoading(false)
            setError("Veuillez remplir tous les champs")
        }
    }

    const savePicture = (productId) => {
        setLoading(true)
        const formData = new FormData();
        formData.append("File", {
            name : image.uri,
            uri : image.uri,
            type: 'image/jpg'
        })
        AsyncStorage.getItem(KEY_TOKEN).then(token => {
            const headers = new Headers();
            headers.append("Content-Type", "multipart/form-data");
            headers.append("authorization", "Bearer " + token);

            fetch(API_URL + '/products/' + productId + '/images', {
                method: "PUT",
                body: formData,
                headers,
            })
            .then((res) => res.json())
            .then(res =>  {
                setLoading(false)
                if (res.error) {
                    setError(res.error.message)
                } else if (res.data) {
                    setProductToArea(productId)
                } else {
                    setError("La réponse reçue n'est pas dans le bon format");
                }
            })
            .catch(err => {
                setError("Error while uploading the photo")
            })
        })
    }

    const setProductToArea = (productId) => {
        setLoading(true)
        mutate("/areas/" + areaId + "/products/" + productId, "PUT").then(res => {
            setLoading(false);
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

    return (
        <View style={styles.container}>
            <Header navigation={navigation} isBurgerMenuOpen={isBurgerMenuOpen} setBurgerMenuOpen={setBurgerMenuOpen} />
            <View style={styles.formProduct}>
                <View style={styles.productPicture} onTouchEnd={() => {if (!isBurgerMenuOpen) { pickImage() }}} >
                    {image ? <Image source={ image } style={image === require("../assets/addPicture.png") ? { width: 50, height: 50} : { width: 200, height: 200, borderRadius: 10 }} /> : null}
                </View>

                <View style={styles.productQuantity}>
                    <View style={styles.productQuantityButton} onTouchEnd={() => {if (!isBurgerMenuOpen) { quantity > 1 ? setQuantity(quantity-1) : setQuantity(quantity) }}}>
                        <Image 
                            source={require('../assets/remove.png')}
                            style={styles.productQuantityButtonImage} 
                        />
                    </View>
                    <Text style={styles.productQuantityText}> Quantité: {quantity}</Text>
                    <View style={styles.productQuantityButton} onTouchEnd={() => { if (!isBurgerMenuOpen) { setQuantity(quantity+1) }}}>
                        <Image 
                            source={require('../assets/add.png')}
                            style={styles.productQuantityButtonImage} 
                        />
                    </View>  
                </View>
                <Picker selectedValue={family} style={{ height: 50, width: 150 }} onValueChange={(value) => setFamily(value)} enabled={!isBurgerMenuOpen}>
                    {
                        families.map(family => 
                            <Picker.Item style={styles.pickerItem} key={family.id} label={family.name} value={family.id} />
                        )
                    }
                </Picker>
                <TextInput
                    style={styles.productName}
                    onChangeText={setName}
                    placeholder="Nom du produit"
                    value={name}
                    editable={!isBurgerMenuOpen}
                    selectTextOnFocus={!isBurgerMenuOpen}
                />
                <ButtonClassic text={"Valider"} action={() => { if(!isBurgerMenuOpen) { addProduct() } }} />
            </View> 
            <ErrorText text={error} />
            <Overlay isVisible={state.loading || loading} >
                <ActivityIndicator size={"large"} color={"#0000FF"} />
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
    formProduct: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
    },
    productPicture : {
        width: 200,
        height: 200,
        backgroundColor: 'lightgray',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    productQuantity: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    productQuantityButton:{
        width: 30,
        height: 30,
        borderRadius: 30,
        backgroundColor: 'gray',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    productQuantityButtonImage: {
        tintColor: 'white'
    },
    productQuantityText : {
        marginRight: 10,
        marginLeft: 10,
        fontSize: 20
    },
    productName: {
        width: '100%',
        height: 40,
        margin: 20,
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        borderColor: 'gray',
        fontSize: 20
    },
    pickerItem: {
        fontSize: 20
    },  
    addproductButton:{
        width: '60%',
        height: 40,
        borderRadius: 10,
        textAlign: 'center',
        backgroundColor: '#006eff',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        lineHeight: 0,
    }
})

export default CreateProduct;