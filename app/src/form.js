import React, { Component } from 'react'
import { View, Text, TextInput, Button } from 'react-native'
import styles from './styles'
import _ from 'underscore'

// Button: https://facebook.github.io/react-native/docs/button.html

class RadioButtonGroup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: this.props.value
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.active != nextProps.value) {
      this.setState({active: nextProps.value})
    }
  }
  render() {
    if (typeof this.props.options == 'undefined') {
      return null
    }
    return (
      <View style={styles.radioButtonGroup}>
      { _.map(_.keys(this.props.options), (key) => {
          let value = this.props.options[key]
          return <Button
              key={key} 
              title={value} 
              color={this.state.active == key ? this.props.colorActive : this.props.color} 
              onPress={() => this.props.onChange(key)} />
      } ) }
      </View>
    )
  }
}

export default class Form extends Component {
  categories = {
    'oper': "Oper",
    'figurentheater': "Figurentheater",
    'schauspiel': "Schauspiel",
    'ballett': "Ballett",
    'philharmonie': "Philharmonie",
    'sonstiges' : "Sonstiges"
  }
  times = {
    '15': '15 Minuten',
    '30': '30 Minuten',
    '60': '1 Stunde' 
  }
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      category: '',
      time: ''
    }
  }

  onAbonnieren() {
    console.log("Abonnieren an die API", this.state)
  }

  render() {
    return (
        <View style={styles.form}>
            <View style={styles.p}>
                <Text style={styles.center}>Benachrichtige mich</Text>
            </View>
            <View style={styles.buttonGroup}>
                <RadioButtonGroup 
                  options={this.times} 
                  value={this.state.time} 
                  color='#0000ff' 
                  colorActive='#ff0000'
                  onChange={(time) => this.setState({time})} />
            </View>
            <View style={styles.p}>
                <Text style={styles.center}>vor Beginn der Veranstaltung - sofern noch Plätze frei sind - für</Text>
            </View>
            <View style={styles.buttonGroup}>
              <RadioButtonGroup 
                  options={this.categories} 
                  value={this.state.category} 
                  color='#0000ff' 
                  colorActive='#ff0000'
                  onChange={(category) => this.setState({category})} />
            </View>
            <View style={styles.p}>
                <Text style={styles.center}>via E-Mail</Text>
            </View>
            <View style={styles.buttonGroup}>
                <TextInput 
                    keyboardType="email-address"
                    placeholder="max@musterman.de"
                    style={styles.email}
                    onChangeText={(email) => this.setState({email})}
                    value={this.state.email} 
                    />
            </View>
            <View style={styles.buttonGroup}>
                <Button 
                    title="Abonnieren" 
                    style={styles.buttonPrimary} 
                    onPress={() => this.onAbonnieren()} />
            </View>
        </View>
    )
  }
}
