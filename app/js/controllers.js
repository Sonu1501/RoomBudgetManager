angular.module('app.controllers', ['ionic','ngCordova','ngStorage'])

.run(function($rootScope, $ionicPlatform, $ionicHistory,$cordovaToast){

  $ionicPlatform.registerBackButtonAction(function(e){
    if ($rootScope.backButtonPressedOnceToExit) {
      ionic.Platform.exitApp();
    }
    else {
      $rootScope.backButtonPressedOnceToExit = true;
      $cordovaToast.showShortCenter(
        "Press back button again to exit",function(a){},function(b){}
      );
      setTimeout(function(){
        $rootScope.backButtonPressedOnceToExit = false;
      },2000);
    }
    e.preventDefault();
    return false;
  },101);

})
//--------------- Common Functions -----------------------//
.service('myService', function($ionicLoading) {
      this.show = function($ionicLoading) {
	    $ionicLoading.show({
           template: '<table><tbody><tr><td><ion-spinner></ion-spinner></td><td style="vertical-align:middle"><strong>&nbsp; Please wait...</strong></td></tr></tbody></table>'
	    });
	  };

	  this.hide = function(){
	        $ionicLoading.hide();
	  };

	  this.popup = function($scope,$ionicPopup){
	  	var myPopup = $ionicPopup.show({
	      template: ' <label class="item item-input"><input type="text" placeholder="OTP" ng-model="user.otp"></label>',
	      title: 'Enter OTP',
	      scope: $scope,
	      buttons: [{
	      			   text: 'Validate',
	                   type: 'button-positive',
	                    onTap: function(e)
	                    {
	                    	$scope.validateOtp();
	                    }
	                }
	            ]
	    });

	  }

 })

