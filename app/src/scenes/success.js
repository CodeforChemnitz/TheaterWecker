import React, { Component } from 'react'
import { ScrollView, View, Text, Image, Button } from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';
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
                <View style={[styles.p, styles.baseText]}>
                    <Text style={styles.center}>
                        { 'text' in this.props ? this.props.text : 'Alles super.' }
                    </Text>
                </View>
                <Button title="Zurück" onPress={() => Actions.main({type: ActionConst.BACK})} />
            </View>

            <Footer/>
        </ScrollView>
    )
  }
}
