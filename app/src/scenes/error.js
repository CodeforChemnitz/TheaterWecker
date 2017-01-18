import React, { Component } from 'react'
import { ScrollView, View, Text, Image } from 'react-native';
import styles from '../styles'
import Footer from '../components/footer'

// Parsed Text: https://github.com/taskrabbit/react-native-parsed-text

export default class ErrorScene extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    let styleImg = {width: 50, height: 50, backgroundColor: 'transparent'}
    return (
        <ScrollView style={styles.body}>
            <View style={styles.titleCont}>
                <Image source={require('../../images/boom.png')} style={styleImg} />
            </View>

            <View style={styles.card}>
                <View style={[styles.p, styles.baseText, styles.center]}>
                    <Text>Uh oh da ist was passiert.</Text>
                </View>
            </View>

            <Footer/>
        </ScrollView>
    )
  }
}
