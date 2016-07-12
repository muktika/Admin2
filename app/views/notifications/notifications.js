var routerApp = angular.module('sbAdminApp');

routerApp.controller('NotificationController', ['$scope', 'Notification',
	function($scope,Notification) {

     $scope.clientType;
     $scope.title;
     $scope.content;
     $scope.notificationNo;
     $scope.thumbnailUrl;
     $scope.type;
     $scope.actionData
		 $scope.send = function () {
        Notification.create({"clientType":$scope.clientType,"title":$scope.title,"content":$scope.content,"notificationNo":$scope.notificationNo,"thumbnailUrl":$scope.thumbnailUrl,"type":$scope.type,"actionData":$scope.actionData})
        .$promise
        .then(function(results){
            alert("Notification Created Successfully");
            },function(error){
                alert("Notification Creation failed. Error - ", error);
                console.log(error);
            });
         };
	}
]);

routerApp.controller('NotificationHistoryController', ['$scope', 'Notification',
  function($scope,Notification) {

     // $scope.clientType;
     // $scope.title;
     // $scope.content;
     // $scope.notificationNo;
     // $scope.thumbnailUrl;
     // $scope.type;
     // $scope.actionData
     // $scope.send = function () {
     //    Notification.create({"clientType":$scope.clientType,"title":$scope.title,"content":$scope.content,"notificationNo":$scope.notificationNo,"thumbnailUrl":$scope.thumbnailUrl,"type":$scope.type,"actionData":$scope.actionData})
     //    .$promise
     //    .then(function(results){
     //        alert("Notification Created Successfully");
     //        },function(error){
     //            alert("Notification Creation failed. Error - ", error);
     //            console.log(error);
     //        });
     //     };
  }
]);