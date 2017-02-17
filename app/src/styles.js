import React, { Component } from 'react'
import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
    body: {
        // fontFamily: 'Open Sans',
        // color: '#333'
        marginTop: Platform.iOS ? 20 : 0,
        backgroundColor: '#f0f0f0'
    },
    title: {
        fontSize: 25,
        //fontWeight: 'bold'
    },
    titleCont: {
        marginTop: 20,
        marginBottom: 10,
        flexDirection: 'row', 
        justifyContent: 'center',
        backgroundColor: '#f0f0f0'
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
        textDecorationStyle: 'solid',
        fontWeight: 'bold'
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
        flex: 1,
        flexDirection: 'column', 
        // justifyContent: 'space-between',
        // flexWrap: 'wrap'
    },
    radioButtonGroupItem: {
        flex: 1,
        // flexGrow: 1,
        margin: 5,
        // lineHeight: 25,
        // borderWidth: 1,
        // borderColor: 'lightgray',
        backgroundColor: '#f0f0f0',
        padding: 10,
        paddingLeft: 15,
        paddingRight: 15,
        // height: 30,
    },
    radioButtonGroupItemActive: {
        backgroundColor: '#FF717F'
    },

    radioButtonGroupItemText: {
        color: 'black',
        textAlign: 'center'
    },
    radioButtonGroupItemTextActive: {
        // color: 'white'
    },

    initContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

    eventTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        marginTop: 10, 
        marginBottom: 20
    },
    eventLocation: {
        fontSize: 20,
        marginBottom: 10
    },
    eventDescription: {
        marginTop: 20,
        marginBottom: 20,
        fontSize: 16
    },
    formTextTop: {
        fontSize: 20
    },
    formText: {
        fontSize: 16,
        marginBottom: 10
    }

})
