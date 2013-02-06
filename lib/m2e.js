var SEPARATOR = ':';
var isNodeEnv = typeof module !== 'undefined' && module.exports;

function event2message(evtName, args) {
  var message = evtName + SEPARATOR + JSON.stringify(args);

  return message;
}

function message2event(message) {

  var indexOfSeparator = message.indexOf(SEPARATOR);

  if (!~indexOfSeparator)
    throw new Error('Invalid M2E message');

  var evtName = message.substring(0, indexOfSeparator);
  var argsString = message.substring(indexOfSeparator + 1);
  var args = JSON.parse(argsString);

  return {
    name: evtName,
    args: args
  };
}

function inherits(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
}

var Super = isNodeEnv ? require('events').EventEmitter : EventManager;

function M2E() {
  Super.call(this);
}
inherits(M2E, Super);

function triggerRemoteEvent(evtName, args) {
  var msg = event2message(evtName, args);
  this.sendMessage(msg);
}

function fireRemoteEvent(evtName) {
  var args = Array.prototype.slice.call(arguments, 1);
  triggerRemoteEvent.call(this, evtName, args);
}

function onmessageNode(msg) {
  var evt = message2event(msg);
  var args = evt.args;
  args.unshift(evt.name);
  Super.prototype.emit.apply(this, args);
}

function onmessageBrowser(msg) {
  var evt = message2event(msg);
  Super.prototype.trigger.call(this, evt.name, evt.args);
}

M2E.prototype.emit = fireRemoteEvent;

if (!isNodeEnv) {
  M2E.prototype.onmessage = onmessageBrowser;
  M2E.prototype.trigger = triggerRemoteEvent;
  M2E.prototype.fire = fireRemoteEvent;
} else {
  M2E.prototype.onmessage = onmessageNode;
  module.exports = M2E;
}
