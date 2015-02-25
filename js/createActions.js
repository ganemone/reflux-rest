var Reflux = require('reflux');
var request = require('browser-request');

function createActions(resource, methods) {

  var resourceUrl = '/' + resource.name;
  var actionConfig = {};
  var actionChildren = {
    children: ['completed', 'failed']
  }

  if (methods.GET) {
    actionConfig.load = actionChildren;
  }
  if (methods.POST) {
    actionConfig.create = actionChildren;
  }
  if (methods.PUT) {
    actionConfig.put = actionChildren;
  }
  if (methods.PATCH) {
    actionConfig.patch = actionChildren;
  }
  if (methods.DELETE) {
    actionConfig.delete = actionChildren;
  }

  var actions = Reflux.createActions(actionConfig);

  if (methods.GET) {
    actions.load.listen = function() {
      request({
        method: 'GET',
        url: resourceUrl,
        json: true
      }, getCB(this.failed, this.completed));
    }
  }

  if (methods.POST) {
    actions.create.listen = function(model) {
      request({
        method: 'POST',
        url: resourceUrl,
        json: model.toJSON()
      }, getCB(this.failed, this.completed));
    }
  }

  if (methods.PUT) {
    actions.put.listen = function(model) {
      request({
        method: 'PUT',
        url: resourceUrl + '/' + model.id,
        json: model.toJSON()
      }, getCB(this.failed, this.completed));
    }
  }

  if (methods.PATCH) {
    actions.patch.listen = function(model) {
      request({
        method: 'PATCH',
        url: resourceUrl + '/' + model.id,
        json: model.toJSON()
      }, getCB(this.failed, this.completed));
    }
  }

  if (methods.DELETE) {
    actions.delete.listen = function(model) {
      request({
        method: 'DELETE',
        url: resourceUrl + '/' + model.id,
        json: model.toJSON(),
        }, getCB(this.failed, this.completed));
    }
  }
}

function getCB(errorFunc, okFunc) {
  return function _cb(error, response) {
    if (error) {
      return errorFunc(error);
    }
    return okFunc(response);
  };
}



module.exports = createActions;