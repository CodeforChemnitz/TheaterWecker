import React, { Component } from 'react'
import { View, Text, TextInput, Button } from 'react-native';
import styles from './styles'

// Button: https://facebook.github.io/react-native/docs/button.html

class RadioButtonGroup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: ''
    }
  }
  render() {
    if (typeof this.props.options == 'undefined') {
      return null
    }
    return (
      <View style={styles.radioButtonGroup}>
      { this.props.options.keys().map((key) => {
          let value = this.props.options[key]
          return <Button 
              title={value} 
              style={[this.props.classButton, this.props.value == value ? this.props.classButtonActive : {}]} 
              onPress={() => this.props.onCheck(key)} />
      })}
      </View>
    )
  }
}

export default class Form extends Component {
  constructor(props) {
    props.categories = {
      'oper': "Oper",
      'figurentheater': "Figurentheater",
      'schauspiel': "Schauspiel",
      'ballett': "Ballett",
      'philharmonie': "Philharmonie",
      'sonstiges' : "Sonstiges"
    }
    props.times = {
      '15': '15 Minuten',
      '30': '30 Minuten',
      '60': '1 Stunde' 
    }
    super(props)
    this.state = {
      email: '',
      category: ''
    }
  }

  onAbonnieren() {}

  onCategorySelected(category) {
    this.setState({category})
  }
  onTimeSelected(time) {
    this.setState({time})
  }

  render() {
    return (
        <View style={styles.form}>
            <View style={styles.p}>
                <Text style={styles.center}>Benachrichtige mich</Text>
            </View>
            <View style={styles.buttonGroup}>
                <RadioButtonGroup 
                  options={this.props.times} 
                  value={this.state.time} 
                  classButton={styles.button} 
                  classButtonActive={styles.buttonPrimary}
                  onChange={(time) => this.onTimeSelected(time)} />
            </View>
            <View style={styles.p}>
                <Text style={styles.center}>vor Beginn der Veranstaltung - sofern noch Plätze frei sind - für</Text>
            </View>
            <View style={styles.buttonGroup}>
              <RadioButtonGroup 
                  options={this.props.categories} 
                  value={this.state.category} 
                  classButton={styles.button} 
                  classButtonActive={styles.buttonPrimary}
                  onChange={(category) => this.onCategorySelected(category)} />
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
                    onPress={() => this.onAbonnieren} />
            </View>
        </View>
    )
  }
}
