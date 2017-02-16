import React, { Component } from 'react'
import { View, Text, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import styles from '../styles'

export default class Header extends Component {
    
  constructor(props) {
    super(props)
  }
  render() {
    let styleImg = {width: 25, height: 25, backgroundColor: 'transparent'}
    return ( 
        <View>
          <View style={styles.titleCont}>
            <Image source={require('../../images/performing-arts.png')} style={styleImg} />
            <Image source={require('../../images/alarm-clock.png')} style={styleImg} />
            <Text style={[styles.title]}>TheaterWecker</Text>
          </View>
        </View> 
    )
  }
}
