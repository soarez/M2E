test('end to end', function() {
  var channel1 = new M2E();
  channel1.sendMessage = function() {
    var args = Array.prototype.slice.call(arguments);
    sendMessageTo2.apply(null, args);
  };

  var channel2 = new M2E();
  channel2.sendMessage = function() {
    var args = Array.prototype.slice.call(arguments);
    sendMessageTo1.apply(null, args);
  };
  
  function sendMessageTo1(msg) { channel1.onmessage(msg); }
  function sendMessageTo2(msg) { channel2.onmessage(msg); }

  channel2.listen('echo', function(arg1, arg2) {
    channel2.fire('customEvt', arg1, arg2);
  });

  var p1 = 'abc', p2 = 'def';
  channel1.listen('customEvt', function(arg1, arg2) {
    ok(arg1 == p1);
    ok(arg2 == p2);
  });
  channel1.fire('echo', p1, p2);

  expect(2);
});

test('m2e instance', function() {
  var worker = new Worker('worker.js?fu_cache=' + (+new Date()));

  var m2e = new M2E();
  m2e.sendMessage = function(arg) {
    worker.postMessage(arg);
    console.log('msg sent to worker: %s', arg);
  };
  worker.onmessage = function(event) {
    console.log('msg received from worker: %s', event.data);
    m2e.onmessage(event.data);
  };

  var p1 = 'abc', p2 = 'def';
  m2e.listen('customEvt', function(arg1, arg2) {
    ok(arg1 == p1);
    ok(arg2 == p2);
    start();
  });
  m2e.fire('echo', p1, p2);

  expect(2);
  stop();
});
