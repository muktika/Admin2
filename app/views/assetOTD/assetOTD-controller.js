var routerApp = angular.module('sbAdminApp');
routerApp.controller('AssetOTDController', ['$scope', 'AssetOfDay', 'Assets',
  function($scope, AssetOfDay,Assets) {

    $scope.info = [];
    $scope.assetOTD = {};
    $scope.edit = 0;
    $scope.parent = {from :'', to: ''};
    $scope.fromDate;
    $scope.tillDate;

    AssetOfDay.find()
    .$promise
    .then(function(results){
      console.log(results);
      $scope.info = results;
      $scope.assetOTD = $scope.info[0];
      console.log($scope.info[0]);
    },
    function(error){
      console.log(error);
    });

    Assets.findOne({filter:{"where":{id:$scope.assetOTD.assetId}}})
    .$promise
    .then(function(result){
      $scope.asset = result;
    },
    function(error){
      console.log(error);
    });

    $scope.change = function(){
        $scope.edit = 1;
    };

    $scope.cancel = function(){
        $scope.edit = 0;
    };

    $scope.assetTitle= "";
    $scope.aTitle = "";
    $scope.searchR;
    $scope.searchRes  = [];
    $scope.searchId = [];

    $scope.complete = function(){

        Assets.find({filter:{"fields":["id","title"],"where":{"title":{"like":"%"+$scope.assetTitle+"%"}}}})
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
                $scope.aTitle = ui.item.value;
               $(this).autocomplete('widget').zIndex(-100);
            },
            open: function () {
                $(this).autocomplete('widget').zIndex(1100);
            }
        });

      };

    $scope.aId;
    $scope.newAsset = new Object();
    $scope.save = function(){
        //$scope.edit = 0;
        if($scope.aTitle == ""){
          alert("Please fill all details");
        }
        else{

            for (var i = $scope.searchRes.length - 1; i >= 0; i--) {
              if($scope.searchRes[i] == $scope.aTitle)
                $scope.aId = $scope.searchId[i];  
            }

            function formatDate(date) {
                var d = new Date(date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();

                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;

                return [year, month, day].join('-');
            }

            $scope.fromDate = formatDate($scope.parent.from);
            $scope.tillDate = formatDate($scope.parent.to);
            Assets.findOne({filter:{"where":{id:$scope.aId}}})
            .$promise
            .then(function(result){
              $scope.newAsset = result;
              AssetOfDay.upsert({"id":$scope.assetOTD.id, "assetId": $scope.aId , "category": $scope.newAsset.assetType , "assetType" : $scope.newAsset.contentType , "activeFromDate" : $scope.fromDate , "activeTillDate" : $scope.tillDate})
              .$promise
              .then(function(success){
                alert("New Asset Of The Day Successfully Updated");
                $scope.edit = 0;
                AssetOfDay.find()
                .$promise
                .then(function(result){
                  $scope.info = result;
                  $scope.assetOTD = $scope.info[0];
                  Assets.findOne({filter:{"where":{id:$scope.assetOTD.assetId}}})
                  .$promise
                  .then(function(result){
                    $scope.asset = result;
                  },
                  function(error){
                    console.log(error);
                  });
                },
                function(error){
                  console.log(error);
                });
              },
              function(error){
                console.log(error);
              });
            },
            function(error){
              console.log(error);
            });



        }
    };

    
}]);


