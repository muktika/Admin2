var routerApp = angular.module('sbAdminApp');

routerApp.controller('ExamListController', ['$scope', 'Exams', '$modal' , '$state', 'User',
	function($scope,Exams,$modal,$state,User) {
		
	    Exams.find()
	    	.$promise
	    	.then(function (results) 
    		{
    			$scope.results = results;
    			$scope.open = function (node) {
					  var modalInstance = $modal.open({
					    controller: 'ExamEditController',
					    templateUrl: 'views/exams/exammodal.html',
					    resolve: {
					      exam: function () {
					        return node;
					      }
					    }
					  });
					};
					// $scope.open = function (node) {
					//   var modalInstance = $modal.open({
					//     controller: 'JsonEditController',
					//     templateUrl: 'views/exams/jsonmodal.html',
					//     resolve: {
					//       exam: function () {
					//         return node;
					//       }
					//     }
					//   });
					// };
			},
    		function (error) 
    		{
                console.log(error);
            }
	    );

			$scope.delete = function (node) {
				if(confirm("Are you sure you want to delete this exam and all its dependencies?"))
	            { 
	                $scope.success;
	                Exams.examcourses.destroyById({"id" : node.id})
	                .$promise
	                .then(function(res){
	                    $scope.success=1;
	                    Exams.deleteById({"id" : node.id})
	                    .$promise
	                    .then(function(result){
	                        $scope.success=1;
	                    },function(err){
	                        console.log(error);
	                        $scope.success=0;
	                    });
	                    if($scope.success == 1)
	                     {
	                     alert("Exam deleted Successfully.");
	                     $state.go('dashboard.exams', {}, {reload: true});
	                 }
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

routerApp.controller('ExamEditController', ['$scope', 'Exams', '$modalInstance', 'exam', '$modal', 'ExamCourses', 'Course', 'Category', 'ExamCategory', '$state',
	function($scope, Exams, $modalInstance, exam, $modal, ExamCourses, Course, Category, ExamCategory, $state) {
				
		$scope.id;
		$scope.editVal=0;
		$scope.infojson;
		$scope.newname;
		$scope.ExamCategoryList;
		$scope.examCourses= [];
		$scope.Ecategory = {"id":"","name":""};
		$scope.selection = [{"title": "","dates": "","pattern": ""},{"title": "","dates": "","pattern": ""},{"title": "","dates": "","pattern": ""}];
		var today = new Date();
		$scope.date = today.toISOString().substring(0, 10);
        $scope.infojson;
		if(exam == 0){
			$scope.id=0;
			$scope.exam = [];
			$scope.ExamCategoryList = [];
			$scope.exam.id = 0;
			$scope.exam.image = "Image URL";
			$scope.exam.createdDate = $scope.date;
			$scope.exam.title="";
			$scope.exam.description="";
			$scope.exam.type="";
			$scope.exam.url="";
			$scope.exam.haspage=false;
			$scope.exam.hascourses=false;
            $scope.infojson = new Object();
		}
		else{
			$scope.exam = exam;
			$scope.Ecatname;
			$scope.id = $scope.exam.id;
			$scope.exam.createdDate = $scope.exam.createdAt;
			if($scope.exam.info == "" || $scope.exam.info == null){
				$scope.infojson = new Object;
				$scope.infojson.selection_procedure = [];
			}
			else{
				$scope.infojson = $scope.exam.info;
			}
			if($scope.exam.image == "" || $scope.exam.image == null)
				$scope.exam.image = "ImageURL";
			if($scope.infojson.selection_procedure != null){
			for (var i = 0; i<= $scope.infojson.selection_procedure.length - 1; i++) {
				if($scope.infojson.selection_procedure[i].title !="" || $scope.infojson.selection_procedure[i].pattern !="" || $scope.infojson.selection_procedure[i].dates != "")
				{
					$scope.selection[i].title = $scope.infojson.selection_procedure[i].title;
					$scope.selection[i].pattern = $scope.infojson.selection_procedure[i].pattern;
					$scope.selection[i].dates = $scope.infojson.selection_procedure[i].dates;
				}
			}
			}
		}

		if($scope.id != 0){
		ExamCourses.find({filter:{"where":{"examId": $scope.id},"include":{"relation":"courses","scope":{"fields":["id","title"]}}}})
        .$promise
        .then(function(courses){
               $scope.examCourses = courses;
            },function(error){
                console.log(error);
            });
    	}

		if($scope.id !=0){
		ExamCategory.count({"where":{"examId":$scope.id}})
		.$promise
        .then(function(count){
           if(count.count>0){
			ExamCategory.find({filter:{"where":{"examId":$scope.id},"include":{"relation":"category"}}})
        	.$promise
        	.then(function(categoryList){
        	 $scope.ExamCategoryList = categoryList;
        	 },function(error){
                console.log(error);
            });
        	}
        	else{
        		$scope.ExamCategoryList = [];
        	}
         },function(error){
                console.log(error);
            });
        }



        $scope.groupN = [];
        $scope.groupO = [];
        $scope.showOrder=0;
        $scope.orderId = [];
        $scope.showOrderList = function(){
        if($scope.id!=0){
	    	ExamCourses.find({filter:{"where":{"examId": $scope.id}}})
	        .$promise
	        .then(function(order){
	               $scope.orderId = order;
		            for (var j = 0; j < $scope.orderId.length; j++) {
		               	if(Boolean($scope.orderId[j].groupName)){
		               	  var index = $.inArray($scope.orderId[j].groupName, $scope.groupN);
					        if (index == -1) { 
					            $scope.groupN.push($scope.orderId[j].groupName);
					            $scope.groupO.push($scope.orderId[j].order);
					        }
					    }else{
		            		alert("Please enter group names for all courses first");
		            		break;
		            	}
		            }
		            $scope.showOrder=1;
	            },function(error){
	                console.log(error);
	            });
	    	}
	    }

	    $scope.saveOrder = function(orderArray){
	    	for (var i = 0; i < $scope.groupN.length; i++) {
	    		for (var j = 0; j < orderArray.length; j++) {
	    			if(orderArray[j].groupName == $scope.groupN[i]){
	    				orderArray[j].order = $scope.groupO[i];
	    			}
	    		}
	    		if(i == ($scope.groupN.length - 1)){
    				upsertOrder(orderArray);
    			}
	    	}
	    }

	    function upsertOrder(array){
	    	var count = 0;
			for (var i = 0; i < array.length; i++) {
				ExamCourses.upsert(array[i])
				.$promise
				.then(function(success){
					count++;
					 if( count == (array.length - 1)){
					 	alert("Ordering of courses successfully executed");
					 	$modalInstance.dismiss('cancel');
					} 
				},function(error){
				    console.log(error);
				    alert("Some error occurred while ordering the courses. Please try again.");
				});
			}
	    }


        $scope.create = function () {
        	
			if($scope.exam.title=="" || $scope.exam.description=="" || $scope.exam.type==""){
				alert("All fields are mandatory to fill. Please fill all fields.");
	      }else{
			 if($scope.exam.image == "" || $scope.exam.image == null)
			 {
			 	$scope.exam.image == "ImageURL";
			 }
			 if($scope.exam.haspage == false && $scope.exam.url != null){
			 	alert("Url cannot have any value if haspage is false. Do not enter value for Url");
			 	console.log($scope.exam.url);
			 	$scope.exam.url=null;
			 }else{
			 $scope.infojson.page_title = $scope.exam.title;
			 console.log($scope.exam);
			 if($scope.exam.haspage == true){

			 if($scope.exam.url == null || $scope.exam.url == ""){
			 	alert("Url cannot have be empty if haspage is true. Enter value for Url");
			 	$scope.exam.url="";
			 }
			 else{
			 Exams.count({where:{"url":$scope.exam.url, "haspage": true, "id":{"neq": $scope.exam.id}}})
	   		.$promise
	        .then(function(uCount){
	        	$scope.uCount = uCount.count;
               if($scope.uCount > 0)
		  		{
		  			alert("Another exam with same URL exists with haspage flag as true. Re-enter URL.");
		  		}
		  		else{
		  			Exams.upsert({"id" : $scope.exam.id, "title": $scope.exam.title, "description": $scope.exam.description, "url": $scope.exam.url, "type": $scope.exam.type, "image": $scope.exam.image, "info": $scope.infojson , "createdAt": $scope.date, "updatedAt": $scope.date, "haspage": $scope.exam.haspage, "hascourses": $scope.exam.hascourses})
		            .$promise
		            .then(function(results){
	            	alert("Completed. Proceed to next tab and fill Exam Info.");
	            	if($scope.id==0){
				      Exams.findOne({filter:{"fields":["id"],"where":{"url":$scope.exam.url,"title": $scope.exam.title, "description": $scope.exam.description}}})
			            .$promise
				        .then(function(resultId){
				        	$scope.id = resultId.id;
				            $scope.exam.id= $scope.id;
					},function(error){
		                console.log("Error:",error);
		            });
		   		 }
	            },function(error){
	                alert("Save failed type- " + error);
	                console.log(error);
	            });
		  		}
		  	},function(error){
                console.log(error);
            });	
	    }
            }else{
		  			Exams.upsert({"id" : $scope.exam.id, "title": $scope.exam.title, "description": $scope.exam.description, "url": $scope.exam.url, "type": $scope.exam.type, "image": $scope.exam.image, "info": $scope.infojson , "createdAt": $scope.date, "updatedAt": $scope.date, "haspage": $scope.exam.haspage, "hascourses": $scope.exam.hascourses})
		            .$promise
		            .then(function(results){
	            	alert("Completed. Proceed to next tab and fill Exam Info.");
	            	if($scope.id==0){
				      Exams.findOne({filter:{"fields":["id"],"where":{"url":$scope.exam.url,"title": $scope.exam.title, "description": $scope.exam.description}}})
			            .$promise
				        .then(function(resultId){
				        	$scope.id = resultId.id;
				            $scope.exam.id= $scope.id;
					},function(error){
		                console.log("Error:",error);
		            });
		   		 }
	            },function(error){
	                alert("Save failed type- " + error);
	                console.log(error);
	            });
		  		}
			} 
	       }
        };
    
		$scope.ok = function () {
			$scope.data;
	  		$scope.infojson.selection_procedure = [];
	  		for (var i = 0; i <= $scope.selection.length - 1; i ++) {
	  			if($scope.selection[i].title =="" && $scope.selection[i].pattern =="" && $scope.selection[i].dates == "")
				{
					continue;
				}
				else{
					$scope.infojson.selection_procedure.push($scope.selection[i]);
				}
	  		}
	  		if($scope.exam.image == "" || $scope.exam.image == null)
			 {
			 	$scope.exam.image == "ImageURL";
			 }
			$scope.data = $scope.infojson;
	  		
			Exams.prototype$updateAttributes({"id" : $scope.id, "info": $scope.data, "updatedAt": $scope.date, "image": $scope.exam.image})
			.$promise
			.then(function(results){
			alert("Exam Info added/editted Successfully.");
			},function(error){
			alert("Exam Info changes failed - " + error);
			});
	        
	};

		  $scope.cancel = function () {
		    $modalInstance.dismiss('cancel');
			window.location.reload(true);
		};

		$scope.categories;
		Category.find()
        .$promise
        .then(function(categories){
        	$scope.categories = categories;
        	 },function(error){
                console.log(error);
            });

        $scope.addNewC=0;
        $scope.addNew = function(){
        	$scope.addNewC =1;

        };

        $scope.deleteCategory = function (deleteItem) {
        	 $scope.delId = deleteItem;
		    console.log($scope.delId);
		    ExamCategory.deleteById({"id": $scope.delId})
		    .$promise
	        .then(function(result){
	        	alert("Exam-Category mapping deleted successfully");
	        	ExamCategory.find({filter:{"where":{"examId":$scope.id},"include":{"relation":"category"}}})
		        	.$promise
		        	.then(function(categoryList){
		        	 $scope.ExamCategoryList = categoryList;
			        	 },function(error){
			                console.log(error);
			            });
	        	 },function(error){
	                console.log(error);
	            });
		};

        
        $scope.addNewCategory = function(){
        	Category.count({"where":{"name":$scope.Ecategory.name}})
        	.$promise
	        .then(function(result){
	        	if(result.count ==0){
        	 Category.create({"name":$scope.Ecategory.name})
        	.$promise
	        .then(function(categories){
	        	Category.findOne({filter:{"where":{"name":$scope.Ecategory.name}}})
	        	.$promise
	        	.then(function(Ecategory){
	        	 $scope.Ecategory = Ecategory;
	        	 alert("New category created successfully. Click update to map this exam to the new Category");
	        	 },function(error){
	                console.log(error);
	            });
	          },function(error){
	                console.log(error);
	            });
	    	}
	    	else{
	    		alert("Category with this name already exists. Re-enter name");
	    	}
	    	},function(error){
	                console.log(error);
	            });
        };

        $scope.updateExamCategory = function(){
        	console.log($scope.id,$scope.Ecategory.id);
        	ExamCategory.count({"where":{"examId":$scope.id,"categoryId":$scope.Ecategory.id}})
        	.$promise
	        .then(function(count){
	        	if(count.count == 0){
	        	ExamCategory.upsert({"examId":$scope.id,"categoryId":$scope.Ecategory.id})
	        	.$promise
		        .then(function(categories){
		        	alert("Exam mapped to category successfully");
		        	$scope.addNewC=0;
		        	ExamCategory.find({filter:{"where":{"examId":$scope.id},"include":{"relation":"category"}}})
		        	.$promise
		        	.then(function(categoryList){
		        	 $scope.ExamCategoryList = categoryList;
			        	 },function(error){
			                console.log(error);
			            });
		        	 },function(error){
		                console.log(error);
		            });
	        		}
	        		else{
	        			alert("This category is alrerady mapped to this exam.");
	        		}
	        },function(error){
	                console.log(error);
	            });
        };

		$scope.courseTitle;
		$scope.cTitle="";
		$scope.examGname="";
		$scope.freeText="";
		$scope.searchR;
		$scope.searchRes  = [];
		$scope.searchId = [];

		$scope.complete = function(){

        Course.find({filter:{"fields":["id","title"],"where":{"title":{"like":"%"+$scope.courseTitle+"%"}}}})
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

        $( "#search-tag" ).autocomplete({
          autoFocus: true,
          source: $scope.searchRes,
          select: function(event, ui) { 
            $scope.cTitle = ui.item.value;
           $(this).autocomplete('widget').zIndex(0);
        },
        open: function () {
            $(this).autocomplete('widget').zIndex(1100);
        }
    });

   
    };

    	$scope.map = function () {

            if($scope.cTitle!="" && $scope.examGname != "" && $scope.freeText != ""){
            $scope.cId;
            for (var i = $scope.searchRes.length - 1; i >= 0; i--) {
            	if($scope.searchRes[i] == $scope.cTitle)
            		$scope.cId = $scope.searchId[i];	
            }
            $scope.countVal;

            ExamCourses.count({where:{"courseId": $scope.cId,"examId": $scope.id}})
            .$promise
            .then(function(countVal){
                  $scope.countVal = countVal.count;
                  if($scope.countVal==0){
	                ExamCourses.create({"examId" : $scope.id , "courseId": $scope.cId,"groupName":$scope.examGname,"freeText":$scope.freeText,"order":1})
	                .$promise
	                .then(function(results){
	                            alert("Mapped Successfully");
	                            ExamCourses.find({filter:{"where":{"examId": $scope.id},"include":{"relation":"courses","scope":{"fields":["id","title"]}}}})
						        .$promise
						        .then(function(courses){
						               $scope.examCourses = courses;
						            },function(error){
						                console.log(error);
						            });
	                        },function(error){
	                            alert("Mapping issue - ", error);
	                        });
	                }
	                else{
	                	alert("This course is already mapped to this exam");
	                }
                },function(error){
                    });
        }
        else{
        	alert("Please fill all fields.");
        }
               
        };



		$scope.edit = function () {
				$scope.editVal=1;
        };

        $scope.save = function (examObject) {
        $scope.examObject = examObject;
        console.log($scope.examObject);
        ExamCourses.upsert({"id":$scope.examObject.id , "groupName": $scope.examObject.groupName , "examId" : $scope.examObject.examId , "courseId" : $scope.examObject.courseId , "courseOnSale": $scope.examObject.courseOnSale, "displayName": $scope.examObject.displayName ,"freeText":$scope.examObject.freeText, "order":$scope.examObject.order})  
        .$promise
        .then(function(results){
            alert("ExamCourses Information updated successfully");
            },function(error){
                alert("ExamCourses Information updation failed. Error - ", error);
                console.log(error);
            });
        $scope.editVal=0;
         };

        $scope.delmap = function (examcourse) {
         	$scope.deleteId=examcourse.id;
         	ExamCourses.deleteById({"id":$scope.deleteId})
         	.$promise
        	.then(function(results){
                alert("Dependency deleted successfully");
                window.location.reload(true);
                ExamCourses.find({filter:{"where":{"examId": $scope.examId},"include":{"relation":"courses","scope":{"fields":["id","title"]}}}})
		        .$promise
		        .then(function(courses){
		               $scope.examCourses = courses;
		            },function(error){
		                console.log(error);
		            });
        	},function(error){
                console.log(error);
            });
        };


	},
]);


routerApp.controller('JsonEditController', ['$scope', '$modalInstance', 'exam', 'Exams', 
    function($scope, $modalInstance, exam, Exams) {

        $scope.results = exam.info;
        $scope.id=exam.id;
        console.log(exam);
        if(exam.image=="" || exam.image ==null){
        	exam.image = "ImageURL";
        }
        $scope.ok = function () {
        console.log($scope.results);
        Exams.prototype$updateAttributes({"id":$scope.id , "info": $scope.results, "image": exam.image})  
        .$promise
        .then(function(success){
        	console.log("results",success);
            alert("done");
            $modalInstance.dismiss('cancel');
            },function(error){
                alert("error");
                console.log(error);
            });
         };

        
    },
]);




