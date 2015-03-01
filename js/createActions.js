var Reflux = require('reflux');
var request = require('superagent');

var methodMap = {
  get: 'load',
  post: 'create',
  put: 'put',
  patch: 'patch',
  delete: 'delete',
  update: 'update'
};

var includeBodyMap = {
  'get': false,
  'post': true,
  'patch': true,
  'put': true,
  'delete': false
};

var urlMap = {
  'get': 'base',
  'post': 'base',
  'patch': 'id',
  'put': 'id',
  'delete': 'id'
};

function createActions(obj) {

  var resource = obj.resource;
  var methods = obj.methods;
  var otherActions = obj.otherActions;
  var resourceUrl = '/' + resource.name;
  var actionConfig = {};
  var actionChildren = {
    children: ['completed', 'failed']
  };

  for (var method in methods) {
    if (methods.hasOwnProperty(method)) {
      actionConfig[methodMap[method]] = actionChildren;
    }
  }

  // Add other actions to action config
  otherActions.forEach(function(action) {
    actionConfig[action.name] = actionChildren;
  });

  var actions = Reflux.createActions(actionConfig);
  for (method in methods) {
    if (methods.hasOwnProperty(method) && method !== 'update') {
      actions[methodMap[method]].preEmit = createAction(method, resourceUrl);
    }
  }

  if (methods.update === 'patch') {
    actions.update.preEmit = actions.patch.preEmit;
  } else if (methods.update === 'put') {
    actions.upodate.preEmit = actions.put.preEmit;
  }

  if (methods.get) {
    actions.load.preEmit = createAction('get', resourceUrl);
  }

  if (methods.post) {
    actions.create.preEmit = createAction('post', resourceUrl);
  }

  if (methods.put) {
    var putFunc = createAction('put', resourceUrl);
    actions.put.preEmit = putFunc;
    if (methods.update === 'put') {
      actions.update.preEmit = putFunc;
    }
  }

  if (methods.patch) {
    var patchFunc = createAction('patch', resourceUrl);
    actions.patch.preEmit = patchFunc;
    if (methods.update === 'patch') {
      actions.update.preEmit = patchFunc;
    }
  }

  if (methods.delete) {
    actions.delete.preEmit = createAction('delete', resourceUrl);
  }

  // Implement API calls to other additional defined actions
  // otherActions: [
  // {
  //   name: Required
  //   endpoint: Optional - uses configuration + name if not specified
  //   excludeBody: optional - rare case where a put/post/patch request
  //   has no body
  //   methods: [ List of Supported methods (get, put, post, etc) ]
  // }, ...
  // ]
  if (otherActions) {
    otherActions.forEach(function(action) {
      var url = action.name;
      if (action.endpoint) {
        url = action.endpoint;
      }
      actions[action.name].preEmit = createAction(action.method, url, action.excludeBody);
    });
  }
  return actions;
}

function createAction(method, baseURL, excludeBody) {
  return function preEmit(model) {
    var url;
    if (urlMap[method] === 'base') {
      url = baseURL;
    } else {
      url = baseURL + '/' + model.id;
    }

    var req = request[method](url);
    req.set('Accept', 'application/json');
    req.set('Content-Type', 'application/json');
    if (includeBodyMap[method] && !excludeBody) {
      req.send(model.toJSON);
    }
    req.end(getCB(this.failed, this.completed));
  };
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