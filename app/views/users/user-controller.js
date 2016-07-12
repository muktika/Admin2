var routerApp = angular.module('sbAdminApp');

routerApp.controller('PurchasesController', ['$scope', 'Order', 'Course', 'Exams',
			 function($scope, Order, Course, Exams) {

        $scope.userId;
        $scope.course = [];
        $scope.exams=[];
        $scope.find = function(){
	    Order.find({filter:{"where":{"userId":$scope.userId}}})
            .$promise
            .then(function(results){
                   $scope.results = results;
                },function(error){
                    console.log(error);
                });
        };

  }]);

routerApp.controller('UserController', ['$scope', 'User', 'Course', 'Exams', 'UserCourseBenefits', 'UserCourses', 'UserCourseTests', 'UserTestAttempts', 'MentorshipSlotsBooked',
             function($scope, User, Course, Exams, UserCourseBenefits, UserCourses, UserCourseTests, UserTestAttempts, MentorshipSlotsBooked) {

        $scope.phone="";
        $scope.email="";
        $scope.id;
        $scope.showProfile = 0;
        $scope.show=0;
        $scope.userP;
        $scope.courses;
        $scope.coursebenefits;
        $scope.tests;
        $scope.testAttempts;
        $scope.changeEmail="";

        $scope.changeP = function(){
          console.log($scope.changeEmail);
          if($scope.changeEmail != ""){
            if(confirm('Are you sure you want to change Password for this user?')){
              User.hardResetPassword({"email": $scope.changeEmail})
              .$promise
              .then(function(result){
                 alert("User Password Chaned successfully");
              },function(error){
                  console.log(error);
              });
            }
          }else{
            alert("Please enter email.");
          }
        }

        $scope.showUser = function(result){
            $scope.userP = result;
            $scope.showProfile=1;
            $scope.show=0;
            $scope.id = $scope.userP.id;

            UserCourses.find({filter:{"where":{"userId":$scope.id},"include":{"relation":"courses","scope":{"fields":["id","title"]}}}})
            .$promise
            .then(function(courses){
               $scope.courses = courses;
            },function(error){
                console.log(error);
            });
            

            UserCourseBenefits.find({filter:{"where":{"userId":$scope.id},"include":{"relation":"benefits","scope":{"fields":["id","title"]}}}})
            .$promise
            .then(function(courseBenefits){
               $scope.coursebenefits = courseBenefits;
            },function(error){
                console.log(error);
            });

            UserCourseTests.find({filter:{"include":"testspec", "where":{"userId":$scope.id}}})
            .$promise
            .then(function(tests){
               $scope.tests = tests;
            },function(error){
                console.log(error);
            });

            UserTestAttempts.find({filter:{"include":"testspec", "where":{"userId":$scope.id}}})
            .$promise
            .then(function(testAttempt){
               $scope.testAttempts = testAttempt;
            },function(error){
                console.log(error);
            });

            
            MentorshipSlotsBooked.find({filter:{"include":"slots","where":{"userId": $scope.id}}})
            .$promise
            .then(function(slotSummary){
               $scope.slotSummary = slotSummary;
            },function(error){
                console.log(error);
            });

        }

            $scope.back = function(){
                $scope.showProfile = 0;
                $scope.show=1;
            }

        $scope.search = function(){

            if($scope.email != "" && $scope.phone != ""){
              User.find({filter:{"where":{"and": [{"mobile": $scope.phone}, {"email": $scope.email}]}}})
              .$promise
              .then(function(results){
                   $scope.results = results;
                   if(results.length == 0)
                    alert("No users found");
                   $scope.show = 1;
                },function(error){
                    console.log(error);
                });
            }else if($scope.email != ""){
                User.find({filter:{"where":{"email": $scope.email}}})
                  .$promise
                  .then(function(results){
                       if(results.length == 0)
                          alert("No users found");
                       $scope.results = results;
                       $scope.show = 1;
                    },function(error){
                        console.log(error);
                    });
                
            }else if($scope.phone != ""){
               User.find({filter:{"where":{"mobile": $scope.phone}}})
              .$promise
              .then(function(results){
                   if(results.length == 0)
                      alert("No users found");
                   $scope.results = results;
                   $scope.show = 1;
                },function(error){
                    console.log(error);
                });
            }else{
                alert("Please fill any one field to search user information");
            }

        }

        $scope.deleteCourse = function(course){
           console.log(course);
           $scope.delId = course.id;
           $scope.userIdentity = course.userId;
           UserCourses.deleteById({id: $scope.delId})
           .$promise
           .then(function(results){
                alert("Deleted successfully");
                UserCourses.find({filter:{"where":{"userId":$scope.userIdentity},"include":{"relation":"courses","scope":{"fields":["id","title"]}}}})
                .$promise
                .then(function(courses){
                   $scope.courses = courses;
                },function(error){
                    console.log(error);
                });
            },function(error){
                console.log(error);
                alert("Couldn't delete this mapping.");
            });
        }

        $scope.deleteBenefit = function(cbenefit){
           console.log(cbenefit);
           $scope.delId = cbenefit.id;
           $scope.userIdentity = cbenefit.userId;
           UserCourseBenefits.deleteById({id: $scope.delId})
           .$promise
           .then(function(results){
                alert("Deleted successfully");
                UserCourseBenefits.find({filter:{"where":{"userId":$scope.id},"include":{"relation":"benefits","scope":{"fields":["id","title"]}}}})
                .$promise
                .then(function(courseBenefits){
                   $scope.coursebenefits = courseBenefits;
                },function(error){
                    console.log(error);
                });
            },function(error){
                console.log(error);
                alert("Couldn't delete this mapping.");
            });
        }

        $scope.deleteTest = function(test){
           console.log(test);
           $scope.delId = test.id;
           $scope.userIdentity = test.userId;
           UserCourseTests.deleteById({id: $scope.delId})
           .$promise
           .then(function(results){
                alert("Deleted successfully");
                UserCourseTests.find({filter:{"include":"testspec", "where":{"userId":$scope.id}}})
                .$promise
                .then(function(tests){
                   $scope.tests = tests;
                   console.log($scope.tests);
                },function(error){
                    console.log(error);
                });
            },function(error){
                console.log(error);
                alert("Couldn't delete this mapping.");
            });
        }
        

  }]);