import React, { Component } from 'react'
import { ScrollView, View, Text, Image } from 'react-native';
import styles from './styles'
// import ParsedText from 'react-native-parsed-text'
import Form from './form'
import api from './api'
import OneSignal from 'react-native-onesignal';

// Parsed Text: https://github.com/taskrabbit/react-native-parsed-text


export default class App extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    OneSignal.configure({
      onIdsAvailable: function(device) {
        console.log('UserId = ', device.userId);
        console.log('PushToken = ', device.pushToken);
      },
      onNotificationOpened: function(message, data, isActive) {
        console.log('MESSAGE: ', message);
        console.log('DATA: ', data);
        console.log('ISACTIVE: ', isActive);
        // Do whatever you want with the objects here
        // _navigator.to('main.post', data.title, { // If applicable
        //  article: {
        //    title: data.title,
        //    link: data.url,
        //    action: data.actionSelected
        //  }
        // });
      }
    });
  }
  openCodeForChemnitz() {
      console.log("CodeForChemnitz clicked")
  }
  openEmojiOne() {
      console.log("EmojiOne clicked")
  }
  openKulturticket() {
      console.log("Kulturticket clicked")
  }

  render() {
    let styleImg = {width: 25, height: 25, backgroundColor: 'transparent'}
    return (
        <ScrollView style={styles.body}>
            <View style={styles.titleCont}>
                <Image source={require('./../images/performing-arts.png')} style={styleImg} />
                <Image source={require('./../images/alarm-clock.png')} style={styleImg} />
                <Text style={[styles.title]}>TheaterWecker</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.p}>
                    <Text style={[styles.baseText, styles.center]}>
                        <Text>Wusstest du, dass du als Chemnitzer Student mit deinem </Text>
                        <Text style={styles.bold}>Studentenausweis</Text> 
                        <Text> 15 Minuten vor Beginn einer Theatervorstellung </Text>
                        <Text style={styles.bold}>kostenlos</Text>
                        <Text> rein kommst, wenn noch Tickets vorhanden sind? </Text>
                        <Text style={styles.cite}>*</Text>
                    </Text>
                </View>
                <View style={styles.p}>
                    <Text style={styles.center}>Lass dich einfach von uns benachrichtigen, wenn kurz vor der Veranstaltung noch Tickets frei sind.</Text>
                </View>
            </View>

            <View style={styles.card}>
                <Form/>
            </View>

            <View style={styles.footer}>
                <View style={styles.footnote}>
                    <Text style={styles.center}>
                        <Text>* Dies ist mit dem </Text>
                        <Text style={styles.link} onClick={this.openKulturticket}>Kulturticket</Text>
                        <Text> deines Studentenausweises möglich. </Text>
                    </Text> 
                </View>
                <Text style={styles.center}>
                    <Text>Made with ♥ by </Text>
                    <Text style={styles.link} onClick={this.openCodeForChemnitz}>Code for Chemnitz</Text>
                </Text>
            </View>
            <View style={styles.footer}>
                <Text style={styles.center}>
                    <Text>Emoji art supplied by </Text>
                    <Text style={styles.link} onClick={this.openEmojiOne}>EmojiOne</Text>
                </Text>
            </View>
        </ScrollView>
    )
  }
}
