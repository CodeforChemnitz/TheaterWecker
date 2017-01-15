import React, { Component } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { Actions } from 'react-native-router-flux';

export default class InitScene extends Component {
  constructor(props) {
    super(props);
    window.setTimeout(function() {
      Actions.main()
    }, 2000)
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
});
