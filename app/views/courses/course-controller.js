var routerApp = angular.module('sbAdminApp');
routerApp.controller('CoursesListController', ['$scope', '$modal', 'Course', '$state',
    function($scope, $modal, Course, $state) {

        Course.find({filter: {"fields":["id", "title"]}})  
        .$promise
        .then(function(results){
               $scope.results = results;

               $scope.open = function (node) {
                      var modalInstance = $modal.open({
                        controller: 'CourseEditController',
                        templateUrl: 'views/courses/coursemodal.html',
                        resolve: {
                          courseInfo : function () {
                            return node;
                          }
                        }
                      });
                    };

            },function(error){
                console.log(error);
            });

        $scope.delete = function (id){
            $scope.ID = id;
            console.log(id);
            if(confirm("Are you sure you want to delete this course and all its dependencies?"))
            { 
                Course.examcourses.destroyById({"id" : $scope.ID})
                .$promise
                .then(function(res){
                    Course.deleteById({"id" : $scope.ID})
                    .$promise
                    .then(function(result){
                        alert("Course deleted Successfully.");
                        $state.go('dashboard.courses', {}, {reload: true});
                    },function(err){
                        console.log(error);
                    });
                },function(error){
                    alert("Deletion failed - " + error);
                });
            }
             else{
                alert("Deletion cancelled.");
                }
            };
    },
]);

