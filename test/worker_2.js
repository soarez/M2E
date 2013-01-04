importScripts('/lib/event_manager.js', '/lib/m2e.js');


// ***********
// ** M2E PLUG
var m2e = new M2E();
m2e.sendMessage = self.postMessage.bind(self);
self.onmessage = function(event) {
  m2e.onmessage(event.data);
}

m2e.listen('echo', function(arg1, arg2) {
  m2e.fire('customEvt', arg1, arg2);
});

