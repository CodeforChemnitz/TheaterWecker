import React, { Component } from 'react'
import { ScrollView, View, Text, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import styles from '../styles'

// because of error "The resource could not be loaded because the App Transport Security policy requires the use of a secure connection"
// http://stackoverflow.com/questions/32631184/the-resource-could-not-be-loaded-because-the-app-transport-security-policy-requi#32631185
// https://developer.apple.com/library/content/documentation/General/Reference/InfoPlistKeyReference/Articles/CocoaKeys.html
// -> ios/TheaterWecker/Info.plist

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
                    <Text style={styles.link} onPress={() => this.open('kulturticket')}>{links.kulturticket.title}</Text>
                    <Text> deines Studentenausweises möglich. </Text>
                </Text> 
            </View>
            <Text style={styles.center}>
                <Text>Made with ♥ by </Text>
                <Text style={styles.link} onPress={() => this.open('codeforchemnitz')}>{links.codeforchemnitz.title}</Text>
            </Text>
            <Text style={styles.center}>
                <Text>Emoji art supplied by </Text>
                <Text style={styles.link} onPress={() => this.open('emojione')}>{links.emojione.title}</Text>
            </Text>
            <Text style={styles.center}>
                <Text style={styles.link} onPress={() => this.open('impressum')}>{links.impressum.title}</Text>
            </Text>
        </View>
    </View> )
  }
}
