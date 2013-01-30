var SEPARATOR = ':';

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

function M2E() {
  EventManager.call(this);
}
inherits(M2E, EventManager);

M2E.prototype.trigger = function(evtName, args) {
  var msg = event2message(evtName, args);
  this.sendMessage(msg);
};

M2E.prototype.onmessage = function(msg) {
  var evt = message2event(msg);
  var trigger = EventManager.prototype.trigger;
  trigger.call(this, evt.name, evt.args);
};

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
