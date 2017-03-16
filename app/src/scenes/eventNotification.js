import React, { Component } from 'react'
import { ScrollView, View, Text, Image, Button } from 'react-native'
import { Actions } from 'react-native-router-flux';
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
    let styleImg = size => ( {width: size, height: size, backgroundColor: 'transparent'} )
    
    return (
        <ScrollView style={styles.body}>
            <View style={styles.titleCont}>
                <Image source={require('../../images/ok.png')} style={styleImg(50)} />
            </View>

            <View style={styles.card}>
                <View style={[styles.p, {margin: 10}]}>
                    <Text style={[styles.baseText, styles.center, styles.eventTitle]}>
                        {this.props.performance.title}
                    </Text>
                    <Text style={[styles.baseText, styles.center, styles.eventLocation]}>{this.props.performance.location}</Text>
                    <View style={{flex:1, flexDirection:'row', justifyContent:'center'}}>
                        <Image source={require('../../images/alarm-clock.png')} style={[styleImg(25), {marginRight:5}]} />
                        <Text style={[styles.baseText, styles.center, styles.eventLocation]}>
                            {this.props.performance.begin 
                                ? moment(this.props.performance.begin).format('HH:mm') 
                                : moment().format('HH:mm') }
                        </Text>
                    </View>
                    <Text style={[styles.baseText, styles.eventDescription]}>
                        {this.props.performance.description}
                    </Text>
                    <Text style={[styles.baseText, {}]}>
                        Wir wünschen dir viel Spaß!
                    </Text>
                    { 'back' in this.props && !!this.props.back 
                        ? <View style={{marginTop: 20}}><Button title="Zurück" onPress={() => Actions.main()} /></View>
                        : null }
                </View>
            </View>
            

            <Footer/>
        </ScrollView>
    )
  }
}
