import React, { Component } from 'react'
import { Platform } from 'react-native'

// Network fetch: https://facebook.github.io/react-native/releases/next/docs/network.html

// -- Android GCM ---

// GCM -> ab Sept. 2015 Geschichte - nur noch Firebase
// Push Test GCM: https://github.com/oney/TestGcm
// https://github.com/oney/react-native-gcm-android
// https://github.com/Neson/react-native-system-notification

// https://developers.google.com/cloud-messaging/http 
// https://developers.google.com/cloud-messaging/android/client
// https://developers.google.com/cloud-messaging/gcm

// -- Firebase --

// http://stackoverflow.com/questions/38237559/how-do-you-send-a-firebase-notification-to-all-devices-via-curl#38248296
// curl --insecure --header "Authorization: key=AIzaSyCGIxVyj6WCVoihBKSekOgvkRt3nZwwJqo" --header "Content-Type:application/json" -d "{\"notification\":{\"title\":\"note-Title\",\"body\":\"note-Body\"}}" https://fcm.googleapis.com/fcm/send 
// https://github.com/davideast/firebase-react-native-sample
// https://firebase.google.com/docs/cloud-messaging/android/first-message

// FCM Key hier -> https://console.firebase.google.com/project/theaterwecker/settings/cloudmessaging



const token = '370de3b211294a7e84b9eeb6643a935b94703062'
const url = 'http://127.0.0.1:8000/api/v1'

const getAsJson = (type) => {
  return fetch(url + '/' + type)
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson
    })
    .catch((error) => {
      console.log(error)
    })
}

const api = {
  getInstitutions: () => {
    return getAsJon('institutions')
  },
  getCategories: () => {
    return getAsJon('categories')
  },
  createUserDevice: () => {
    fetch(url + '/userdevice', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        deviceId: '?',
        deviceType: Platform.iOS ? 'iOS' : 'Android',
      })
    })
  }
}

export default api
