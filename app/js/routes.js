angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('main', {
      url: '/main',
      templateUrl: 'templates/main.html',
      controller: 'autologinCtrl'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginCtrl'

  		// resolve:{
  		// 	"check":function($location){
  		// 		if(sessionStorage.getItem('loggedin_id')){ $location.path('/page9');   }
  		// 		else									 {  $location.path('/login');   }
  		// 	}
  		// }
    })
    .state('home', {
      url: '/home',
      templateUrl: 'templates/home.html',
      controller: 'homeCtrl'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'templates/signup.html',
      controller: 'signupCtrl'
    })
    .state('forgotpassword', {
      url: '/forgotpassword',
      templateUrl: 'templates/forgotpassword.html',
      controller: 'forgotpasswordCtrl'
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/main');

});
