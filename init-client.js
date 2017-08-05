import { Logger } from 'meteor/ostrio:logger'
import { LoggerConsole } from 'meteor/ostrio:loggerconsole'

const PreviousGlobalErrorHandler = window.onerror
const originalMeteorDebug = Meteor._debug
const stackRegex = /^\s+at\s.+$/gm

function getStackFromMessage(message) {
  // add empty string to add the empty line at start
  const stack = ['']
  // const match = stackRegex.exec(message)
  while (match = stackRegex.exec(message)) {
    stack.push(match[0])
  }
  return stack.join('\n')
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
  // Initialize Logger:
  const log = new Logger();

  // Initialize and enable LoggerConsole with default settings:
  (new LoggerConsole(log)).enable()
  window.onerror = (msg, url, line) => {
    log.error(msg, { file: url, onLine: line, browserInfo: getBrowserInfo() })
    if (PreviousGlobalErrorHandler) {
      PreviousGlobalErrorHandler.apply(this, arguments)
    }
  }

  Meteor._debug = (m, s) => {
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
      time: now,
      browserInfo: getBrowserInfo(),
      stacks: JSON.stringify([{ at: now, events: [], stack }]) })
    return originalMeteorDebug.apply(this, arguments)
  }
})
