import React, { Component, useEffect, useState } from 'react'
import { StyleSheet, View, Image, Text, TouchableOpacity , Dimensions, StatusBar} from 'react-native';
import Area from './Area';


const Fridge = ({ areas, openProductOverlay, loadProduct }) => {

    return (
        <View style={styles.container}>
            <View style={styles.fridgeBox}>
            {
                areas.map(area => <Area 
                    key={area.area} 
                    product={area.product} 
                    openProductOverlay={openProductOverlay} 
                    loadProduct={() => loadProduct(area.area)} 
                />)
            }
            </View>
        </View>
    )
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        width: windowWidth,
        height: windowHeight - (75 + StatusBar.currentHeight + 70),
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        flexWrap: 'wrap',
        paddingHorizontal: 10,
        paddingVertical: 20
    },
    fridgeBox: {
        width: '100%',
        height: '100%',
        backgroundColor: "white",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderRadius: 20,
        borderColor: 'black',
        borderWidth: 6,        
    },
    
})

export default Fridge;