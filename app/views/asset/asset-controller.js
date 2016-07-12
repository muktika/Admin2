var routerApp = angular.module('sbAdminApp');

routerApp.controller('AssetsListController', ['$scope', 'Assets', '$modal', 
			 function($scope, Assets,$modal) {

		$scope.assets;
		$scope.show=0;
		$scope.video = function(){
        Assets.find({filter:{"where":{"contentType":"VIDEO"}}})
            .$promise
            .then(function(results){
                $scope.assets = results;
                $scope.show =1;

                $scope.open = function (node) {
                      var modalInstance = $modal.open({
                        controller: 'AssetEditController',
                        templateUrl: 'views/asset/assetmodal.html',
                        resolve: {
                          assetInfo : function () {
                            return node;
                          }
                        }
                      });
                    };

            },function(error){});
        }

        $scope.document = function(){
        Assets.find({filter:{"where":{"contentType":"DOCUMENTS"}}})
            .$promise
            .then(function(results){
                $scope.assets = results;
                $scope.show = 1;

                $scope.open = function (node) {
                      var modalInstance = $modal.open({
                        controller: 'AssetEditController',
                        templateUrl: 'views/asset/assetmodal.html',
                        resolve: {
                          assetInfo : function () {
                            return node;
                          }
                        }
                      });
                    };

            },function(error){});
        }

		$scope.add = function (node) {
        var modalInstance = $modal.open({
          controller: 'AssetEditController',
          templateUrl: 'views/asset/assetmodal.html',
          resolve: {
            assetInfo : function () {
              return node;
            }
          }
        });
      }; 

    $scope.delete = function (id){
            $scope.ID = id;
            if(confirm("Are you sure you want to delete this asset and all its dependencies?"))
            { 
              Assets.deleteById({"id" : $scope.ID})
              .$promise
              .then(function(result){
                  alert("Assets deleted Successfully.");
                  $state.go('dashboard.assets', {}, {reload: true});
              },function(err){
                  console.log(error);
              });
            }
             else{
                alert("Deletion cancelled.");
                }
            };        

}]);


routerApp.controller('AssetEditController', ['$scope', 'Assets', '$modalInstance', 'assetInfo', 'Topic',
	function($scope, Assets,$modalInstance, assetInfo, Topic) {

		$scope.assetInfo = assetInfo;
		if($scope.assetInfo == 0  || $scope.assetInfo == null){
			$scope.assetInfo = new Object();
			$scope.assetInfo.id = 0;
		}

		$scope.topic;
		Topic.find()
		.$promise
        .then(function(results){
        	$scope.topic = results;
        },
        function(error){
        	console.log(error);
        });

         $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
            window.location.reload(true);
        };

         $scope.ok = function () {
         	console.log($scope.assetInfo);
         	Assets.count({where:{"title":$scope.assetInfo.title, "id":{"neq":$scope.assetInfo.id}}})
            .$promise
            .then(function(counts){
            	if(counts.count==0){
            		if($scope.assetInfo.title =="", $scope.assetInfo.description =="" || $scope.assetInfo.url == "" || $scope.assetInfo.author == "" || $scope.assetInfo.authorThumbnail == "" || $scope.assetInfo.authorUrl =="" || $scope.assetInfo.content =="" || $scope.assetInfo.contentType == "" , $scope.assetInfo.thumbnailUrl =="" || $scope.assetInfo.assetType =="" || $scope.assetInfo.title ==null, $scope.assetInfo.description ==null || $scope.assetInfo.url == null || $scope.assetInfo.author == null || $scope.assetInfo.authorThumbnail == null || $scope.assetInfo.authorUrl ==null || $scope.assetInfo.content ==null || $scope.assetInfo.contentType == null , $scope.assetInfo.thumbnailUrl ==null || $scope.assetInfo.assetType ==null)
            				alert("Please fill all fields before submitting.");
            		else{
                    Assets.upsert({"id": $scope.assetInfo.id, "assetType": $scope.assetInfo.assetType , "author": $scope.assetInfo.author, "authorThumbnail": $scope.assetInfo.authorThumbnail ,"authorUrl": $scope.assetInfo.authorUrl ,"content": $scope.assetInfo.content, "contentType": $scope.assetInfo.contentType , "description": $scope.assetInfo.description, "embedcode": $scope.assetInfo.embedcode, "source": $scope.assetInfo.source ,	"thumbnailUrl": $scope.assetInfo.thumbnailUrl ,	"title": $scope.assetInfo.title, "topicId": $scope.assetInfo.topicId , "url": $scope.assetInfo.url})
                    .$promise
                    .then(function(results){
                    	console.log(results);
                    	alert("Asset Created/Editted successfully.");
                    	console.log($scope.assetInfo);
                    	},function(error){
                    	alert("Asset edit/create operation failed due to some unexpected errors.");
                    	console.log(error);
                    	});
                      }
                	}
                else{
                	alert("An asset with same title already exists. Please re-enter title.")
                }
            },function(error){});

        };

}]);

// routerApp.controller('AssetOTDController', ['$scope', 'AssetOfDay', 'Assets',
//   function($scope, AssetOfDay,Assets) {

//     $scope.info = [];
//     $scope.assetOTD = {};

//     AssetOfDay.find()
//     .$promise
//     .then(function(results){
//       console.log(results);
//       $scope.info = results;
//       $scope.assetOTD = $scope.info[0];
//       console.log($scope.info[0]);
//     },
//     function(error){
//       console.log(error);
//     });

//     Assets.findOne({filter:{"where":{id:$scope.assetOTD.assetId}}})
//     .$promise
//     .then(function(result){
//       $scope.asset = result;
//     },
//     function(error){
//       console.log(error);
//     });

//     scope.assetTitle;
//     $scope.aTitle;
//     $scope.searchR;
//     $scope.searchRes  = [];
//     $scope.searchId = [];

//     $scope.complete = function(){

//         Course.find({filter:{"fields":["id","title"],"where":{"title":{"like":"%"+$scope.assetTitle+"%"}}}})
//         .$promise
//         .then(function(searchR){
//                $scope.searchR = searchR;
//                $scope.searchRes = [];
//                $scope.searchId= [];
//                for (var i = $scope.searchR.length - 1; i >= 0; i--) {
//                 $scope.searchRes.push($scope.searchR[i].title);
//                 $scope.searchId.push($scope.searchR[i].id);
//                 }
//             },function(error){
//                 console.log(error);
//             });

//         $( "#search-tag" ).autocomplete({
//           autoFocus: true,
//           source: $scope.searchRes,
//           select: function(event, ui) { 
//             $scope.aTitle = ui.item.value;
//            $(this).autocomplete('widget').zIndex(-100);
//         },
//         open: function () {
//             $(this).autocomplete('widget').zIndex(1100);
//         }
//     });

   
//     };
    
// }]);


