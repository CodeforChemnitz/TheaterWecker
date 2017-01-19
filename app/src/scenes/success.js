import React, { Component } from 'react'
import { ScrollView, View, Text, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import styles from '../styles'
import Footer from '../components/footer'

// Parsed Text: https://github.com/taskrabbit/react-native-parsed-text

export default class SuccessScene extends Component {
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
                    <Text>Alles super.</Text>
                </View>
                <Button title="Zurück" onPress={Actions.main} />
            </View>

            <Footer/>
        </ScrollView>
    )
  }
}
