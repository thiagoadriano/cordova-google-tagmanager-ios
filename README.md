# Cordova Plugin Google Tag Manager For IOS

This plugin will add the GoogleTagManager library to the project and will configure it for the project.

It is necessary to add the json of the GoogleTagManager container settings to the project root.

The file must have the following name GTM-xxxxxxx.json.

## Dependencies
This plugin has dependency on Firebase Analytics.
In this link you can access more details on how to export the json container and also the dependencies that TagManager has.

**Google Tag Manager reference document**

[https://developers.google.com/tag-manager/ios/v5](https://developers.google.com/tag-manager/ios/v5)

## Install Plugin via cordova

- execute in terminal 
```sh
cordova plugin add cordova-plugin-google-tag-manager-ios --save
```

### Note
Among the many streams to perform the procedure of adding the plugin by cordova standard, I always found the problem in TagManagerResources.

As a solution measure add a hook at the end of the build to modify the Podefile and finally add the package as well as add the container to the project.
