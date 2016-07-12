'use strict';
/**
 * @ngdoc overview
 * @name sbAdminApp
 * @description
 * # sbAdminApp
 *
 * Main module of the application.
 */
var routerApp = angular.module('sbAdminApp', ['oc.lazyLoad','ui.router','ui.bootstrap','angular-loading-bar', 'ngResource'])
routerApp.config(['$httpProvider','$stateProvider','$urlRouterProvider','$ocLazyLoadProvider',function ($httpProvider, $stateProvider,$urlRouterProvider,$ocLazyLoadProvider) {
    
    $ocLazyLoadProvider.config({
      debug:false,
      events:true,
    });

  $httpProvider.defaults.useXDomain = true;

  delete $httpProvider.defaults.headers.common['X-Requested-With'];

  

  // Remove # from URL
  // $locationProvider.html5Mode(
  //   {
  //       enabled: true,
  //       requireBase: true
  //   });

  // $locationProvider.hashPrefix('!');

    $urlRouterProvider.otherwise('/login');

    $stateProvider
      .state('dashboard', {
        url:'',
        templateUrl: 'views/layout/main.html',
         
        resolve: {
            loadMyDirectives:function($ocLazyLoad){
                return $ocLazyLoad.load(
                {
                    name:'sbAdminApp',
                    files:[
                    'views/header/header.js',
                    'views/header/header-notification/header-notification.js',
                    'views/sidebar/sidebar.js',
                    'views/sidebar/sidebar-search/sidebar-search.js'
                    ]
                }),
                $ocLazyLoad.load(
                {
                   name:'toggle-switch',
                   files:["bower_components/angular-toggle-switch/angular-toggle-switch.min.js",
                          "bower_components/angular-toggle-switch/angular-toggle-switch.css"
                      ]
                }),
                $ocLazyLoad.load(
                {
                  name:'ngAnimate',
                  files:['bower_components/angular-animate/angular-animate.js']
                })
                $ocLazyLoad.load(
                {
                  name:'ngCookies',
                  files:['bower_components/angular-cookies/angular-cookies.js']
                })
                $ocLazyLoad.load(
                {
                  name:'ngResource',
                  files:['bower_components/angular-resource/angular-resource.js']
                })
                $ocLazyLoad.load(
                {
                  name:'ngSanitize',
                  files:['bower_components/angular-sanitize/angular-sanitize.js']
                })
                $ocLazyLoad.load(
                {
                  name:'ngTouch',
                  files:['bower_components/angular-touch/angular-touch.js']
                })
            }
        }
    })
      .state('dashboard.home',{
        url:'/home',
        controller: 'LoginController',
        templateUrl:'views/layout/home.html',
         
        resolve: {
          loadMyFiles:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'sbAdminApp',
              files:[
              'views/login/login-controller.js'
              ]
            })
          }
        }
      })

      .state('dashboard.mentorship',{
        url:'/mentorship',
        controller: 'MentorshipController',
        templateUrl:'views/mentorship/mentorship.html',
         
        resolve: {
          loadMyFiles:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'sbAdminApp',
              files:[
              'views/mentorship/mentorship-controller.js'
              ]
            })
          }
        }
      })
     
      .state('dashboard.exams',{
        templateUrl:'views/exams/exams.html',
        url:'/exams',
        controller: 'ExamListController',
        
        resolve: {
          loadMyFiles:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'sbAdminApp',
              files:[
              'views/exams/exam-controller.js'
              ]
            })
          }
        }
    })

      .state('dashboard.courses',{
        templateUrl:'views/courses/courses.html',
        url:'/courses',
        controller: 'CoursesListController',
          
        resolve: {
          loadMyFiles:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'sbAdminApp',
              files:[
              'views/courses/course-controller.js'
              ]
            })
          }
        }
    })

      .state('dashboard.users',{
        templateUrl:'views/users/users.html',
        url:'/users',
        controller: 'UserController',
          
         resolve: {
          loadMyFiles:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'sbAdminApp',
              files:[
              'views/users/user-controller.js'
              ]
            })
          }
        }
    })

      .state('dashboard.purchases',{
        templateUrl:'views/users/purchases.html',
        url:'/purchases',
        controller: 'PurchasesController',
          
         resolve: {
          loadMyFiles:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'sbAdminApp',
              files:[
              'views/users/user-controller.js'
              ]
            })
          }
        }
    })

      .state('login',{
        templateUrl:'views/login/login.html',
        url:'/login',
        controller: 'LoginController',
        resolve: {
          loadMyFiles:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'sbAdminApp',
              files:[
              'views/login/login-controller.js'
              ]
            })
          }
        }
    })

      .state('table',{
        templateUrl:'views/table.html',
        url:'/table'
        
    })

      .state('dashboard.allocation',{
        templateUrl:'views/allocation/allocation.html',
        url:'/allocation',
        controller: 'AllocationController',
          
       resolve: {
          loadMyFiles:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'sbAdminApp',
              files:[
              'views/allocation/allocation-controller.js'
              ]
            })
          }
        }
    })

      .state('dashboard.assetOTD',{
        templateUrl:'views/assetOTD/assetsOfTheDay.html',
        url:'/assetOfTheDay',
        controller: 'AssetOTDController',
          
         resolve: {
          loadMyFiles:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'sbAdminApp',
              files:[
              'views/assetOTD/assetOTD-controller.js'
              ]
            })
          }
        }
    })

      .state('dashboard.testSpecs',{
        templateUrl:'views/testSpecs/testSpec.html',
        url:'/testSpecifications',
        controller: 'TestSpecsListController',
          
         resolve: {
          loadMyFiles:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'sbAdminApp',
              files:[
              'views/testSpecs/testSpec-controller.js'
              ]
            })
          }
        }
    })

    .state('dashboard.notifications', {
      url: '/notifications',
      templateUrl: 'views/notifications/notifications.html',
      controller: 'NotificationController',
        
         resolve: {
        loadMyFiles:function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name:'sbAdminApp',
            files:[
            'views/notifications/notifications.js'
            ]
          })
        }
      }
    
    })

    .state('dashboard.history', {
      url: '/notificationHistory',
      templateUrl: 'views/notifications/history.html',
      controller: 'NotificationHistoryController',
        
         resolve: {
        loadMyFiles:function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name:'sbAdminApp',
            files:[
            'views/notifications/notifications.js'
            ]
          })
        }
      }
    })
	
	.state('dashboard.tests',{
        templateUrl:'views/tests/tests.html',
        url:'/tests',
        controller: 'TestListController',
          
         resolve: {
          loadMyFiles:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'sbAdminApp',
              files:[
              'views/tests/test-controller.js'
              ]
            })
          }
        }
    })

    .state('dashboard.assets', {
      url: '/assets',
      templateUrl: 'views/asset/assets.html',
      controller: 'AssetsListController',
        
         resolve: {
        loadMyFiles:function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name:'sbAdminApp',
            files:[
            'views/asset/asset-controller.js'
             ]
          })
        }
      }
      })
      
}]);
   
// Redirection when fall on authenticated page as guest
// routerApp.factory('RouteValidator', ['$rootScope', 'User', '$state', function($rootScope, User, $state){

//   return {
//     init: init
//   };

//   function init(){
//       $rootScope.$on('$stateChangeStart', _onStateChangeStart);
//   }

//   function _onStateChangeStart(event, toState, toParams, fromState, fromParams){

//     var toStateRequiresAuth = _requiresAuth(toState);

//     if(!User.getCurrentId() && toStateRequiresAuth){
//         event.preventDefault();
//         var res = window.location.href.split("/");
//         $state.go('login');
//         return;
//     }
//   }

//   function _requiresAuth(toState){
//       if(angular.isUndefined(toState.data) || !toState.data.requiresAuth){
//           return false;
//       }
//       return toState.data.requiresAuth;
//   }

// }]);

// routerApp.run(['$rootScope', 'RouteValidator', 'User', function($rootScope, RouteValidator, User){
  
//   RouteValidator.init();
//   $rootScope.loggedIn = function(){
//     if(User.getCurrentId())
//       return true;

//     return false;
//   };

// }]);