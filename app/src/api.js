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
// curl --insecure --header "Authorization: key=?" --header "Content-Type:application/json" -d "{\"notification\":{\"title\":\"note-Title\",\"body\":\"note-Body\"}}" https://fcm.googleapis.com/fcm/send 
// https://github.com/davideast/firebase-react-native-sample
// https://firebase.google.com/docs/cloud-messaging/android/first-message

// FCM Key hier -> https://console.firebase.google.com/project/theaterwecker/settings/cloudmessaging

// -- Device ID / Token --

// https://github.com/rebeccahughes/react-native-device-info

// -- MQTT --

// https://www.npmjs.com/package/react-native-mqtt
// Facebook also uses MQTT
// https://www.ibm.com/developerworks/community/blogs/mobileblog/entry/why_facebook_is_using_mqtt_on_mobile?lang=en
// https://www.quora.com/Why-did-Facebook-decided-to-use-MQTT-instead-of-Apple-push-notification-service-for-their-app
// https://www.ibm.com/developerworks/community/blogs/mobileblog/entry/why_facebook_is_using_mqtt_on_mobile?lang=en
// Maybe better?
// https://www.quora.com/Is-MQTT-better-than-HTTP-for-mobile-app-iOS-Android-etc-client-server-communication

// react-native-mqtt: https://www.npmjs.com/package/react-native-mqtt
// react-native-device-info: https://github.com/rebeccahughes/react-native-device-info


// -- OneSignal API --
// Plugin: https://github.com/geektimecoil/react-native-onesignal
// Setup-Guide: https://medium.com/differential/react-native-push-notifications-with-onesignal-9db6a7d75e1e#.2s5b60s1m
// Accounts&Keys: https://documentation.onesignal.com/docs/accounts-and-keys#section-keys-ids

// Get Device Info: 
//    curl https://onesignal.com/api/v1/players/?

// Create Push: https://documentation.onesignal.com/reference#create-notification
//    "app_id":"?","include_player_ids":["?"]
// curl -X POST --header "Authorization: key=?" --header "Content-Type:application/json" -d "{\"app_id\":\"1c52ee9f-71ed-4081-9c54-e66a815538ac\",\"include_player_ids\":[\"c732c64a-9409-4af3-b0dc-1ff93e084b5b\"],\"contents\":{\"en\":\"Test for REST content\",\"de\":\"Test per REST Inhalt\"},\"headings\":{\"en\":\"Title test\",\"de\":\"Titel Test\"},\"data\":{\"bla\":\"fasel\"}}" https://onesignal.com/api/v1/notifications 

// -- Theaterwecker Backend --
// Django Systemverwaltung: https://theaterwecker.de/admin/
// local self documented API: http://127.0.0.1:8000/api/v1/


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
    return getAsJson('institutions')
  },
  getCategories: () => {
    return getAsJson('categories')
  },
  createUserDevice: () => {
    const deviceInfo = require('react-native-device-info')
    const uuid = DeviceInfo.getUniqueID()
    console.log("UUID", uuid)

    fetch(url + '/userdevice', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        deviceId: uuid,
        deviceType: Platform.iOS ? 'iOS' : 'Android',
      })
    })
  }
}

export default api
