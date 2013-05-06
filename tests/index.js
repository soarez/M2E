var test = require('tap').test;
var M2E = require('..');

test('message2event', function(t) {
  var message = 'evt1:[1,2,3]';

  var evt = M2E.message2event(message);

  t.ok(evt.name === 'evt1');
  t.ok(JSON.stringify(evt.args) === JSON.stringify(JSON.parse('[1,2,3]')));
  t.end();
});

test('event2message', function(t) {
  var evtName = 'evt2';
  var args = [{a:1}, {b:2}];

  var message = M2E.event2message(evtName, args);

  t.ok(message === 'evt2:' + JSON.stringify(args));
  t.end();
});

test('both', function(t) {
  var evtName = 'evt2';
  var args = [{a:1}, {b:2}];

  var message = M2E.event2message(evtName, args);
  var evt = M2E.message2event(message);

  t.ok(evt.name === evtName);
  t.ok(JSON.stringify(args) === JSON.stringify(evt.args));
  t.end();
});

test('two instances', function(t) {
  var m2eA = M2E();
  var m2eB = M2E();

  m2eA.sendMessage = m2eB.onMessage;
  m2eB.sendMessage = m2eA.onMessage;

  var evtName = Math.random().toString();
  var arg1 = Math.random().toString();
  var arg2 = Math.random().toString();
  var arg3 = Math.random().toString();

  m2eB.on(evtName, function(a1, a2, a3) {
    t.ok(a1);
    t.ok(a2);
    t.ok(a3);
    t.equal(a1, arg1);
    t.equal(a2, arg2);
    t.equal(a3, arg3);
  })
  m2eA.emit(evtName, arg1, arg2, arg3);

  t.end();
});