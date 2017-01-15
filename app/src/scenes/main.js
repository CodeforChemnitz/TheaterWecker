import React, { Component } from 'react'
import { ScrollView, View, Text, Image } from 'react-native';
import styles from './styles'
// import ParsedText from 'react-native-parsed-text'
import Form from '../components/form'
import Footer from '../components/footer'
import api from '../lib/api'
import push from '../lib/push'

// Parsed Text: https://github.com/taskrabbit/react-native-parsed-text


export default class MainScene extends Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    push.init()
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

            <Footer/>
        </ScrollView>
    )
  }
}
