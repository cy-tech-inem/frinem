import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, ActivityIndicator, StatusBar, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-elements/dist/buttons/Button';
import useMutation from '../hooks/useMutation';
import { KEY_TOKEN } from "@env"
import ErrorText from '../components/Global/ErrorText';
import ButtonClassic from '../components/Global/ButtonClassic';

const Password = ({ route, navigation }) => {
    const [mutate, state] = useMutation()
    const [name, setName] = useState("");
    const [firstname, setFirstname] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const requestToken = () => {
        // Si un champ est vide, on affiche une erreur
        if (!(name && password)) {
            setError("Veuillez remplir tous les champs");
            return;
        }

        const body = {
            firstname: firstname,
            name: name,
            password: password
        }
        mutate("/token", "POST", body)
        .then((res) => {
            if (res.error) {
                setError(res.error.message);
            } else if (res.data) {
                setError("")
                setToken(res.data.token)
            } else {
                setError("La réponse reçue n'est pas dans le bon format")
            }
        })
        .catch(err => setError(err.message))
    }

    const setToken = (token) => {
        try {
            AsyncStorage.setItem(KEY_TOKEN, token).then(() => {
                navigation.replace('Homepage')
            })
            .catch(() => {
                setError("Une erreur est survenu, veuillez ré-essayer ^^")
            })
        } catch (err) {
            setError("Une erreur est survenu, veuillez ré-essayer ^^")
        }
    }

    return (
        <View style={styles.container} >
            <Text style={styles.title}>Connexion</Text>
            <TextInput
                style={styles.inputConnexion}
                onChangeText={setFirstname}
                placeholder="Prénom"
                value={firstname}
            />
            <TextInput
                style={styles.inputConnexion}
                onChangeText={setName}
                placeholder="Nom"
                value={name}
            />
            <TextInput
                style={styles.inputConnexion}
                onChangeText={setPassword}
                placeholder="Mot de passe"
                value={password}
                secureTextEntry={true}
            />
            {/* <ButtonClassic text={'Valider'} onTouchEnd={requestToken} /> */}
            <View onTouchEnd={requestToken}>
                <ButtonClassic text={'Valider'}/>
            </View>
            {
                state.loading ? 
                <ActivityIndicator size="large" color="#0000ff" /> : null
            }

            <ErrorText text={error} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        top: StatusBar.currentHeight,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - StatusBar.currentHeight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        margin: 50,
    },
    inputConnexion: {
        width: '60%',
        textAlign: 'center',
        fontSize: 20,
        margin: 20,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 5
    },
    error: {
        color: "#FF0000"
    }
})

export default Password;