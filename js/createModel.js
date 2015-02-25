
function createModel(resource) {

  // Dynamically create constructor for model
  // TODO: Type checking + required vs non-required
  var _createModel = function(obj) {
    obj = obj || {};
    for (var prop in resource.structure) {
      if (resource.structure.hasOwnProperty(prop)) {
        this[prop] = obj[prop];
      }
    }
  }

  _createModel.prototype.toJSON = function() {
    return this.__toJSON();
  }

  _createModel.prototype.__toJSON = function() {
    var json = {
      type: resource.name
    };
    for (var prop in resource.structure) {
      if (resource.structure.hasOwnProperty(prop)) {
        json[prop] = this[prop];
      }
    }
    return json;
  }
  return _createModel;
}

module.exports = createModel;