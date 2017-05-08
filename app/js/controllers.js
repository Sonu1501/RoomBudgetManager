angular.module('app.controllers', [])

.controller('autologinCtrl', function($scope,$http,$ionicPopup,$state,$ionicHistory,$location) {
	$scope.autologin=function(){
		$location.path('/login');
		// var i = true;
		// if(i){ $location.path('/login'); console.log('1111111111');}
		// else{ $location.path('/main'); console.log('2222222222222');}
	}
})
.controller('loginCtrl', function($scope,$http,$ionicPopup,$state,$ionicHistory,$location,Mstusers) {
		$scope.user = {};
		$scope.login = function() {
			console.log('running...........');
//-------------------- Query by predefined function ------------------------------------------//
			// Mstusers.find({where: {ID: 8}, limit: 3}, function(success) {
			// 	console.log(JSON.stringify(success));
			// }, function(error) {
			// 	console.log(error);
			// });

//-------------------- Query by predefined APIs ------------------------------------------//
			Mstusers.login({
					"email": $scope.user.email,
					"password": $scope.user.password
				}, function(success) {
						console.log(JSON.stringify(success));
						$location.path('/home');
				}, function(error) {
						var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
			});

		};

		$scope.signUp = function() {
			$location.path('/signup');
		};

		$scope.forgotPassword = function() {
			$location.path('/forgotpassword');
		};

})
.controller('homeCtrl', function($scope,$http,$ionicPopup,$state,$ionicHistory) {
   console.log('Home page running...........');

})
.controller('signupCtrl', function($scope,$http,$ionicPopup,$state,$ionicHistory) {
   console.log('signup running...........');


})
.controller('forgotpasswordCtrl', function($scope,$http,$ionicPopup,$state,$ionicHistory) {
   console.log('forgot password running...........');


});
