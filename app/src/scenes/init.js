import React, { Component } from 'react'
import { View, StyleSheet, Text, Button } from 'react-native'
import push from '../lib/push'

export default class InitScene extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    push.init()
  }

  render() {
    return (
        <View style={styles.container}>
            <Text>Gleich gehts los..</Text>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }
})
