// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function processActivity (hook) {
    // Hooks can either return nothing or a promise
    // that resolves with the `hook` object for asynchronous operations
        // The authenticated user
    const user = hook.params.user;
    console.log(hook.data)
    const activityType = hook.data.type;
    const activityDate = hook.data.activityDate;
    const elderHealthConcern = hook.data.elderHealthConcern;
    const elderHealthStatus = hook.data.elderHealthStatus;
    const elderId = hook.data.elderId;
    const hours = hook.data.hours;
    // The actual message text
    // const text = hook.data.text
    //   // Messages can't be longer than 400 characters
    //   .substring(0, 400)
    //   // Do some basic HTML escaping
    //   .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

    // Override the original data
    hook.data = {
      activityType,
      activityDate: new Date(activityDate).getTime(),
      elderHealthConcern,
      elderHealthStatus,
      // Set the user id
      userId: user._id,
      elderId: elderId,
      hours,
      // Add the current time via `getTime`
      createdAt: new Date().getTime()
    };
    return Promise.resolve(hook);
  };
};
