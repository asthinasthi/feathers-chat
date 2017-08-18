const { authenticate } = require('feathers-authentication').hooks;
const { populate } = require('feathers-hooks-common');
const processElder = require('../../hooks/process-elder');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [processElder()],
    update: [processElder()],
    patch: [processElder()],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
