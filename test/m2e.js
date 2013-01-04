test('message2event', function() {
  var message = 'evt1:[1,2,3]';

  var evt = message2event(message);

  ok(evt.name === 'evt1');
  ok(JSON.stringify(evt.args) === JSON.stringify(JSON.parse('[1,2,3]')));
})

test('event2message', function() {
  var evtName = 'evt2';
  var args = [{a:1}, {b:2}];

  var message = event2message(evtName, args);

  ok(message === 'evt2:' + JSON.stringify(args));
})