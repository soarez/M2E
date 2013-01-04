test('worker_events', function() {
  var worker = new Worker('worker_1.js');

  var em = new EventManager();

  // ***********
  // ** M2E PLUG
  var oldTrigger = em.trigger;
  em.trigger = function(evtName, args) {
    var message = event2message(evtName, args);
    worker.postMessage(message);
  };
  worker.onmessage = function(event) {
    var evt = message2event(event.data);
    oldTrigger.call(em, evt.name, evt.args);
  };

  var p1 = 'abc', p2 = 'def';
  em.listen('customEvt', function(arg1, arg2) {
    ok(arg1 == p1);
    ok(arg2 == p2);
    start();
  })
  em.fire('echo', p1, p2);

  expect(2);
  stop();
});

test('m2e instance', function() {
  var worker = new Worker('worker_2.js?fuck_cache=' + +new Date());

  var m2e = new M2E();
  m2e.sendMessage = worker.postMessage.bind(worker);
  worker.onmessage = function(event) {
    m2e.onmessage(event.data);
  };

  var p1 = 'abc', p2 = 'def';
  m2e.listen('customEvt', function(arg1, arg2) {
    ok(arg1 == p1);
    ok(arg2 == p2);
    start();
  })
  m2e.fire('echo', p1, p2);

  expect(2);
  stop();
});
