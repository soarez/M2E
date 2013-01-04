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
