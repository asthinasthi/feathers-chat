const assert = require('assert');
const app = require('../../src/app');

describe('\'elders\' service', () => {
  it('registered the service', () => {
    const service = app.service('elders');

    assert.ok(service, 'Registered the service');
  });

  it('should create an elder', () => {
    const service = app.service('elders');
    service.create({
      firstName: 'John',
      lastName: 'Travolta'
    }).then((data)=>{console.log(data)})
    // assert.ok(service, 'Registered the service');
  });
});
