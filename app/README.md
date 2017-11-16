# TheaterWecker App

![Screenshot iOS](screenshot-ios.png)
 
## Setup


### OneSignal iOS Setup (Pods)

https://github.com/geektimecoil/react-native-onesignal#ios-installation

**Init & Setup CocoaPods**

```
cd ios
sudo gem install cocoapods
pod setup
```

**Setup AppDelegate.m**

```
cp ios/TheaterWecker/AppDelegate.m.dist ios/TheaterWecker/AppDelegate.m
```

Replace `ONESIGNAL_APP_ID_GOES_HERE` in `AppDelegate.m` with the OneSignal App-ID.


### OneSignal Android Setup

https://github.com/geektimecoil/react-native-onesignal#android-installation

**Setup app/build.gradle**

```
cp android/app/build.gradle.dist android/app/build.gradle
```

Replace `YOUR_ONESIGNAL_ID` and `YOUR_GOOGLE_PROJECT_NUMBER` with the OneSignal stuff.


## Run it!

### iOS

To run your app on iOS:
- `cd /Users/ronny/dev/oklabs/TheaterWecker/app`
- `react-native run-ios`

- or -

- Open `./TheaterWecker/app/ios/TheaterWecker.xcodeproj` in Xcode
- Hit the Run button

### Android

To run your app on Android:

- Have an Android emulator running (quickest way to get started), or a device connected
- `cd /Users/ronny/dev/oklabs/TheaterWecker/app`
- `react-native run-android`

## Deploy it!

### Android 

**Bump version**
in `android/app/build.gradle`
```
  versionCode 2
  versionName "1.2"
```
For each new release the technical `versionCode` must be bumped.

**Secrets**

in `~/.gradle/gradle.properties`:

```
org.gradle.daemon=true

THEATERWECKER_RELEASE_STORE_FILE=my-release-key.keystore
THEATERWECKER_RELEASE_KEY_ALIAS=my-key-alias
THEATERWECKER_RELEASE_STORE_PASSWORD=[your password]
THEATERWECKER_RELEASE_KEY_PASSWORD=[your password]

THEATERWECKER_ONESIGNAL_APP_ID="[your OneSignal App ID goes here]"
THEATERWECKER_ONESIGNAL_GOOGLE_PROJECT_NUMBER="[your G project number goes here]"
```

**Signing**
- Official guide: https://facebook.github.io/react-native/docs/signed-apk-android.html
- `~/.gradle/gradle.properties` -> ref to Keystore file and passwords
- `app/android/app/build.gradle` -> `signingConfigs` + `buildTypes.release`

**Gradle Stuff**
- `app/android/settings.gradle` -> list of packages and main app
- `app/android/build.gradle` -> global Gradle stuff, don't touch it
- `app/android/app/build.gradle` -> config for the app itself, including App signing configs

**Build!**
build signed APK: `android$ ./gradlew assembleRelease`
*(this app is without debugging bridge and included JS lib)*

install to connected device: `android$ ./gradlew installRelease`

**Check APK**
check for the correct `versionControl`:

`android$ aapt dump badging app/build/outputs/apk/app-release.apk`


### iOS 

- Bundle Identifier: `de.okfn.chemnitz.TheaterWecker`
- Version: 1.0
- Build: 1
- Device: iPhone
- Build Settings: Enable Bitcode: false


## SVGs

- there is no good module for display an SVG file
- so they are converted to PNG
- via ImageMagick `convert -background none ../www/static/img/foobar.svg images/foobar.png`


## Stories

### Init of app

1. App to OneSignal via REST -> Register device (automatically)
2. Create/Register device -> App to Backend via REST -> `POST /api/device c732c64a-9409-4af3-b0dc-1ff93e084b5b`
   - `curl -X POST -d 'c732c64a-9409-4af3-b0dc-1ff93e084b5b' https://theaterwecker.de/api/device/`
   - Status 201 -> created
   - Status 200 -> exists
3. Fetch all possible categories -> App to Backend via REST -> GET /api/categories
   - `curl https://theaterwecker.de/api/categories/`

### On first start of app -> Verify device

1. Backend to OneSignal via REST -> Notification with hidden secret (URL to backend with hash)
2. User clicks Notifcation - opens App - jump into `onNotificationOpened` with data `{"verification":"KEY"}`
3. App to Backend via REST -> `GET /api/verify/KEY`

- prevents mass user/device creation
- backend needs to cleanup not validated users/devices

### User pushs "abonnieren" button (first time or all other times)

- App to Backend via REST ->  `POST /api/subscribe {'deviceId':'c732c64a-9409-4af3-b0dc-1ff93e084b5b','categories':[]}


## Upgrade RN (via Git)

https://facebook.github.io/react-native/docs/upgrading.html

```
react-native-git-upgrade
```
