import { Logger } from 'meteor/ostrio:logger'
import { LoggerConsole } from 'meteor/ostrio:loggerconsole'

const PreviousGlobalErrorHandler = window.onerror
const originalMeteorDebug = Meteor._debug
const stackRegex = /^\s+at\s.+$/gm

function getStackFromMessage(message) {
  const stack = []
  while (match = stackRegex.exec(message)) {
    stack.push(match[0].trim())
  }
  return stack
}

function firstLine(message) {
  return message.split('\n')[0]
}

function getResolution() {
  if (screen && screen.width && screen.height) {
    const resolution = screen.width + 'x' + screen.height
    return resolution
  }
  return false
}

function getBrowserInfo() {
  return {
    browser: window.navigator.userAgent,
    userId: Meteor.userId && Meteor.userId(),
    url: location.href,
    resolution: getResolution(),
  }
}

Meteor.startup(() => {
  const log = new Logger();
  (new LoggerConsole(log, {
    format(opts) {
      return 'Error reported to server log.'
    },
  })).enable()
  window.onerror = (msg, url, line) => {
    log.error(msg, { file: url, onLine: line, browserInfo: getBrowserInfo() })
    if (PreviousGlobalErrorHandler) {
      PreviousGlobalErrorHandler.apply(this, arguments)
    }
  }

  Meteor._debug = function meteorDebug(m, s) {
    // We need to asign variables like this. Otherwise,
    // we can't see proper error messages.
    // See: https://github.com/meteorhacks/kadira/issues/193
    let message = m
    let stack = s
    // We hate Meteor._debug (no single usage pattern)
    if (message instanceof Error) {
      stack = message.stack
      message = message.message
    } else if (typeof message === 'string' && stack === undefined) {
      stack = getStackFromMessage(message)
      message = firstLine(message)
    }
    // sometimes Meteor._debug is called with the stack concat to the message
    // FIXME Meteor._debug can be called in many ways
    if (message && stack === undefined) {
      stack = getStackFromMessage(message)
      message = firstLine(message)
    }
    const now = (new Date().getTime())
    log.error(message, {
      browserInfo: getBrowserInfo(),
      stack })
    return originalMeteorDebug.apply(this, arguments)
  }
})
