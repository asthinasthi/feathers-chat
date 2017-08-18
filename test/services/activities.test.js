const assert = require('assert');
const app = require('../../src/app');
const client = feathers()

describe('\'activities\' service', () => {
  it('registered the service', () => {
    const service = app.service('activities');

    assert.ok(service, 'Registered the service');
  });

  it('should create an activity', () => {
    // const service = app.service('activities');
    client.service('activities').create({
      type: 'IN_PERSON'
    })
    // assert.ok(service, 'Registered the service');
  });
});
