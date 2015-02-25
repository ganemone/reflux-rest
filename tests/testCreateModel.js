var assert = require('chai').assert;
var createModel = require('../js/createModel');

describe('createModel', function () {
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
  it('should create a constructor correctly', function () {
    assert.equal(testNewModel.username, 'ganemone');
    assert.equal(testNewModel.firstName, 'somename');
  });
  it('should have a toJSON method that works correctly', function () {
    assert.deepEqual(testNewModel.toJSON(), {
      type: 'Model',
      username: 'ganemone',
      firstName: 'somename'
    });
    assert.deepEqual(testNewModel.toJSON(), testNewModel.__toJSON())
  });
});