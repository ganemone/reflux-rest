var Reflux = require('reflux');
var request = require('superagent');

function createActions(resource, methods) {

  var resourceUrl = '/' + resource.name;
  var actionConfig = {};
  var actionChildren = {
    children: ['completed', 'failed']
  };

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
  if (methods.UPDATE) {
    actionConfig.update = actionChildren;
  }

  var actions = Reflux.createActions(actionConfig);

  if (methods.GET) {
    actions.load.preEmit = function() {
      request
        .get(resourceUrl)
        .end(getCB(this.failed, this.completed));
    };
  }

  if (methods.POST) {
    actions.create.preEmit = function(model) {
      request
        .post(resourceUrl)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(model.toJSON())
        .end(getCB(this.failed, this.completed));
    };
  }

  if (methods.PUT) {
    var putFunc = function(model) {
      request
        .put(resourceUrl + '/' + model.id)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(model.toJSON())
        .end(getCB(this.failed, this.completed));
    };
    actions.put.preEmit = putFunc;
    if (methods.UPDATE === 'PUT') {
      actions.update.preEmit = putFunc;
    }
  }

  if (methods.PATCH) {
    var patchFunc = function(model) {
      request
        .patch(resourceUrl + '/' + model.id)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(model.toJSON())
        .end(getCB(this.failed, this.completed));
    };
    actions.patch.preEmit = patchFunc;
    if (methods.UPDATE === 'PATCH') {
      actions.update.preEmit = patchFunc;
    }
  }

  if (methods.DELETE) {
    actions.delete.preEmit = function(model) {
      request
        .delete(resourceUrl + '/' + model.id)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .end(getCB(this.failed, this.completed));
    };
  }
  return actions;
}

function getCB(errorFunc, okFunc) {
  return function _cb(error, response) {
    if (error) {
      return errorFunc(error);
    }
    if (response.status >= 400) {
      return errorFunc(null, response);
    }
    return okFunc(response);
  };
}



module.exports = createActions;