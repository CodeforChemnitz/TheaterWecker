import React, { Component } from 'react'
import { ScrollView, View, Text, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import styles from '../styles'

const links = {
    kulturticket: {title: 'Kulturticket', link: 'https://www.tu-chemnitz.de/stura/de/kulturticket'},
    codeforchemnitz: {title: 'Code for Chemnitz', link: 'http://codeforchemnitz.de/'},
    emojione: {title: 'EmojiOne', link: 'http://emojione.com/'},
    impressum: {title: 'Impressum', link: 'https://theaterwecker.de/impressum/'}
}
export default class Footer extends Component {
    
  constructor(props) {
    super(props)
  }
  open(name) {
      Actions.webview({ title: links[name].title, link: links[name].link })
  }
  render() {
    return ( <View>
        <View style={styles.footer}>
            <View style={styles.footnote}>
                <Text style={styles.center}>
                    <Text>* Dies ist mit dem </Text>
                    <Text style={styles.link} onClick={this.open('kulturticket')}>{links.kulturticket.title}</Text>
                    <Text> deines Studentenausweises möglich. </Text>
                </Text> 
            </View>
            <Text style={styles.center}>
                <Text>Made with ♥ by </Text>
                <Text style={styles.link} onClick={this.open('codeforchemnitz')}>{links.codeforchemnitz.title}</Text>
            </Text>
        </View>
        <View style={styles.footer}>
            <Text style={styles.center}>
                <Text>Emoji art supplied by </Text>
                <Text style={styles.link} onClick={this.open('emojione')}>{links.emojione.title}</Text>
            </Text>
        </View>
    </View> )
  }
}
