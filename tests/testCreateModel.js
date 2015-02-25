var assert = require('chai').assert;
var createModel = require('../js/createModel');

describe('createModel', function () {
  it('should create a constructor correctly', function () {
    var Model = createModel({
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
    });
    var testNewModel = new Model({
      username: 'ganemone',
      firstName: 'somename'
    });
    assert.equal(testNewModel.username, 'ganemone');
    assert.equal(testNewModel.firstName, 'somename');
  });
});