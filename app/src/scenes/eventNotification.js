import React, { Component } from 'react'
import { ScrollView, View, Text, Image } from 'react-native'
import ParsedText from 'react-native-parsed-text'
import moment from 'moment'
import styles from '../styles'
import Footer from '../components/footer'

// Parsed Text: https://github.com/taskrabbit/react-native-parsed-text

export default class EventNotificationScene extends Component {
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
                    <ParsedText>
Liebe/r Theaterenthusiast/in,

es gibt noch Karten für die Aufführung "{this.props.performance.title}".

Ort: {this.props.performance.location}
Zeitpunkt: {this.props.performance.begin ? this.props.performance.begin : moment().format('d.M.YYYY h:mm') }}

Beschreibung:

{this.props.performance.description}

Wir wünschen dir viel Spaß!

Liebe Grüße,
dein TheaterWecker Team
                    </ParsedText>
                </View>
            </View>

            <Footer/>
        </ScrollView>
    )
  }
}
