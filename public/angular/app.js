const client = feathers();

// client.configure(feathers.socketio(socket));
const serverUrl = 'http://localhost:3030'
client.configure(feathers.rest(serverUrl).fetch(fetch));
client.configure(feathers.hooks());
// Use localStorage to store our login token
client.configure(feathers.authentication({
  storage: window.localStorage
}));

var lbfeApp = angular.module('lbfeApp', ['bootstrap3-typeahead']);

lbfeApp.controller('mainCtrl', ['$scope', function ($scope) {

  //var declare
  $scope.menu = {}
  $scope.elders = []
  $scope.checkIn = {}
  $scope.checkIn.isSubmitted = false;
  $scope.loggedInUser = {}
  $scope.myHistory = {}
  $scope.leaderboard = {}

  $scope.init = function () {
    //TODO searchable list instead of all dump
    client.service('elders').find().then((res) => {
      console.log('Finding all elders')
      console.log(res)
      $scope.elders = res.data
      $scope.elders.map(function (e) {
        e.name = e.firstName + ' ' + e.lastName
      })
      console.log($scope.elders)
      $scope.$apply();
    })
    $scope.menu = {
      home: true,
      history: false,
      leaderboard: false,
      profile: false
    }
    $scope.login()


  }

  $scope.welcomeMessage = 'LBFE Check in App!'
  $scope.isLoggedIn = false;
  // if not login show login page
  $scope.login = function (formData) {
    var credentials = null
    if (formData != null) {
      credentials = {
        email: formData.email,
        password: formData.password
      }
    }

    const payload = credentials ?
      Object.assign({ strategy: 'local' }, credentials) : {};
    console.log('Payload: %s', JSON.stringify(payload, null, 2))

    return client.authenticate(payload)
      .then((data) => {
        console.log(data)
        console.log('Logged in successfully ...');
        $scope.isLoggedIn = true
        $scope.welcomeMessage = 'You have logged in successfully!'
        console.log($scope.isLoggedIn)
        console.log($scope)
        $scope.$apply()
        return client.passport.verifyJWT(data.accessToken)
      })
      .then((payload) => {
        console.log('Finding logged in user')
        console.log(payload)
        return $scope.loggedInUser = client.service('users').get(payload.userId, {})
      })
      .then((user) => {
        console.log(user)
        $scope.loggedInUser = user;
        $scope.$apply()
      })
      .catch((err) => {
        console.log(err)
        $scope.isLoggedIn = false
      });
  }

  $scope.logout = function () {
    client.logout().then(() => {
      console.log('Logged out.')
      $scope.isLoggedIn = false;
      $scope.$apply()
    })
  }

  $scope.register = function (registerData) {
    var user = {
      firstName: 'Anonymous',
      lastName: 'Panda',
      anonymous: true,
      email: registerData.email,
      password: registerData.password
    }
    // For signup, create a new user and then log them in
    client.service('users').create(user)
      .then(() => {
        console.log('Registration successful')
        $scope.registerData.email = ''
        $scope.registerData.password = ''
        $scope.$apply()
      });
  }

  $scope.activateNav = function (nav) {
    for (var keyIdx in Object.keys($scope.menu)) {
      $scope.menu[Object.keys($scope.menu)[keyIdx]] = false
    }
    $scope.menu[nav] = true;
    console.log($scope.menu)
    setTimeout(function () {
      $scope.$apply()
    }, 100)
  }

  //typeahead
  $scope.displayText = function (elder) {
    return elder.name;
  }

  $scope.afterSelect = function (elder) {
    $scope.selectedElderId = elder._id;
    $scope.checkIn.elderId = elder._id;
  }

  $scope.addItem = function (elderName) {

  }
  //end typeahead

  $scope.createElder = function (elderMdl) {
    client.service('elders').create({
      firstName: elderMdl.firstName,
      lastName: elderMdl.lastName
    }).then((data) => {
      console.log(data)
      $('#createElderModal').modal('hide');
    })
      .catch((err) => {
        console.log(err)
        $('#createElderModal').modal('hide');
        //TODO error msg
      })
  }

  //create activity
  $scope.createActivity = function (checkinData) {
    checkinData.isSubmitted = true;
    console.log(checkinData)
    var activity = {
      elderId: checkinData.elderId,
      type: checkinData.type,
      activityDate: checkinData.activityDate,
      elderHealthConcern: checkinData.elderHealthConcern,
      elderHealthStatus: checkinData.elderHealthStatus,
      hours: checkinData.hours
    }
    client.service('activities').create(activity)
      .then((data) => { console.log(data) })
      .catch((err) => { console.log(err) })
  }
  //end create activity

  $scope.getHistory = function () {
    console.log($scope.loggedInUser)
    console.log('Finding activities for %s', $scope.loggedInUser._id)
    var params = {
      query: {
        userId: $scope.loggedInUser._id
      }
    }
    client.service('activities').find(params)
      .then((res) => {
        console.log('Historical data retrieved ...')
        console.log(res)
        $scope.myHistory['feed'] = res.data;
        $scope.myHistory['lastWeekHrs'] = 0
        $scope.myHistory['lastMonthHrs'] = 0
        $scope.myHistory['lastYearHrs'] = 0
        //date format
        res.data.map(function (activity) {
          activity.activityDateStr = new Date(activity.activityDate).toLocaleString().split(',')[0].trim()
          if (activity.activityDate >= (new Date().getTime() - 7 * 24 * 60 * 60 * 1000)) {
            console.log('Activity Date: %s', new Date(activity.activityDate))
            $scope.myHistory.lastWeekHrs += parseFloat(activity.hours)
          }
          if (activity.activityDate >= (new Date().getTime() - 30 * 24 * 60 * 60 * 1000)) {
            $scope.myHistory.lastMonthHrs += parseFloat(activity.hours)
          }
          if (activity.activityDate >= (new Date().getTime() - 365 * 24 * 60 * 60 * 1000)) {
            $scope.myHistory.lastYearHrs += parseFloat(activity.hours)
          }

        })
        //last week

        //last month
        //last year
        $scope.$apply()
      })
      .catch((e) => console.log(e))
  }

  $scope.getLeaderboard = function () {
    var begin = new Date()
    begin.setDate(1);
    begin.setMonth(new Date().getMonth() - 1)
    console.log('Begin : %s', begin)
    var end = new Date()
   end.setDate(1)
   console.log('End : %s', end)

   var params = {
     query: {
      activityDate: {
        $gte: begin.getTime(),
        $lt: end.getTime()
      }
     }
   }
    client.service('activities').find(params)
      .then((res) => {
        console.log('Found leaderboard')
        console.log(res)
        var userHoursMap = {}
        res.data.forEach(function (a) {
          if(userHoursMap[a.userId]){
            userHoursMap[a.userId]['hours'] += a.hours;
          } else {
            userHoursMap[a.userId] = {
              user: a.user, 
              hours: a.hours
            }
          }
        })
        console.log(userHoursMap)
        $scope.leaderboard = Object.values(userHoursMap).slice(0,10);
        $scope.leaderboard.sort(function(a,b){
          return b.hours - a.hours;
        })
        console.log($scope.leaderboard)
        $scope.$apply()
      })
  }

  $scope.updateProfile = function(user){
    console.log(user)
    client.service('users').patch(user._id, {
      firstName: user.firstName,
      lastName: user.lastName
    }, {})
    .then((res)=>{
      console.log(res)
    })
  }
  $scope.init()
}])
