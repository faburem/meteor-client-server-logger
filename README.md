# meteor-client-server-logger
Easily transfer client side errors in Meteor.js applications to the server log.
This package depends on [ostrio:logger](https://atmospherejs.com/ostrio/logger) and [ostrio:loggerconsole](https://atmospherejs.com/ostrio/loggerconsole) and only adds boilerplate code to your Meteor applications startup() functions to enable the client side features as described in the package Readme. The client side error catching is using [kadira's](https://github.com/meteorhacks/kadira/) error reporter code. All credits go to the respective package creators - thanks for your amazing work!

## Install
```meteor add faburem:client-server-logger```

## Features
* Zero-config: just add the package and enjoy your client side errors in your server console
* Lightweight: only adding a maximum of 10K (including all dependencies) to your production app code size
* Non-intrusive: should not conflict with any of your other packages
* Alert-friendly: designed for production apps where it is important to get alerts fast and efficient. Therefore there is no pretty printing to the log, you can handle that in your log processing later on. This pairs pretty well with bots for i.e. Slack, Rocket.Chat, ...
