import React, { Component } from 'react'
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    body: {
        // fontFamily: 'Open Sans',
        // color: '#333'
        marginTop: 20,
        backgroundColor: '#f0f0f0'
    },
    h1: {
        marginTop: 30,
        marginBottom: 20,
        fontSize: 16,
        fontWeight: 'bold'
    },
    bold: {
        fontWeight: 'bold'
    },
    center: {
        textAlign: 'center'
    },
    cite: {
        color: 'gray'
    },
    card: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        padding: 5,
        backgroundColor: '#fefefe',
        borderColor: '#ddd',
        borderWidth: 1
    },
    p: {
        marginTop: 10,
        marginBottom: 10
    },
    baseText: {
        // fontFamily: 'Open Sans'
    },
    link: {
        textDecorationStyle: 'solid'
    },
    horizontal: {
        marginTop: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderColor: '#428bc1'
    },
    footer: {
        // fontSize: 10,
        opacity: 0.5,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 10,
        marginRight: 10
    },
    footnote: {
        // fontSize: 15,
        marginBottom: 20
    },

    email: {
        marginLeft: 10,
        marginRight: 10,
        height: 40, 
        borderColor: '#e0e0e0', 
        borderWidth: 1,
        paddingLeft: 10,
        paddingRight: 10
    },

    buttonPrimary: {
        backgroundColor: '#428bc1',
        width: 200,
        color: 'blue',
        borderColor: 'red'
    },
    button: {
        backgroundColor: 'blue',
        borderColor: '#428bc1',
        width: 200,
        color: '#428bc1'
    },
    buttonGroup: {
        marginTop: 16,
        marginBottom: 16
    },
    buttonGroupActive: {
        color: 'red'
    },

    radioButtonGroup: {
        flexDirection: 'row', 
        justifyContent: 'space-between'
    }
})
