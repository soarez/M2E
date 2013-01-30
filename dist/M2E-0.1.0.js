(function(exports) {

/*
 * An event manager, holds queues for events and triggers them on cue.
 */

function EventManager() {
  this.events = {};
}

EventManager.prototype.listen = function(evtName, cb, ctx) {
  if (!this.events.hasOwnProperty(evtName))
    this.events[evtName] = { 
      queue: [],
      map: {}
    };

  var evt = this.events[evtName];
  if (~evt.queue.indexOf(cb))
    return;

  evt.queue.push(cb);
  evt.map[cb] = ctx;
};

EventManager.prototype.ignore = function(evtName, cb) {
  if (!this.events.hasOwnProperty(evtName))
    return false;

  var evt = this.events[evtName];

  if (!evt || evt.queue.length === 0)
    return false;

  var index = evt.queue.indexOf(cb);
  if (!~index)
    return false;

  evt.queue.splice(idx, 1);
  delete evt.map[cb];

  if (evt.queue.length === 0)
    delete this.events[evtName];

  return true;
};

EventManager.prototype.trigger = function(evtName, args) {
  var evt = this.events[evtName];
 
  if (!evt || evt.queue.length === 0)
    return false;

  for (var idx = 0; idx < evt.queue.length; ++idx) {
    var cb = evt.queue[idx];
    var ctx = evt.map[cb];
    cb.apply(ctx, args);
  }

  return true;
};

EventManager.prototype.fire = function(evtName) {
  var args = Array.prototype.slice.call(arguments, 1);
  this.trigger(evtName, args);
};

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


exports.M2E = M2E;

})(self);
