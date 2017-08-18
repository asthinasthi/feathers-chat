const { authenticate } = require('feathers-authentication').hooks;
const { populate } = require('feathers-hooks-common');
// import {populate} from 'feathers-hooks-common'
const processActivity = require('../../hooks/process-activity');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [processActivity()],
    update: [processActivity()],
    patch: [processActivity()],
    remove: []
  },

  after: {
    all: [
      populate({
        schema:{
          include:[{
            service: 'users',
            nameAs: 'user',
            parentField: 'userId',
            childField: '_id'
          },
          {
            service: 'elders',
            nameAs: 'elder',
            parentField: 'elderId',
            childField: '_id'
          }
          ]
        }
      })
    ],
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
