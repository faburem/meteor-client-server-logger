import { Logger } from 'meteor/ostrio:logger'
import { LoggerConsole } from 'meteor/ostrio:loggerconsole'

Meteor.startup(() => {
  // Initialize Logger:
  const logger = new Logger();
  // Initialize and enable LoggerConsole with default settings:
  // (new LoggerConsole(logger)).enable()

  (new LoggerConsole(logger, {
    server: false,
    format(opts) {
      return `[CLIENT] ${opts.message} - ${JSON.stringify(opts.data)}`
    },
  })).enable()
})
