import React, { Component } from 'react'
import { ScrollView, View, Text, Image, Button } from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';
import styles from '../styles'
import Footer from '../components/footer'

export default class ErrorScene extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    console.log("error", this.props)
    let styleImg = {width: 50, height: 50, backgroundColor: 'transparent'}
    return (
        <ScrollView style={styles.body}>
            <View style={styles.titleCont}>
                <Image source={require('../../images/boom.png')} style={styleImg} />
            </View>

            <View style={styles.card}>
                <View style={[styles.p, styles.baseText]}>
                    <Text style={styles.center}>
                        { 'text' in this.props ? this.props.text : 'Uh oh da ist was passiert.' }
                    </Text>
                </View>
            </View>
            { 'back' in this.props && !!this.props.back ? <Button title="Zurück" onPress={() => Actions.main({type: ActionConst.BACK})} /> : null }

            <Footer/>
        </ScrollView>
    )
  }
}
