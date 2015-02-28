var Reflux = require('reflux');
var request = require('superagent');

function createActions(resource, methods) {

  var resourceUrl = '/' + resource.name;
  var actionConfig = {};
  var actionChildren = {
    children: ['completed', 'failed']
  };

  if (methods.get) {
    actionConfig.load = actionChildren;
  }
  if (methods.post) {
    actionConfig.create = actionChildren;
  }
  if (methods.put) {
    actionConfig.put = actionChildren;
  }
  if (methods.patch) {
    actionConfig.patch = actionChildren;
  }
  if (methods.delete) {
    actionConfig.delete = actionChildren;
  }
  if (methods.update) {
    actionConfig.update = actionChildren;
  }

  // Implement API calls to other additional defined actions
  // otherActions: [
  // {
  //   name: Required
  //   endpoint: Optional - uses configuration + name if not specified
  //   methods: [ List of Supported methods (get, put, post, etc) ]
  // }, ...
  // ]
  if (methods.otherActions) {
    for (var prop in methods.otherActions) {
      if (methods.otherActions.hasOwnProperty(prop)) {
        actionConfig[prop] = actionChildren;

      }
    }
  }

  var actions = Reflux.createActions(actionConfig);

  function getResourceURL() {
    return resourceUrl;
  }

  function getResourceIDURL(model) {
    return resourceUrl + '/' + model.id;
  }

  if (methods.get) {
    actions.load.preEmit = createAction('get', getResourceURL);
  }

  if (methods.post) {
    actions.create.preEmit = createAction('post', getResourceURL, true);
  }

  if (methods.put) {
    var putFunc = createAction('put', getResourceIDURL, true);
    actions.put.preEmit = putFunc;
    if (methods.update === 'put') {
      actions.update.preEmit = putFunc;
    }
  }

  if (methods.patch) {
    var patchFunc = createAction('patch', getResourceIDURL, true);
    actions.patch.preEmit = patchFunc;
    if (methods.update === 'patch') {
      actions.update.preEmit = patchFunc;
    }
  }

  if (methods.delete) {
    actions.delete.preEmit = createAction('delete', getResourceIDURL, true);
  }
  console.log('Actions: ', actions);
  return actions;

  function createAction(method, getUrl, includeBody) {
    return function preEmit(model) {
      var req = request[method](getUrl(model));
      req.set('Accept', 'application/json');
      req.set('Content-Type', 'application/json');
      if (includeBody) {
        req.send(model.toJSON);
      }
      req.end(getCB(this.failed, this.completed));
    };
  }

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