var routerApp = angular.module('sbAdminApp');
routerApp.controller('TestListController', ['$scope', '$modal', 'Tests', '$state', 'TestSpecifications',
    function($scope, $modal, Tests, $state,TestSpecifications) {

        $scope.results;
        $scope.show=0;

        $scope.subject= function(){
            Tests.find({filter:{"where":{"type":"Subject Test"}}})  
            .$promise
            .then(function(results){
                   $scope.results = results;
                   scope.show =1;
                },function(error){
                    console.log(error);
                });
        };

        $scope.mock= function(){
            Tests.find({filter:{"where":{"type":"Mock Test"}}})  
            .$promise
            .then(function(results){
                   $scope.results = results;
                   $scope.show =1;
                },function(error){
                    console.log(error);
                });
        };

       $scope.open = function (node) {
              var modalInstance = $modal.open({
                controller: 'TestEditController',
                templateUrl: 'views/tests/testmodal.html',
                resolve: {
                  testInfo : function () {
                    return node;
                  }
                }
              });
            };

        $scope.delete = function (test){
            $scope.ID = test.id;
            console.log($scope.ID);
            if(confirm("Are you sure you want to delete this test and all its dependencies?"))
            { 
                
                    Tests.deleteById({"id" : $scope.ID})
                    .$promise
                    .then(function(result){
                        alert("Test deleted Successfully.");
                        $state.go('dashboard.tests', {}, {reload: true});
                    },function(err){
                        console.log(err);
                    });
               
            }
             else{
                alert("Deletion cancelled.");
                }
            };

}]);

