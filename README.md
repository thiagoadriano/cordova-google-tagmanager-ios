# Cordova Plugin Google Tag Manager For IOS

This plugin will add ios packages to google tag manager and will configure the GTM file in the project.

## Dependencies
This plugin has dependencies with Google Analytics or Firebase Analytics among other options reported by Google.
In this link you can access more details on how to export the json container and also the dependencies that TagManager has.

**Google Tag Manager reference document**

[https://developers.google.com/tag-manager/ios/v5](https://developers.google.com/tag-manager/ios/v5)

## Install via npm
- execute in terminal 
```sh
npm install cordova-plugin-google-tag-manager-ios --save
```

## Install Plugin via cordova

- execute in terminal 
```sh
cordova plugin add cordova-plugin-google-tag-manager-ios --variable GTM_FILE_NAME="GTM-xxxxxxx.json" --save
```

## Change the name of your config file later

- In `config.xml` add configuration for plugin:

```xml
<plugin name="cordova-plugin-google-tag-manager-ios" spec="^1.0.3">
  <variable name="GTM_FILE_NAME" value="GTM-xxxxxxx.json" />
</plugin>
```

- change the value the `GTM_FILE_NAME` variable for name file json exported the Google Tag Manager.

## Note

The plug-in will check the container folder and the GTM file in the project when running these cordova commands:

- `cordova prepare`
- `cordova platform add`
- `cordova build`
- `cordova run`
