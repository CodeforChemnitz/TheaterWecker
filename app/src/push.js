import OneSignal from 'react-native-onesignal'

let push = {
  deviceId: '',
  init() {
    OneSignal.configure({
      onIdsAvailable: (device) => {
        this.deviceId = device.userId
        console.log('UserId = ', device.userId)
        console.log('PushToken = ', device.pushToken)
      },
      onNotificationOpened: function(message, data, isActive) {
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