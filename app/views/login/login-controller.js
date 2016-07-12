var routerApp = angular.module('sbAdminApp');
routerApp.controller('LoginController', ['$scope', 'User', '$state', 'LoopBackAuth',
    function($scope, User, $state, LoopBackAuth) {

        $scope.email;
        $scope.password;

        $scope.login = function(){
            $state.go('dashboard.home', {}, {reload: true});
            // User.login({"email":$scope.email, "password": $scope.password})
            // .$promise
            // .then(function(results){
                
            //     $scope.user = results;
            //     User.findById({id:$scope.user.userId})
            //         .$promise
            //         .then(function(userResult){
            //             $scope.userResult = userResult;
            //             if($scope.userResult.role == 'admin'){
            //                 alert("Logged in Successfully.");
            //                 console.log("Welcome to Mockbank.");
            //                 $state.go('dashboard.home', {}, {reload: true});
            //             }
            //             else{
            //                 alert("Login failed. Unauthorized user");
            //                 $state.go('login', {}, {reload: true});
            //             }
            //         },function(error){
            //             console.log(error);
            //         });

            // },function(error){
            //     alert("Login failed - Invalid Username or Password.");
            //     console.log(error);
            // });
        };

        $scope.Logout = function () {
        'use strict';
        User.logout()
            .$promise
            .then(function (results) {
                LoopBackAuth.clearUser();
                LoopBackAuth.clearStorage();
                console.log("Bye. Visit us soon.");
                $state.go('login', {}, {reload: true});
            },
            function (error) {
                console.log("Abnormal Logout");
                LoopBackAuth.clearUser();
                LoopBackAuth.clearStorage();
                $state.go('login', {}, {reload: true});
            });
       };
      

}]);