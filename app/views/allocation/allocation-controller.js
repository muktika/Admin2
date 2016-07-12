var routerApp = angular.module('sbAdminApp');

routerApp.controller('AllocationController', ['$scope', 'Order' , 'Exams', '$http', 'ExamCourses',
			 function($scope, Order, Exams, $http, ExamCourses) {

	    $scope.userId = 0;
	    $scope.examId;
	    $scope.courseId;
        $scope.searchERes  = [];
        $scope.searchEId = [];
        $scope.examTitle="";
        $scope.eTitle = "";

        $scope.completeE = function(){
            Exams.find({filter:{"fields":["id","title"],"where":{"title":{"like":"%"+$scope.examTitle+"%"}}}})
            .$promise
            .then(function(searchER){
                   $scope.searchER = searchER;
                   $scope.searchERes = [];
                    $scope.searchEId= [];
                   for (var i = $scope.searchER.length - 1; i >= 0; i--) {
                    $scope.searchERes.push($scope.searchER[i].title);
                    $scope.searchEId.push($scope.searchER[i].id);
                    }
                },function(error){
                    console.log(error);
                });

            $( "#search-tags" ).autocomplete({
              autoFocus: true,
              source: $scope.searchERes,
              select: function(event, ui) { 
                $scope.eTitle = ui.item.value;
               $(this).autocomplete('widget').zIndex(-100);
               populateCourse($scope.eTitle);
            },
            open: function () {
                $(this).autocomplete('widget').zIndex(1100);
            }
        });
    };

        $scope.courseList;
        function populateCourse(eTitle){
            for (var i = $scope.searchERes.length - 1; i >= 0; i--) {
                if($scope.searchERes[i] == eTitle)
                    $scope.examId = $scope.searchEId[i];    
            }

            ExamCourses.find({filter:{"where":{"examId":$scope.examId},"fields":["courseId"],"include":{"relation":"courses","scope":{"fields":["id","title"]}}}})
            .$promise
            .then(function(results){
                $scope.courseList = results;
            }, function(err){
                console.log(err);
            });

        }

        $scope.id;
		

  }]);