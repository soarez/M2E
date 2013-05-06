var EventEmitter = require('events').EventEmitter;

var SEPARATOR = ':';

function event2message(name, args) {
  var message = name + SEPARATOR + JSON.stringify(args);

  return message;
}

function message2event(message) {
  var name, args;

  var indexOfSeparator = message.indexOf(SEPARATOR);
  if (~indexOfSeparator) {
    name = message.substring(0, indexOfSeparator);
    args = JSON.parse(message.substring(indexOfSeparator + 1));
  } else {
    name = message;
    args = undefined;
  }

  return {
    name: name,
    args: args
  };
}

function M2E(onMessage) {
  var m2e = new EventEmitter;

  m2e.onMessage = onMessage;

  var localEmit = m2e.emit;

  m2e.emit =
  function remoteEmit() {
    if (!this.sendMessage) {
      throw Error('sendMessage is not defined');
    }

    var args = Array.prototype.slice.call(arguments);
    var name = args.shift();

    if (!M2E.propagateNewListener && name === 'newListener')
      return;

    var msg = event2message(name, args);
    try {
      this.sendMessage(msg);
    } catch (error) {
      if (this.listeners(this.errorname).length)
        EventEmitter.prototype.trigger.call(this, this.errorname, [error]);
      else
        throw error;
    }
  };

  m2e.onMessage =
  function onMessage(msg) {
    var evt = message2event(msg);
    var args = evt.args;
    args.unshift(evt.name);
    localEmit.apply(m2e, args);
  };

  return m2e;
}

module.exports = M2E;
M2E.event2message = event2message;
M2E.message2event = message2event;
