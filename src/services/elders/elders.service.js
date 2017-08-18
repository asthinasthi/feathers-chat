// Initializes the `elders` service on path `/elders`
const createService = require('feathers-nedb');
const createMongoService = require('feathers-mongoose');
const createModel = require('../../models/elders.model');
const hooks = require('./elders.hooks');
const filters = require('./elders.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'elders',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/elders', createMongoService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('elders');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
