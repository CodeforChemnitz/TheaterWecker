import React, { Component } from 'react'
import { View, StyleSheet, Platform, WebView } from 'react-native'

// WebView: https://facebook.github.io/react-native/docs/webview.html

export default class WebviewScene extends Component {
    constructor(props) {
        super(props);
    }

  render() {
    return (
        <WebView
            source={{uri: this.props.link}}
            style={styles.container}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
      marginTop: Platform.OS === 'ios' ? 64 : 54,
  }
});
