var assert = require('chai').assert;
var createActions = require('./createActions');
var createModel = require('./createModel');
var createStore = require('./createStore');

function createResource(obj) {
  assert.deepProperty(obj, 'resource.name');
  assert.deepProperty(obj, 'resource.structure');
  assert.deepProperty(obj, 'methods.GET');
  assert.deepProperty(obj, 'methods.PUT');
  assert.deepProperty(obj, 'methods.POST');
  assert.deepProperty(obj, 'methods.DELETE');
  return _createResource(obj);
}

function _createResource(obj) {
  var resource = obj.resource;
  var methods = obj.methods;

  var model = createModel(resource);
  var actions = createActions(resource, methods);
  var createStore = createStore(resource, methods, actions);

  return {
    model: model,
    actions: actions,
    createStore: createStore
  }
}
