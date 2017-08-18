// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function processElder (hook) {
    // Hooks can either return nothing or a promise
    // that resolves with the `hook` object for asynchronous operations
    console.log('Processing Elder ...')
    console.log(hook.data)
    const firstName = hook.data.firstName;
    const lastName = hook.data.lastName;
    hook.data = {
      firstName,
      lastName,
      // Add the current time via `getTime`,
      fullName: firstName + ' ' + lastName,
      createdAt: new Date().getTime()
    };
    console.log(hook.data)
    return Promise.resolve(hook);
  };
};
