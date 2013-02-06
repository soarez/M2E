# M2E

#### *Simple Message to Events plug.*

Some APIs are message oriented, like the WebWorker's and WebSocket's API.

I prefer to work with events.

## Usage

Example with webworkers:

    // WebWorker

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

GUI thread:

    var worker = new Worker('worker.js?fu_cache=' + +new Date());

    var m2e = new M2E();
    m2e.sendMessage = worker.postMessage.bind(worker);
    worker.onmessage = function(event) {
      m2e.onmessage(event.data);
    };

    var p1 = 'abc', p2 = 'def';
    m2e.listen('customEvt', function(arg1, arg2) {
      // p1 == 'abc'
      // p2 == 'def'
    })
    m2e.fire('echo', p1, p2);

#### `trigger()` vs `fire()`

`trigger` is to `fire` as `apply` is to `call`.

    // same
    m2e.trigger('evtName', [arg1, arg2]);
    m2e.fire('evtName', arg1, arg2);

## License

MIT
