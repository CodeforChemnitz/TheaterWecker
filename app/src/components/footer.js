import React, { Component } from 'react'
import { ScrollView, View, Text, Image } from 'react-native';
import styles from '../styles'

export default class Footer extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return ( <View>
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
    </View> )
  }
}
