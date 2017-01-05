import OneSignal from 'react-native-onesignal'

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
  init() {
    OneSignal.configure({
      onIdsAvailable: (device) => {
        this.deviceId = device.userId
        console.log('UserId = ', device.userId)
        console.log('PushToken = ', device.pushToken)
      },
      onNotificationOpened: (message, data, isActive) => {
        console.log('MESSAGE: ', message)
        console.log('DATA: ', data)
        console.log('ISACTIVE: ', isActive)
        // Do whatever you want with the objects here
        // _navigator.to('main.post', data.title, { // If applicable
        //  article: {
        //    title: data.title,
        //    link: data.url,
        //    action: data.actionSelected
        //  }
        // });
      }
    });
  },
  getDeviceId() {
    return this.deviceId
  }
};

export default push