.controller('landingPageCtrl', function($scope,$http,$ionicPopup,$state,$ionicHistory,$location,MstUsers
	,$localStorage,$ionicLoading,myService,$rootScope,$timeout,$cordovaNetwork) {
		
	    $scope.autoLogin = function(){	    	
		    	myService.show($ionicLoading);
		    	$timeout(landingPageLoad, 2000);	    			    
		}

	var  landingPageLoad = function(){
		if ($cordovaNetwork.isOnline()) {
		  if($localStorage.users != undefined){
	    	if($localStorage.users.email != null && $localStorage.users.password != null){
	    		MstUsers.login({
					"email": $localStorage.users.email,
					"password": $localStorage.users.password
				}, function(success) {				
					$location.path('/home');
				}, function(error) {
					$location.path('/login');
			});
	    	    myService.hide($ionicLoading); 	
	    	}
	    	else{
	    		myService.hide($ionicLoading); 
	    		$location.path('/login');
	    	}
	      }
	      else{
	    		myService.hide($ionicLoading); 
	    		$location.path('/login');
	      }
	   }
	   else{
	   			myService.hide($ionicLoading);
		  		var alertPopup = $ionicPopup.alert({
		                title: 'No Internet Connection',
		                template: 'Internet required.'
		        });
		  }    
	}
	  
   
})
.controller('loginCtrl', function($scope,$http,$ionicPopup,$state,$ionicHistory,$location,$ionicLoading
	,myService,MstUsers,$rootScope,$localStorage,$cordovaNetwork) {		

		$scope.user = {};	

		$scope.login = function() {
			if ($cordovaNetwork.isOnline()) {
			myService.show($ionicLoading);          

           //-------------------- Query by predefined APIs ----------------------------//
			MstUsers.login({
					"email": $scope.user.email,
					"password": $scope.user.password
				}, function(success) {
					$localStorage.users = {
						"email": $scope.user.email,
					    "password": $scope.user.password
					}
					$scope.user.email = '';$scope.user.password='';
					myService.hide($ionicLoading); 
					$location.path('/home');
				}, function(error) {
					myService.hide($ionicLoading); 
					var alertPopup = $ionicPopup.alert({
		                title: 'Login failed!',
		                template: 'Please check your credentials!'
		            });
			});
		  }
		  else{
		  		var alertPopup = $ionicPopup.alert({
		                title: 'No Internet Connection',
		                template: 'Sorry, No internet connectivity detected. Please reconnect and try again.'
		        });
		  } 
		};

		$scope.signUp = function() {
			$location.path('/signup');
		};

		$scope.forgotPassword = function() {
			$location.path('/forgotpassword');
		};

})
.controller('homeCtrl', function($scope,$http,$ionicPopup,$state,$ionicHistory,$location,$ionicLoading,
	$ionicSideMenuDelegate,MstUsers,myService,$localStorage,$cordovaNetwork) {
   

   $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.logout = function() {
  	if ($cordovaNetwork.isOnline()) {
  	myService.show($ionicLoading); 
  	MstUsers.logout(
  		         function(success) {
  					myService.hide($ionicLoading); 
  					$localStorage.users = {
						"email": null,
					    "password": null
					}
					$location.path('/login');
				}, function(error) {
					myService.hide($ionicLoading); 
					var alertPopup = $ionicPopup.alert({
		                title: 'Logout failed!',
		                template: 'Internal server error.'
		            });
			});
    }
    else{
    	var alertPopup = $ionicPopup.alert({
		                title: 'No Internet Connection',
		                template: 'Sorry, No internet connectivity detected. Please reconnect and try again.'
		        });
    }
  };

})
.controller('signupCtrl', function($scope,$http,$ionicPopup,$state,$ionicHistory,$location,$cordovaSms,
  $ionicLoading,myService,MstUsers,$q,$cordovaNetwork) {	
  $scope.user = {};  
  $scope.otp = null;    

   $scope.validateOtp = function(){
   	  if($scope.user.otp == $scope.otp){
   		userCreated();        
   	  }else{
   		var alertPopup = $ionicPopup.alert({
		            	    title: 'Validation',
		                	template: 'Wrong otp entered.',
		                	buttons: [{
				      			   text: 'Ok',
				                   type: 'button-positive',
				                    onTap: function(e)
				                    {
				                    	myService.popup($scope,$ionicPopup);
				                    }
				                }
				            ]
	 	            	});
   	  }
   }

   $scope.signUp = function(){  	   
   	 if ($cordovaNetwork.isOnline()) {

	 validateMobile($scope.user.mobile)
	 .then(function(data) {
		if(!data.result){
	    var alertPopup = $ionicPopup.alert({
		            	    title: 'Validation',
		                	template: data.message
	 	            	});
	    }
	    else{
	     validateEmail($scope.user.email)
		 .then(function(data) {
		  if(!data.result){
		    var alertPopup = $ionicPopup.alert({
			            	    title: 'Validation',
			                	template: data.message
		 	            	});
		    }
		    else{
		    	if($scope.user.password != $scope.user.retryPassword){
		         var alertPopup = $ionicPopup.alert({
			            	    title: 'Validation',
			                	template: "Password do not match !"
		 	            	});
		        }
		        else{
		        	sendOtp();
		        }	
		    }
	      });
	    }
	  });
	 }
	 else{
		var alertPopup = $ionicPopup.alert({
		                title: 'No Internet Connection',
		                template: 'Sorry, No internet connectivity detected. Please reconnect and try again.'
		        });
	 }  	

   };

   var sendOtp = function(){
   	 myService.show($ionicLoading);
   	 $scope.otp = Math.floor(1000 + Math.random() * 9000);
   	 console.log($scope.otp + " is your otp");
	   MstUsers.sendOTP({ obj: JSON.stringify({
	   					"to": "+91" + $scope.user.mobile,
	   					"from": "+16519683440",
	   					"message": $scope.otp + " is your otp"				  
	   				})}, function(success) {
					myService.hide($ionicLoading);

	    			var alertPopup = $ionicPopup.alert({
			                title: 'Success',
			                template: "OTP has sent to your mobile number.",
			                buttons: [{
				      			   text: 'Ok',
				                   type: 'button-positive',
				                    onTap: function(e)
				                    {
				                    	myService.popup($scope,$ionicPopup);
				                    }
				                }
				            ]
			            });  
				}, function(error) {
	               myService.hide($ionicLoading);
	        	   var alertPopup = $ionicPopup.alert({
			                title: 'Connectivity Error',
			                template: JSON.stringify(error)
			            });
			});
   }
   
   var sendEmail = function(){
   	 myService.show($ionicLoading);   
   	  MstUsers.sendEmail({ obj: JSON.stringify({
	   					   "email" : $scope.user.email,
	   					   "otp" : "5048"
	   				})}, function(success) {
					  myService.hide($ionicLoading);
	    			  var alertPopup = $ionicPopup.alert({
			                title: 'Success',
			                template: "OTP has sent to your email.",			          
			            });  
				}, function(error) {
	               myService.hide($ionicLoading);
	        	   var alertPopup = $ionicPopup.alert({
			                title: 'Connectivity Error',
			                template: JSON.stringify(error)
			            });
			});
   }

   var validateEmail = function(email){
   	 var deferred = $q.defer();
   	 myService.show($ionicLoading);   
   	 $scope.data = {};
   	 //-------------------- Query by predefined function ----------------------//
	  MstUsers.count({ where : JSON.stringify({
	         "email" : email 
          })
	  }, function(success) {
		   if(success.count == 0){
		   	 myService.hide($ionicLoading);  deferred.resolve({result : true, message : ""});		   	
		   }
		   else{
		   	 myService.hide($ionicLoading);  deferred.resolve({result : false, message : "Email already exist!"}); 		   	
		   }
		   
	  }, function(error) {
		   myService.hide($ionicLoading);  deferred.resolve({result : false, message : "Server Error!"}); 		    
		   
	  });
	  return deferred.promise;
   } 

   var validateMobile = function(mobile){
   	 var deferred = $q.defer();
   	 myService.show($ionicLoading);   

	  MstUsers.count({ where : JSON.stringify({
	         "mobileNumber" : mobile 
          })
	  }, function(success) {
		   if(success.count == 0){
		   	 myService.hide($ionicLoading);  deferred.resolve({result : true, message : ""});		   	
		   }
		   else{
		   	myService.hide($ionicLoading);  deferred.resolve({result : false, message : "Mobile number already exist!"}); 		   	
		   }
		   
	  }, function(error) {
		   myService.hide($ionicLoading);  deferred.resolve({result : false, message : "Server Error!"});  		    
		   
	  });
	  return deferred.promise;
   }

   var userCreated = function(){
		myService.show($ionicLoading);   	
	    $http({ 
	        method: 'POST',
	        url: 'https://strong-loop-code.herokuapp.com/api/MstUsers',
	        headers: {
	            'Content-Type': 'application/json'
	        },
	        data: {
			  "mobileNumber": $scope.user.mobile,
			  "firstName": $scope.user.firstName,
			  "lastName": $scope.user.lastName,
			  "createdDate": "2017-05-09",
			  "updatedDate": "2017-05-09",
			  "email": $scope.user.email,
			  "password": $scope.user.password,
			  "emailverified": false,
			  "isActive": "1",
			  "status": "New",
			  "credentials": $scope.user.password,
			  "created": "2017-05-09T12:54:47.852Z",
			  "lastupdated": "2017-05-09T12:54:47.852Z"
			}
	    }).then(function(resp) {
	    	myService.hide($ionicLoading);
	    	$scope.user.mobile ='';$scope.user.email='';$scope.user.password='';
	    	$scope.user.firstName='';$scope.user.lastName='';$scope.user.retryPassword='';
	        var alertPopup = $ionicPopup.alert({
			                title: 'Sign Up',
			                template: 'Successfully created.',
			                buttons: [{
				      			   text: 'Ok',
				                   type: 'button-positive',
				                    onTap: function(e)
				                    {
				                    	$location.path('/login');
				                    }
				                }
				            ]

			            });
	    }, function(err) {
	    	myService.hide($ionicLoading);
	        var alertPopup = $ionicPopup.alert({
			                title: 'Creation Error!',
			                template: 'Please enter correct details!'
			            });
	    })   	
   }
   
   $scope.back = function() {   	
	  $location.path('/login');
   };
	
})
.controller('forgotpasswordCtrl', function($scope,$http,$ionicPopup,$state,$ionicHistory,$location
	,MstUsers,$cordovaNetwork) {
   console.log('forgot password running...........');
   $scope.back = function() {
		$location.path('/login');
   };
   $scope.forgotPassword = function() {
   	if ($cordovaNetwork.isOnline()) {

   	}
   	else{
    var alertPopup = $ionicPopup.alert({
		                title: 'No Internet Connection',
		                template: 'Sorry, No internet connectivity detected. Please reconnect and try again.'
		        });
   	}

   };
});