routerApp.controller('TestEditController', ['$scope', 'Tests','$modalInstance', 'testInfo', 'TestSpecifications', 'Cutoffs',
    function($scope, Tests,$modalInstance, testInfo,TestSpecifications, Cutoffs) {
        
            $scope.testInfojson = new Object();
            var today = new Date();
            $scope.date = today.toISOString().substring(0, 10);
            $scope.testInfojson.updatedAt = $scope.date;
            $scope.view = 0;
            $scope.testSpec;
            if(testInfo == 0){
                $scope.testInfojson.id = 0;
                $scope.view = 1;
                $scope.testInfojson.title = "";
                $scope.testInfojson.type= "";
                $scope.testInfojson.slug = "";
                $scope.testInfojson.testSpecificationId=0;
                $scope.testInfojson.status=1;
                $scope.testInfojson.createdAt = $scope.date;
            }else{
                $scope.testInfojson = testInfo;
                TestSpecifications.findOne({filter:{"fields":["id","title"],"where":{"id":$scope.testInfojson.testSpecificationId}}})
                .$promise
                .then(function(testSpec){
                  $scope.testSpec = testSpec;
                },function(error){
                console.log(error);
               });
        }

        $scope.searchRes  = [];
        $scope.searchId = [];
        $scope.tsTitle = "";
        $scope.tTitle;
        $scope.complete = function(){
        TestSpecifications.find({filter:{"fields":["id","title"],"where":{"title":{"like":"%"+$scope.tsTitle+"%"}}}})
        .$promise
        .then(function(searchR){
               $scope.searchR = searchR;
               $scope.searchRes = [];
                $scope.searchId= [];
               for (var i = $scope.searchR.length - 1; i >= 0; i--) {
                $scope.searchRes.push($scope.searchR[i].title);
                $scope.searchId.push($scope.searchR[i].id);
                }
            },function(error){
                console.log(error);
            });

        console.log("searchRes: ",$scope.searchRes);

        $( "#search-tags" ).autocomplete({
          autoFocus: true,
          source: $scope.searchRes,
          select: function(event, ui) { 
            $scope.tTitle = ui.item.value;
           $(this).autocomplete('widget').zIndex(-100);
        },
        open: function () {
            $(this).autocomplete('widget').zIndex(1100);
        }
    });

   
    };

            $scope.cutoffMapped;
            Cutoffs.find({filter:{"where":{"testId":$scope.testInfojson.slug}}})
            .$promise
            .then(function(cutoffMapped){
                   $scope.cutoffMapped = cutoffMapped;
                },function(error){
                    console.log(error);
                });

            $scope.editTS = function(){
                $scope.view = 1;
            };

            $scope.viewList = function(){
                $scope.show = 0;
            };

            $scope.show = 0;
            $scope.addC = function(){
                $scope.show = 1;
            };

            $scope.tId;
            $scope.ok = function () {
                console.log($scope.testInfojson);
                if($scope.view == 1){
                    for (var i = $scope.searchRes.length - 1; i >= 0; i--) {
                    if($scope.searchRes[i] == $scope.tTitle)
                        $scope.tId = $scope.searchId[i];   
                        $scope.testInfojson.testSpecificationId = $scope.tId;
                    }
                    //$scope.view = 0;
                }
                if($scope.testInfojson.title == "" || $scope.testInfojson.type == "" || $scope.testInfojson.testSpecificationId == 0 || $scope.testInfojson.slug == ""){
                    alert("Please fill all mandatory fields.");
                }else{
                    if($scope.testInfojson.status == null){
                        $scope.testInfojson.status = 1;
                    }
                 Tests.count({where:{"or": [{"title":$scope.testInfojson.title}, {"slug": $scope.testInfojson.slug}], "id":{"neq":$scope.testInfojson.id}}})
                    .$promise
                    .then(function(ccount){
                    if(ccount.count==0){
                        Tests.upsert({"id": $scope.testInfojson.id, "title": $scope.testInfojson.title , "s3Id": $scope.testInfojson.s3Id , "testContent" : $scope.testInfojson.testContent , "edoolaContentId" : $scope.testInfojson.edoolaContentId , "type" : $scope.testInfojson.type , "slug": $scope.testInfojson.slug , "testSpecificationId": $scope.testInfojson.testSpecificationId, "updatedAt" : $scope.testInfojson.updatedAt , "createdAt" : $scope.testInfojson.createdAt, "status" : $scope.testInfojson.status})
                        .$promise
                        .then(function(results){
                           console.log("results",results);
                           alert("Added/Editted Successfully.");
                           $scope.view = 0;
                           // if($scope.testInfojson.id==0){
                           //    Tests.findOne({filter:{"fields":["id"],"where":{"title":$scope.courseInfojson.title}}})
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
                        alert("Title or slug with same name already exists in the database. Re-enter.");
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

        $scope.testSlugId = {"slug":""};
        $scope.testSection = {"section":""};
        $scope.cutoffVal = [{"id":"GENERAL","val":0},{"id":"OBC","val":0},{"id":"OH","val":0},{"id":"SC","val":0},{"id":"ST","val":0},{"id":"XS","val":0},{"id":"DXS","val":0},{"id":"HI","val":0},{"id":"VI/VH","val":0}];
        $scope.addCutoff = function(){
           console.log("slug", $scope.testInfojson.slug, $scope.cutoffVal);
           if($scope.testSection == ""){
                alert("Please fill all fields");
           }else{
                $scope.success=0;
                for (var i = 0; i < $scope.cutoffVal.length; i++) {
                    Cutoffs.create({"id": 0, "testId": $scope.testInfojson.slug, "section": $scope.testSection.section, "category": $scope.cutoffVal[i].id, "cutoff": $scope.cutoffVal[i].val,"createdAt": $scope.date,"updatedAt": $scope.date})
                    .$promise
                    .then(function(results){
                           $scope.success++;
                            if($scope.success == $scope.cutoffVal.length)
                                alert("Cutoffs mapped successfully");
                                $scope.show=0;
                        },function(error){
                            console.log(error);
                        });
                }
           }
        };

        $scope.cutoffMapping = 0 ;
        $scope.addCutoffExist = function(){
           console.log("slug", $scope.testSlugId.slug);
           if($scope.testSlugId.slug == ""){
                alert("Please fill all fields");
           }else{
              Cutoffs.find({filter:{"where":{"testId":$scope.testSlugId.slug}}})
                .$promise
                .then(function(mapping){
                       console.log(mapping);
                       $scope.mapping = mapping;
                       for (var i = 0; i < $scope.mapping.length; i++) {
                           Cutoffs.create({"id": 0, "testId": $scope.testInfojson.slug,"section":$scope.mapping[i].section,"category":$scope.mapping[i].category,"cutoff":$scope.mapping[i].cutoff,"createdAt": $scope.date,"updatedAt": $scope.date})
                            .$promise
                            .then(function(results){
                             $scope.cutoffMapping++;
                             console.log("success");
                            if($scope.cutoffMapping == $scope.mapping.length)
                                alert("Cutoffs mapped successfully");
                                $scope.show=0;
                            },function(error){
                                console.log(error);
                            });
                       }
                    },function(error){
                        console.log(error);
                    });
           }
        };

        $scope.delCutoff = function(cutoffValue){
            Cutoffs.deleteById({id: cutoffValue.id})
            .$promise
            .then(function(results){
                  alert("Cutoff mapping deleted successfully");
                  Cutoffs.find({filter:{"where":{"testId":$scope.testInfojson.slug}}})
                .$promise
                .then(function(cutoffMapped){
                       $scope.$apply(function () {
                            $scope.cutoffMapped = cutoffMapped;
                        });
                    },function(error){
                        console.log(error);
                    });
                },function(error){
                    console.log(error);
                });
        };  

}]);
