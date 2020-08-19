# Cordova Plugin Google Tag Manager For IOS

This plugin will add ios packages to google tag manager and will configure the GTM file in the project.

## Install Plugin

- execute in terminal `cordova plugin add cordova-plugin-google-tag-manager-ios --variable GTM_FILE_NAME="GTM-xxxxxxx.json" --save`

## Change the name of your config file later

- In `config.xml` add configuration for plugin:

```xml
<plugin name="cordova-plugin-google-tag-manager-ios" spec="^1.0.0">
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
