var assert = require('chai').assert;
var createActions = require('./createActions');
var createModel = require('./createModel');

function createResource(obj) {
  assert.deepProperty(obj, 'resource.name');
  assert.deepProperty(obj, 'resource.structure');
  assert.deepProperty(obj, 'methods.get');
  assert.deepProperty(obj, 'methods.put');
  assert.deepProperty(obj, 'methods.post');
  assert.deepProperty(obj, 'methods.patch');
  assert.deepProperty(obj, 'methods.delete');
  return _createResource(obj);
}

function _createResource(obj) {
  var resource = obj.resource;
  var methods = obj.methods;

  var model = createModel(resource);
  var actions = createActions(resource, methods);

  return {
    model: model,
    actions: actions,
  };
}

module.exports = createResource;
