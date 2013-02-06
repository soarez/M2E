var assert = require('assert');

var M2E = require('../lib/m2e.js');

var called = false;

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

channel2.on('echo', function(arg1, arg2) {
  channel2.emit('customEvt', arg1, arg2);
});

var p1 = 'abc', p2 = 'def';
channel1.on('customEvt', function(arg1, arg2) {
  assert(arg1 == p1);
  assert(arg2 == p2);
  called = true;
});
channel1.emit('echo', p1, p2);

assert(called);