routerApp.controller('CourseEditController', ['$scope', 'Course', 'Exams','$modalInstance', 'courseInfo', 'ExamCourses', '$modal', 'CourseGroup', 'Benefits', 'CourseBenefits', 'Assets', 'Topic', 'CourseAssets','TestSpecifications', 'CourseTests',
    function($scope, Course, Exams,$modalInstance, courseInfo, ExamCourses, $modal, CourseGroup, Benefits, CourseBenefits, Assets, Topic, CourseAssets,TestSpecifications, CourseTests) {
        
           // var async = require("async");
            $scope.courseInfo = courseInfo;
            $scope.id;
            $scope.courseBenefits = [];
            $scope.examTitle;
            $scope.examGname;
            $scope.searchR;
            $scope.searchArr = [];

            $scope.benefits;
            Benefits.find()
            .$promise
            .then(function(benefits){
                   $scope.benefits = benefits;
                },function(error){
                    console.log(error);
                });

            if(courseInfo == 0){
                $scope.id = 0;
                $scope.courseInfojson = new Object();
                $scope.courseInfojson.title;
                $scope.courseInfojson.price;
                $scope.courseInfojson.language;
                $scope.courseInfojson.discountedPrice;
                $scope.courseInfojson.groupName="";
                $scope.courseInfojson.groupId =0;
            }
            else{
                $scope.id = $scope.courseInfo.id;
                Course.findById({"id": $scope.id})
                .$promise
                .then(function(results){
                   $scope.courseInfojson = results;

                   CourseBenefits.find({filter:{"include":{"relation":"benefits"},"where":{"courseId":$scope.id}}})
                   .$promise
                   .then(function(results){
                        $scope.courseBenefits = results;
                    },function(error){
                        console.log(error);
                        });

                   CourseGroup.count({where:{"courseId":$scope.id}})
                   .$promise
                    .then(function(groupCount){
                   if(groupCount.count > 0){
                   CourseGroup.findOne({filter:{"where":{"courseId":$scope.id}}})
                   .$promise
                    .then(function(cGroup){
                        console.log(cGroup);
                        $scope.courseInfojson.groupName = cGroup.groupName;
                        $scope.courseInfojson.groupId = cGroup.id;
                        },function(error){
                        console.log(error);
                        });
                    }
                    else{
                        $scope.courseInfojson.groupName="";
                        $scope.courseInfojson.groupId =0;
                    }

                    },function(error){
                        console.log(error);
                        });
                },function(error){
                    console.log(error);
                });
            }

        $scope.testSpecRes = [];
        $scope.testSpecId = [];
        $scope.testTitle;
        $scope.tsTitle;

        $scope.completeTS = function(){
            
            TestSpecifications.find({filter:{"fields":["id","title"],"where":{"title":{"like":"%"+$scope.testTitle+"%"}}}})
            .$promise
            .then(function(testSpecSearch){
                   $scope.testSpecSearch = testSpecSearch;
                   $scope.testSpecRes = [];
                   $scope.testSpecId = [];
                   for (var i = 0; i < $scope.testSpecSearch.length; i++) {
                       $scope.testSpecRes.push($scope.testSpecSearch[i].title);
                       $scope.testSpecId.push($scope.testSpecSearch[i].id);
                   }
                },function(error){
                    console.log(error);
                });

        console.log("searchRes: ",$scope.testSpecSearch);

        $( "#search-testspec" ).autocomplete({
          autoFocus: true,
          source: $scope.testSpecRes,
          select: function(event, ui) { 
            $scope.tsTitle = ui.item.value;
           $(this).autocomplete('widget').zIndex(0);
        },
        open: function () {
            $(this).autocomplete('widget').zIndex(1100);
        }
    });

   
    };
            

        $scope.courseTestRes;
        $scope.editTS=0;
        Course.tests({id:$scope.id,filter:{"include":{"relation":"tests"}}})
        .$promise
        .then(function(courseTestRes){
            $scope.courseTestRes = courseTestRes;
            console.log($scope.courseTestRes);
        },
        function(error){
            console.log(error);
        });

            $scope.editTestSpec = function(){
                $scope.editTS=1;
            };

            $scope.saveTestSpec = function(test){
                CourseTests.upsert({"testSpecificationId": test.testSpecificationId , "credits": test.credits, "id": test.id , "courseId": test.courseId})
                .$promise
                .then(function(Res){
                    alert("Successfully Editted.");
                    $scope.editTS=0;
                },
                function(error){
                    console.log(error);
                });
            };

            $scope.delmapTest = function(testDetails){
                CourseTests.deleteById({id:testDetails.id})
                .$promise
                .then(function(Res){
                    alert("Successfully Deleted.");
                    Course.tests({id:$scope.id,filter:{"include":{"relation":"tests"}}})
                    .$promise
                    .then(function(courseTestRes){
                        $scope.courseTestRes = courseTestRes;
                    },
                    function(error){
                        console.log(error);
                    });
                },
                function(error){
                    console.log(error);
                });
            }

            $scope.topics;
            $scope.topicId;
            Topic.find({filter:{"fields":["id","name"]}})
            .$promise
            .then(function(topics){
                $scope.topics = topics;
            },
            function(error){
                console.log(error);
            });

            $scope.mapTopicFlag=0;
            $scope.assetsList;
            $scope.assetTopicList;
            $scope.assetsSelected;
            Assets.find({filter:{"fields":["id","title"],"where":{"topicId":null}}})
                .$promise
                .then(function(assetresult){
                    $scope.assetsList = assetresult;
                },function(error){
                        console.log(error);
                    });

            $scope.mapVar=0;
            $scope.mapAsset = function () {
                if($scope.assetsSelected == null){
                    alert("0 Assets Selected");
                }
                else{
                if(confirm("Are you sure you want to map "+$scope.assetsSelected.length+" number of assets under this topic to this course?")){
                    console.log("here",$scope.assetsSelected);
                    $scope.mapVar=$scope.assetsSelected.length;
                    mapAssetToCourses(0);
                }
            }
             };

             $scope.mapAssetId;
             function mapAssetToCourses(i){
                   var i = i;
                   if(i<=$scope.assetsSelected.length - 1){
                      checkCount(i);
                   }
                   else{
                      mapping();
                   }
              }

              $scope.assetSelectList = [];
              function checkCount(i,mapId){
                    var j=i;
                    CourseAssets.count({where:{"courseId":$scope.id,"assetId":$scope.assetsSelected[j]}})
                    .$promise
                    .then(function(assetmapcount){
                        if(assetmapcount.count==0){
                            console.log($scope.assetsSelected[j]);
                             $scope.assetSelectList.push($scope.assetsSelected[j]);
                             console.log(j,$scope.assetSelectList);
                             j++;
                             mapAssetToCourses(j);
                        }
                        else{
                            j++;
                            mapAssetToCourses(j);
                        }
                    },function(error){
                        console.log(error);
                    });
                }

                $scope.count;
                function mapping(){
                    console.log($scope.assetSelectList);
                    $scope.count=0;
                    for (var i = 0; i<= $scope.assetSelectList.length - 1; i++) {
                         CourseAssets.create({"courseId":$scope.id,"assetId":$scope.assetSelectList[i]})
                            .$promise
                            .then(function(mapresults){
                                $scope.count++;
                                if($scope.count == $scope.assetSelectList.length){
                                $scope.mapTopicFlag = 0;
                                alert("all assets mapped successfully");
                            }
                            },function(error){
                                console.log(error);
                            });
                    }
                }

            $scope.viewList = function(){
                $scope.mapTopicFlag = 0;
            };

            $scope.mapAssetTopic = function () {
                console.log("here2",$scope.topicId);
                if($scope.topicId == null || $scope.topicId==0){
                    alert("Please select a topic.");
                }
                else{
                        Assets.find({filter:{"fields":["id","title"],"where":{"topicId":$scope.topicId}}})
                        .$promise
                        .then(function(assetListresults){
                            console.log(assetListresults);
                            $scope.assetTopicList = assetListresults;
                            $scope.mapTopicFlag = 1;
                },function(error){
                    console.log("Error:",error);
                });
             }
          };

            $scope.ok = function () {
                console.log($scope.courseInfojson);
                Course.count({where:{"title":$scope.courseInfojson.title, "id":{"neq":$scope.id}}})
                    .$promise
                    .then(function(ccount){
                    if(ccount.count==0){
                        Course.upsert({"id": $scope.id, "title": $scope.courseInfojson.title , "language" : $scope.courseInfojson.language , "price": $scope.courseInfojson.price , "discountedPrice" : $scope.courseInfojson.discountedPrice})
                        .$promise
                        .then(function(results){
                           alert("Added/Editted Successfully.");
                           if($scope.id==0){
                              Course.findOne({filter:{"fields":["id"],"where":{"title":$scope.courseInfojson.title}}})
                                .$promise
                                .then(function(resultId){
                                    $scope.id = resultId.id;
                            },function(error){
                                console.log("Error:",error);
                            });
                         }
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
            };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
            window.location.reload(true);
        };

        $scope.updateGroup = function () {
            CourseGroup.upsert({id:$scope.courseInfojson.groupId,"groupName":$scope.courseInfojson.groupName,"courseId":$scope.id})
            .$promise
            .then(function(results){
                alert("CourseGroup updated successfully");
                },function(error){
                console.log(error);
            });
        };

        $scope.editVal =0;
        $scope.edit = function () {
                   $scope.editVal=1;   
                    };

        $scope.save = function (examObject) {
            $scope.examObject = examObject;
            ExamCourses.upsert({"id":$scope.examObject.id , "displayName": $scope.examObject.displayName, "groupName": $scope.examObject.groupName , "examId" : $scope.examObject.examId , "courseId" : $scope.examObject.courseId, "courseOnSale" : $scope.examObject.courseOnSale })  
            .$promise
            .then(function(results){
                alert("Course-Exam mapping information updated successfully");
                },function(error){
                    alert("Course-Exam mapping information updation failed. Error - ", error);
                    console.log(error);
                });
            $scope.editVal=0;
         };

        $scope.delmap = function (examcourse) {
            $scope.deleteId=examcourse.id;
            console.log($scope.deleteId);
            ExamCourses.deleteById({"id":$scope.deleteId})
            .$promise
            .then(function(results){
                alert("Dependency deleted successfully");
                 ExamCourses.find({filter:{"where":{"courseId": $scope.id},"include":{"relation":"exams","scope":{"fields":["id","title"]}}}})
                .$promise
                .then(function(exams){
                       $scope.examCourses = exams;
                    },function(error){
                        console.log(error);
                    });
            },function(error){
                console.log(error);
            });
        };

        $scope.examCourses;
        ExamCourses.find({filter:{"where":{"courseId": $scope.id},"include":{"relation":"exams","scope":{"fields":["id","title"]}}}})
        .$promise
        .then(function(exams){
               $scope.examCourses = exams;
            },function(error){
                console.log(error);
            });

        
        $scope.editValue=0;
        $scope.editBenefit = function () {
          $scope.editValue=1;
        };

        $scope.saveBenefit = function (benefit) {
          $scope.benefitObject = benefit;
          CourseBenefits.upsert({"id":$scope.benefitObject.id , "credits": $scope.benefitObject.credits , "price": $scope.benefitObject.price, "courseId": $scope.benefitObject.courseId , "benefitId" : $scope.benefitObject.benefitId, "creditType": $scope.benefitObject.creditType})
            .$promise
            .then(function(benefitUpdate){
                alert("Benefit Info Updated Successfully.");
                },function(error){
                    console.log(error);
                });
          $scope.editValue=0;
        };

        $scope.delBenefit = function (benefit) {
          $scope.benefitOb = benefit;
          console.log($scope.benefitOb.id);
          CourseBenefits.deleteById({"id":$scope.benefitOb.id})
            .$promise
            .then(function(benefitDel){
                alert("Benefit Deleted Successfully.");
                CourseBenefits.find({filter:{"include":{"relation":"benefits"},"where":{"courseId":$scope.id}}})
                   .$promise
                   .then(function(results){
                        $scope.courseBenefits = results;
                    },function(error){
                        console.log(error);
                        });
                },function(error){
                    console.log(error);
                });
        };

        $scope.courseBen=new Object;
        $scope.courseBen.Id = "";
        $scope.showAddBen=0;

        $scope.mapBenefit = function () {
         console.log($scope.courseBen.Id);
         if($scope.courseBen.Id != "" || $scope.courseBen.Id != null){
                if($scope.courseBen.Id==1 || $scope.courseBen.Id==3){
                    $scope.courseBen.creditType = "COUNT";
                }
                else{
                    $scope.courseBen.creditType = "DAYS";
                }
               $scope.courseBen.courseId = $scope.id;
               $scope.showAddBen=1;
            }
            else{
                alert("Please select benefit title before adding information for new benefit");
            }

        };

        $scope.mapBen = function () {

         if($scope.courseBen.credits == null)
            $scope.courseBenefitInfo.credits =0;
        
        if($scope.courseBen.price == null)
            $scope.courseBenefitInfo.price =0;

        if($scope.courseBen.price < 0 || $scope.courseBen.credits <0){
            alert("Please enter positive values only.");
        }
        else{
            CourseBenefits.count({where:{"courseId":$scope.courseBen.courseId,"benefitId":$scope.courseBen.Id}})
            .$promise
            .then(function(count){
                if(count.count==0){
                CourseBenefits.upsert({"id":0 , "courseId": $scope.courseBen.courseId , "benefitId" : $scope.courseBen.Id , "creditType" : $scope.courseBen.creditType , "credits": $scope.courseBen.credits, "price": $scope.courseBen.price })  
                .$promise
                .then(function(results){
                    alert("Course Benefit Added Successfully");
                    CourseBenefits.find({filter:{"include":{"relation":"benefits"},"where":{"courseId":$scope.id}}})
                   .$promise
                   .then(function(results){
                        $scope.courseBenefits = results;
                    },function(error){
                        console.log(error);
                        });
                    },function(error){
                        alert("Course Benefit Addition Failed. Some Error Occurred.");
                        console.log(error);
                    });
                $scope.showAddBen=0;
                }
                else
                {
                    alert("This benefit is already mapped to this course");
                }
            },function(error){
                console.log(error);
            });
         }
        };

        $scope.searchRes  = [];
        $scope.searchId = [];

        $scope.complete = function(){
        Exams.find({filter:{"fields":["id","title"],"where":{"title":{"like":"%"+$scope.examTitle+"%"}}}})
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
            $scope.eTitle = ui.item.value;
           $(this).autocomplete('widget').zIndex(0);
        },
        open: function () {
            $(this).autocomplete('widget').zIndex(1100);
        }
    });

   
    };

        
         $scope.map = function () {
            console.log($scope.eTitle,$scope.examGname);
            console.log($scope.id);
            $scope.eId;
            for (var i = $scope.searchRes.length - 1; i >= 0; i--) {
                if($scope.searchRes[i] == $scope.eTitle)
                    $scope.eId = $scope.searchId[i];    
            }
            $scope.countVal;

            ExamCourses.count({where:{"courseId": $scope.id,"examId": $scope.eId}})
            .$promise
            .then(function(countVal){
                  $scope.countVal = countVal.count;
                  if($scope.countVal==0){
                    ExamCourses.create({"examId" : $scope.eId , "courseId": $scope.id,"groupName":$scope.examGname})
                    .$promise
                    .then(function(results){
                                alert("Mapped Successfully");
                                ExamCourses.find({filter:{"where":{"courseId": $scope.id},"include":{"relation":"exams","scope":{"fields":["id","title"]}}}})
                                .$promise
                                .then(function(exams){
                                       $scope.examCourses = exams;
                                    },function(error){
                                        console.log(error);
                                    });
                            },function(error){
                                alert("Mapping issue - ", error);
                            });
                    }
                    else{
                        alert("This exam is already mapped to this course");
                    }
                },function(error){
                    });

        };

        $scope.credits;
        $scope.mapTest = function () {
            console.log($scope.tsTitle);
            console.log($scope.id);
            $scope.tId;
            // $scope.testSpecSearch = testSpecSearch;
            //        $scope.testSpecRes = [];
            //        $scope.testSpecId = [];
            for (var i = $scope.testSpecRes.length - 1; i >= 0; i--) {
                if($scope.testSpecRes[i] == $scope.tsTitle)
                    $scope.tId = $scope.testSpecId[i];    
            }
            $scope.countV;

            CourseTests.count({where:{"courseId": $scope.id,"testSpecificationId": $scope.tId}})
            .$promise
            .then(function(countVal){
                  $scope.countV = countVal.count;
                  if($scope.countV==0){
                    CourseTests.create({"id":0,"testSpecificationId" : $scope.tId , "courseId": $scope.id, "credits":$scope.credits})
                    .$promise
                    .then(function(results){
                        alert("Mapped Successfully");
                        Course.tests({id:$scope.id,filter:{"include":{"relation":"tests"}}})
                        .$promise
                        .then(function(courseTestRes){
                            $scope.courseTestRes = courseTestRes;
                        },
                        function(error){
                            console.log(error);
                        });
                    },function(error){
                        alert("Mapping issue - ", error);
                    });
                    }
                    else{
                        alert("This test specification is already mapped to this course");
                    }
                },function(error){
                    });

        };

    },
]);

routerApp.controller('ExamCoursesEditController', ['$scope', '$modalInstance', 'examObject', 'ExamCourses', 
    function($scope, $modalInstance, examObject, ExamCourses) {

        console.log(examObject);
        $scope.examObject = examObject;

        $scope.save = function () {
        ExamCourses.upsert({"id":$scope.examObject.id , "groupName": $scope.examObject.groupName , "examId" : $scope.examObject.examId , "courseId" : $scope.examObject.courseId })  
        .$promise
        .then(function(results){
            alert("Group name updated successfully");
            $modalInstance.dismiss('cancel');
            },function(error){
                alert("Group name updation failed. Error - ", error);
                console.log(error);
            });
         };

        
    },
]);


