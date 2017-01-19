import React, { Component } from 'react'
import { ScrollView, View, Text, Image } from 'react-native';
import styles from '../styles'
import Footer from '../components/footer'

export default class MustValidateScene extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    let styleImg = {width: 50, height: 50, backgroundColor: 'transparent'}
    return (
        <ScrollView style={styles.body}>
            <View style={styles.titleCont}>
                <Image source={require('../../images/ok.png')} style={styleImg} />
            </View>

            <View style={styles.card}>
                <View style={[styles.p, styles.baseText, styles.center]}>
                    <Text>Dein Gerät wurde registriert.</Text>
                    <Text>Bitte warte auf die Push-Benachrichtigung zur Bestätigung.</Text>
                </View>
            </View>

            <Footer/>
        </ScrollView>
    )
  }
}
