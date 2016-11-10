import React, { Component } from 'react'
import { ScrollView, View, Text } from 'react-native';
import styles from 'styles'
import ParsedText from 'react-native-parsed-text'
import Form from 'form'

// https://github.com/taskrabbit/react-native-parsed-text

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  openCodeForChemnitz() {}
  openEmojiOne() {}
  openKulturticket() {}

  render() {
    return (
        <ScrollView class={styles.body}>
            <Text class={styles.h1}>TheaterWecker</Text>
            <View class={styles.p}>
                <Text>Wusstest du, dass du als Chemnitzer Student mit deinem</Text>
                <Text class={styles.bold}>Studentenausweis</Text> 
                <Text>15 Minuten vor Beginn einer Theatervorstellung</Text>
                <Text class={styles.bold}>kostenlos</Text>
                <Text>rein kommst, wenn noch Tickets vorhanden sind?</Text>
                <Text class={styles.cite}>*</Text>
            </View>
            <View class={styles.p}>
                <Text>Lass dich einfach von uns benachrichtigen, wenn kurz vor der Veranstaltung noch Tickets frei sind.</Text>
            </View>
            <View class={styles.horizontal}/>
            <Form/>
            <View class={styles.footer}>
                <View class={styles.footnote}>
                    <Text>* Dies ist mit dem </Text>
                    <Text class={styles.link} onClick={this.openKulturticket}>Kulturticket</Text>
                    <Text> deines Studentenausweises möglich. </Text> 
                </View>
                <View><Text>Made with ♥ by</Text></View>
                <View><Text class={styles.link} onClick={this.openCodeForChemnitz}>Code for Chemnitz</Text></View>
            </View>
            <View class={styles.footer}>
                <Text>Emoji art supplied by</Text>
                <Text class={styles.link} onClick={this.openEmojiOne}>EmojiOne</Text>
            </View>
        </ScrollView>
    )
  }
}
