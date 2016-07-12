var routerApp = angular.module('sbAdminApp');
routerApp.controller('TestSpecsListController', ['$scope', '$modal', 'TestSpecifications', '$state',
    function($scope, $modal, TestSpecifications, $state) {

        TestSpecifications.find()  
        .$promise
        .then(function(results){
               $scope.results = results;

               $scope.open = function (node) {
                      var modalInstance = $modal.open({
                        controller: 'TestSpecsEditController',
                        templateUrl: 'views/testSpecs/testSpecmodal.html',
                        resolve: {
                          testSpecInfo : function () {
                            return node;
                          }
                        }
                      });
                    };

            },function(error){
                console.log(error);
            });

        $scope.delete = function (testSpecs){
            $scope.ID = testSpecs.id;
            console.log($scope.ID);
            if(confirm("Are you sure you want to delete this test specification and all its dependencies?"))
            { 
                
                    TestSpecifications.deleteById({"id" : $scope.ID})
                    .$promise
                    .then(function(result){
                        alert("Test Specification deleted Successfully.");
                        $state.go('dashboard.testSpecs', {}, {reload: true});
                    },function(err){
                        console.log(error);
                    });
               
            }
             else{
                alert("Deletion cancelled.");
                }
            };

}]);

routerApp.controller('TestSpecsEditController', ['$scope', 'TestSpecifications','$modalInstance', 'testSpecInfo', 
    function($scope, TestSpecifications,$modalInstance, testSpecInfo) {
        
            $scope.testSpecInfojson = new Object();
            var today = new Date();
            $scope.date = today.toISOString().substring(0, 10);
            if(testSpecInfo == 0){
                $scope.testSpecInfojson.id = 0;
                $scope.testSpecInfojson.title = "";
                $scope.testSpecInfojson.type= "";
                $scope.testSpecInfojson.syllabus = "syllabus";
                $scope.displayName = "";
                $scope.testSpecInfojson.createdAt = $scope.date;
            }else{
                $scope.testSpecInfojson = testSpecInfo;
                if($scope.testSpecInfojson.syllabus == null)
                    $scope.testSpecInfojson.syllabus = "syllabus";
            }

            console.log($scope.testSpecInfojson);
            $scope.ok = function () {
                console.log($scope.testSpecInfojson);
                if($scope.testSpecInfojson.title == "" || $scope.testSpecInfojson.type == ""){
                    alert("Title and Type fields cannot be empty.");
                }else{
                    if($scope.testSpecInfojson.syllabus == null || $scope.testSpecInfojson.syllabus == ""){
                        $scope.testSpecInfojson.syllabus = "syllabus";
                    }
                    if($scope.testSpecInfojson.displayName == null || $scope.testSpecInfojson.displayName == ""){
                        $scope.testSpecInfojson.displayName = $scope.testSpecInfojson.title;
                    }
                TestSpecifications.count({where:{"title":$scope.testSpecInfojson.title, "id":{"neq":$scope.testSpecInfojson.id}}})
                    .$promise
                    .then(function(ccount){
                    if(ccount.count==0){
                        TestSpecifications.upsert({"id": $scope.testSpecInfojson.id, "title": $scope.testSpecInfojson.title , "type" : $scope.testSpecInfojson.type , "syllabus": $scope.testSpecInfojson.syllabus, "displayName": $scope.testSpecInfojson.displayName ,"updatedAt" : $scope.date , "createdAt" : $scope.testSpecInfojson.createdAt})
                        .$promise
                        .then(function(results){
                           alert("Added/Editted Successfully.");
                           // if($scope.testSpecInfojson.id==0){
                           //    Course.findOne({filter:{"fields":["id"],"where":{"title":$scope.courseInfojson.title}}})
                           //      .$promise
                           //      .then(function(resultId){
                           //          $scope.id = resultId.id;
                           //  },function(error){
                           //      console.log("Error:",error);
                           //  });
                        },function(error){
                            alert("Action failed - " + error);
                            console.log(error);
                        });
                    }else{
                        alert("Title with same name already exists in the database. Re-enter title.");
                    }
                },function(error){
                        console.log(error);
                    });
                }
            };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
            window.location.reload(true);
        };

}]);
