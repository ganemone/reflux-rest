var assert = require('chai').assert;
var createActions = require('../js/createActions');

describe('createActions', function () {
  var resource = {
    name: 'Model',
    structure: {
      username: {
        'required': true,
        'type': String
      },
      firstName: {
        'required': false,
      }
    }
  };
  var methods = {
    'GET': true,
    'POST': true,
    'PUT': true,
    'PATCH': true,
    'DELETE': true
  };

  actions = createActions(resource, methods);

  describe('creating actions', function () {
    it('load should exist', function () {
      assert.ok(actions.load);
      assert.equal(typeof actions.load.listen, 'function');
    });
    it('create should exist', function () {
      assert.ok(actions.create);
      assert.equal(typeof actions.create.listen, 'function');
    });
    it('put should exist', function () {
      assert.ok(actions.put);
      assert.equal(typeof actions.put.listen, 'function');
    });
    it('patch should exist', function () {
      assert.ok(actions.patch);
      assert.equal(typeof actions.patch.listen, 'function');
    });
    it('delete should exist', function () {
      assert.ok(actions.delete);
      assert.equal(typeof actions.delete.listen, 'function');
    });
  });
});