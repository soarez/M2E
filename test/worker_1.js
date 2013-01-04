importScripts('/lib/event_manager.js', '/lib/m2e.js');

var em = new EventManager();
em.listen('echo', function(arg1, arg2) {
  em.fire('customEvt', arg1, arg2);
});


// ***********
// ** M2E PLUG
var oldTrigger = em.trigger;
em.trigger = function(evtName, args) {
  var message = event2message(evtName, args);
  self.postMessage(message);
};
self.onmessage = function(event) {
  var evt = message2event(event.data);
  oldTrigger.call(em, evt.name, evt.args);
};
