# M2E

#### *Simple Message to Events plug.*

Some APIs are message oriented, like the WebWorker's and WebSocket's API.

I prefer to work with events.

## Usage

To create an M2E object, you need to give it a function to send messages,
when events are triggered, and there's a hook you're responsible to call when
a new message arrives.

Example with webworkers:

````js
// WebWorker

importScripts('build/m2e.js);

// ***********
// ** M2E PLUG
var m2e = M2E(self.postMessage.bind(self));
self.onmessage = function(event) { m2e.onmessage(event.data); };

// 
m2e.addListener('echo', function(arg1, arg2) {
  m2e.emit('customEvt', arg1, arg2);
});
````

GUI thread:

````js
var worker = new Worker('worker.js?fu_cache=' + +new Date());

var m2e = M2E(worker.postMessage.bind(worker));
worker.onmessage = function(event) { m2e.onmessage(event.data); };

var p1 = 'abc', p2 = 'def';
m2e.addListener('customEvt', function(arg1, arg2) {
  // p1 == 'abc'
  // p2 == 'def'
})
m2e.emit('echo', p1, p2);
````

## License

MIT
