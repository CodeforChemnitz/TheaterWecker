# TheaterWecker App

![Screenshot iOS](screenshot-ios.png)
 
## Run it!

To run your app on iOS:
- `cd /Users/ronny/dev/oklabs/TheaterWecker/app`
- `react-native run-ios`

- or -

- Open `./TheaterWecker/app/ios/TheaterWecker.xcodeproj` in Xcode
- Hit the Run button

To run your app on Android:

- Have an Android emulator running (quickest way to get started), or a device connected
- `cd /Users/ronny/dev/oklabs/TheaterWecker/app`
- `react-native run-android`

## SVGs

- there is no good module for display an SVG file
- so they are converted to PNG
- via ImageMagick `convert -background none ../www/static/img/foobar.svg images/foobar.png`

