var routerApp = angular.module('sbAdminApp');

routerApp.controller('MentorshipController', ['$scope', 'MentorshipSlots','$modal' , '$state',
			 function($scope, MentorshipSlots, $modal, $state) {

	$scope.showRes = 0;
	$scope.results;
	$scope.dateTime;

	function getTimeFormat(paramdate) {
      paramdate = paramdate.replace('Z','');
      var date = new Date(paramdate);
      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      var hours, mins, month, day, year, time;
      month = months[date.getMonth()];
      day = date.getDate();
      year = date.getFullYear();
      hours = ((date.getHours()) - 5);
      mins = date.getMinutes();
      if(mins < 30){
        mins = 30 + mins;
        hours = hours - 1;
      }
      else if(mins>=30 || mins<40){
        mins = "0" + (mins-30);
      }
      else{
        mins = mins - 30;
      }
      if(hours < 0){
        hours = 24 + hours;
        day = day - 1;
      }
      time = hours + ":" + mins;
      date = month + ' ' + day + ', ' + year;
      return date + " " + time;
  	};

  	function globalDateFormat(paramdate) {
      var date = new Date(paramdate);
      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
  	};

	$scope.all = function(){
		$scope.showRes = 0;
    	$scope.dateTime = [];
      $scope.results = [];
		MentorshipSlots.find({filter:{"include":{"relation":"bookedslots","scope":{"include":{"relation":"user"}}},"order":"time ASC"}})
		.$promise
	    .then(function(results){
           for (var i = 0; i < results.length; i++) {
           
            $scope.dateTime.push(getTimeFormat(results[i].time));

           	if(i == results.length - 1){
           		$scope.results = results;
           		$scope.showRes = 1;
           	}
           	
           }
           $scope.showRes = 1;
        },function(error){
            console.log(error);
        });
	}

    $scope.booked = function(){
    	$scope.showRes = 0;
    	$scope.dateTime = [];
      $scope.results = [];
    	MentorshipSlots.find({filter:{"include":{"relation":"bookedslots","scope":{"include":{"relation":"user"},"where":{"status":"Booked"}}},"order":"time ASC"}})
		.$promise
	    .then(function(results){
           for (var i = 0; i < results.length; i++) {


           	  if(results[i].bookedslots.length == 0){
           	  	results.splice(i,1);
           	  	i--;
           	  }else{
                $scope.dateTime.push(getTimeFormat(results[i].time));
              }

           	  if(i == results.length - 1){
           		$scope.results = results;
           		$scope.showRes = 1;
           	}
           }
        },function(error){
            console.log(error);
        });
    }

    $scope.completed = function(){
    	$scope.showRes = 0;
    	$scope.dateTime = [];
      $scope.results = [];
    	MentorshipSlots.find({filter:{"include":{"relation":"bookedslots","scope":{"include":{"relation":"user"},"where":{"status":"Completed"}}},"order":"time ASC"}})
		.$promise
	    .then(function(results){
           for (var i = 0; i < results.length; i++) {


           	  if(results[i].bookedslots.length == 0){
           	  	results.splice(i,1);
           	  	i--;
           	  }else{
                $scope.dateTime.push(getTimeFormat(results[i].time));
              }

           	  if(i == results.length - 1){
           		$scope.results = results;
           		$scope.showRes = 1;
           	}
           }
        },function(error){
            console.log(error);
        });
    }

    $scope.reschedule = function(){
    	$scope.showRes = 0;
    	$scope.dateTime = [];
    	MentorshipSlots.find({filter:{"include":{"relation":"bookedslots","scope":{"include":{"relation":"user"},"where":{"status":"ReSchedule"}}},"order":"time ASC"}})
		.$promise
	    .then(function(results){
           for (var i = 0; i < results.length; i++) {

           	  if(results[i].bookedslots.length == 0){
           	  	results.splice(i,1);
           	  	i--;
           	  }else{
                $scope.dateTime.push(getTimeFormat(results[i].time));
              }

           	  if(i == results.length - 1){
           		$scope.results = results;
           		$scope.showRes = 1;
           	}
           }
        },function(error){
            console.log(error);
        });
    }

    $scope.notreachable = function(){
    	$scope.showRes = 0;
    	$scope.dateTime = [];
    	MentorshipSlots.find({filter:{"include":{"relation":"bookedslots","scope":{"include":{"relation":"user"},"where":{"status":"NotReachable"}}},"order":"time ASC"}})
		.$promise
	    .then(function(results){
           for (var i = 0; i < results.length; i++) {


           	  if(results[i].bookedslots.length == 0){
           	  	results.splice(i,1);
           	  	i--;
           	  }else{
                $scope.dateTime.push(getTimeFormat(results[i].time));
              }

           	  if(i == results.length - 1){
           		$scope.results = results;
           		$scope.showRes = 1;
           	}
           }
        },function(error){
            console.log(error);
        });
    }

    $scope.couldnotcall = function(){
    	$scope.showRes = 0;
    	$scope.dateTime = [];
    	MentorshipSlots.find({filter:{"include":{"relation":"bookedslots","scope":{"include":{"relation":"user"},"where":{"status":"CouldNotCall"}}},"order":"time ASC"}})
		.$promise
    	.then(function(results){
           for (var i = 0; i < results.length; i++) {

           	  if(results[i].bookedslots.length == 0){
           	  	results.splice(i,1);
           	  	i--;
           	  }else{
                $scope.dateTime.push(getTimeFormat(results[i].time));
              }

           	  if(i == results.length - 1){
           		$scope.results = results;
           		$scope.showRes = 1;
           	}
           }
        },function(error){
            console.log(error);
        });
    }

    $scope.open = function (node) {
	  var modalInstance = $modal.open({
	    controller: 'MentorshipEditController',
	    templateUrl: 'views/mentorship/mentorshipmodal.html',
	    data: {
          requiresAuth: true
        },
	    resolve: {
	      mentorship: function () {
	        return node;
	      }
	    }
	  });
	};

}]);

