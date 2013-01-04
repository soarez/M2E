test('registered event gets called', function() {
  var em = new EventManager();

  em.listen('evt1', cb);
  em.trigger('evt1');

  function cb() {
    ok(true);
  }

  expect(1);
});

test('event parameters', function() {
  var em = new EventManager();

  var param1 = {}, param2 = {};

  em.listen('eargs', cb);
  em.trigger('eargs', [ param1, param2 ]);

  function cb(p1, p2) {
    ok(p1 == param1);
    ok(p2 == param2);
  }

  expect(2);
});
