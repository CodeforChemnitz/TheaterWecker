import OneSignal from 'react-native-onesignal'
import { Actions } from 'react-native-router-flux';
import api from '../lib/api'

// -- OneSignal API --
// Plugin: https://github.com/geektimecoil/react-native-onesignal
// Setup-Guide: https://medium.com/differential/react-native-push-notifications-with-onesignal-9db6a7d75e1e#.2s5b60s1m
// Accounts&Keys: https://documentation.onesignal.com/docs/accounts-and-keys#section-keys-ids

// Get Device Info: 
//    curl https://onesignal.com/api/v1/players/?

// Create Push: https://documentation.onesignal.com/reference#create-notification
//    "app_id":"?","include_player_ids":["?"]
// curl -X POST --header "Authorization: key=?" --header "Content-Type:application/json" -d "{\"app_id\":\"1c52ee9f-71ed-4081-9c54-e66a815538ac\",\"include_player_ids\":[\"c732c64a-9409-4af3-b0dc-1ff93e084b5b\"],\"contents\":{\"en\":\"Test for REST content\",\"de\":\"Test per REST Inhalt\"},\"headings\":{\"en\":\"Title test\",\"de\":\"Titel Test\"},\"data\":{\"bla\":\"fasel\"}}" https://onesignal.com/api/v1/notifications 

let push = {
  deviceId: '',
  init(success, error, routingStatus) {
    OneSignal.configure({
      onIdsAvailable: (device) => {
        this.deviceId = device.userId
        console.log('UserId = ', device.userId)
        console.log('PushToken = ', device.pushToken)
        success()
      },
      onNotificationOpened: async (message, data, isActive) => {
        try {
          if (Object.hasOwnProperty.call(message.notification.payload.additionalData, 'verification')) {
            let verification = message.notification.payload.additionalData.verification
            try {
              await new Promise((resolve, reject) =>  {
                api.verifyDevice(verification, resolve, reject)
              })
              if (routingStatus.canRouteToMain) {
                Actions.main()
                routingStatus.routeChanged = true
                routingStatus.disableProgress()
              }

            } catch(e) {
              // Promise rejected?! Show error
              throw 'VerifyDevice schlug fehl'
            }
          } else if (Object.hasOwnProperty.call(message.notification.payload.additionalData, 'performance')) {
            Actions.eventNotification({
              performance: message.notification.payload.additionalData.performance,
              back: true
            })
            routingStatus.routeChanged = true
            routingStatus.disableProgress()
          }
        } catch(e) {
          console.debug(e)
          Actions.error({ back: true })
        }
      }
    });
  },
  getDeviceId() {
    return this.deviceId
  }
};

export default push