routerApp.controller('MentorshipEditController', ['$scope', 'MentorshipSlots', 'MentorshipSlotsBooked', '$modalInstance', 'mentorship', '$modal', 'User','Exams',
	function($scope, MentorshipSlots, MentorshipSlotsBooked, $modalInstance, mentorship, $modal, User, Exams) {
		
		$scope.id = mentorship.id;
		$scope.editVal = [];
    $scope.e = 0;
		$scope.notes = [];
		$scope.booked = mentorship.bookedslots;
    $scope.searchRes  = [];
    $scope.searchId = [];
    $scope.eTitle;
    $scope.examTitle = "";
		for (var i = 0; i < $scope.booked.length; i++) {
			$scope.notes.push({"mynotes" : ""});
      $scope.editVal.push({"val":0});
		}

	    $scope.cancel = function () {
		    $modalInstance.dismiss('cancel');
		};

		$scope.edit = function(examid,index){
      if(Boolean(examid)){
        Exams.find({filter:{"fields":["id","title"],"where":{"id":examid}}})
        .$promise
        .then(function(res){
            $scope.showTitle = res[0].title;
        },function(error){
            console.log(error);
        });
        
      }
			$scope.editVal[index].val = 1;
      $scope.e =1;
		}

		$scope.save = function(bookedSlot, note, index){
			$scope.bookedSlot = bookedSlot;
			$scope.editVal[index].val = 0;
			$scope.eId;
      for (var i = $scope.searchRes.length - 1; i >= 0; i--) {
          if($scope.searchRes[i] == $scope.eTitle){
              $scope.eId = $scope.searchId[i]; 
              $scope.bookedSlot.examId = $scope.eId;
              $scope.eTitle = "";
              $scope.examTitle = "";
              $scope.searchRes  = [];
              $scope.searchId = []; 
          }  
      }

			if(Boolean(note)){
				note = note.trim();
			}

			if(Boolean(note)){
				if(Boolean($scope.bookedSlot.notes))
					$scope.bookedSlot.notes = $scope.bookedSlot.notes + " Admin: " + note;
				else
				    $scope.bookedSlot.notes = " Admin: " + note;
			}

			MentorshipSlotsBooked.prototype$updateAttributes({id: $scope.bookedSlot.id, "examId": $scope.bookedSlot.examId,"notes": $scope.bookedSlot.notes,"adminNotes": $scope.bookedSlot.adminNotes,"feedback": $scope.bookedSlot.feedback, "status": $scope.bookedSlot.status})
			.$promise
		    .then(function(results){
		           alert("Editted Successfully");
		           for (var i = 0; i < $scope.booked.length; i++) {
		           	 $scope.notes[i].mynotes = "";
                 $scope.editVal[i].val = 0;
		           }
               $scope.e =0;
		        },function(error){
		        	alert("Saving failed.");
		            console.log(error);
		        });

		}

		
      $scope.complete = function(index){

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

        console.log($scope.searchRes);
        $( "#search-tags"+index ).autocomplete({
          autoFocus: true,
          source: $scope.searchRes,
          select: function(event, ui) { 
            $scope.eTitle = ui.item.value;
            $(this).autocomplete('widget').zIndex(-1);
          },
          open: function () {
              $(this).autocomplete('widget').zIndex(1100);
          },
          close: function () {
              $(this).autocomplete('widget').zIndex(-1);
          }
    });

   
    };


}]);