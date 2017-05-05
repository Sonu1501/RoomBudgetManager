angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
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
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
