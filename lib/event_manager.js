/*
 * An event manager, holds queues for events and triggers them on cue.
 */

function EventManager() {
  this.events = {};
}

var nodeEnv = typeof module !== 'undefined' && module.exports;

function listen(evtName, cb, ctx) {
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
}

function ignore(evtName, cb) {
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
}

function trigger(evtName, args) {
  var evt = this.events[evtName];
 
  if (!evt || evt.queue.length === 0)
    return false;

  for (var idx = 0; idx < evt.queue.length; ++idx) {
    var cb = evt.queue[idx];
    var ctx = evt.map[cb];
    cb.apply(ctx, args);
  }

  return true;
}

function fire(evtName) {
  var args = Array.prototype.slice.call(arguments, 1);
  trigger.call(this, evtName, args);
}

function listeners(evtName) {
  var evt = this.events[evtName];

  if (!evt)
    return [];

  return this.events[evtName].queue.slice();
}

EventManager.prototype.listen = listen;
EventManager.prototype.ignore = ignore;
EventManager.prototype.trigger = trigger;
EventManager.prototype.fire = fire;
EventManager.prototype.listeners = listeners;

EventManager.prototype.addListener = listen;
EventManager.prototype.on = listen;
EventManager.prototype.removeListener = ignore;
EventManager.prototype.emit = fire;

if (nodeEnv)
  module.exports = EventManager;
