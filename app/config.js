(function() {
  "use strict";
  // Angular configurations
  angular.module('singu-viewer').config([
    '$locationProvider',
    '$routeProvider',
    '$mdThemingProvider',
    Initialize
  ]);

  function Initialize(
    $locationProvider,
    $routeProvider,
    $mdThemingProvider
  ) {
    // Set the page color theme
    $mdThemingProvider.theme('default')
        .primaryPalette('deep-purple')
        .accentPalette('deep-orange');

    $locationProvider.html5Mode(true);

    // Configure routes
    $routeProvider
        // .when('/', {
        //   templateUrl:'app/main/main.html',
        //   controllerAs: 'viewModel',
        //   controller: 'MainController',
        // })
        // .when('/users/:id?/:info?', {
        //   controller:'UsersController',
        //   controllerAs: 'viewModel',
        //   templateUrl:'app/users/users.html',
        // })
        // .when('/dev/:id?', {
        //   controller:'DevsController',
        //   controllerAs: 'viewModel',
        //   templateUrl:'app/dev/dev.html',
        // })
        // .when('/routes/:id?', {
        //   controller:'RoutesController',
        //   controllerAs: 'viewModel',
        //   templateUrl:'app/routes/routes.html',
        // })
        // .when('/routes-dev/:id?', {
        //   controller:'RoutesController',
        //   controllerAs: 'viewModel',
        //   templateUrl:'app/routes/routes.html',
        // })
        // .when('/collisions/:id?', {
        //   controller:'CollisionsController',
        //   controllerAs: 'viewModel',
        //   templateUrl:'app/collisions/collisions.html',
        // })
        // .when('/collisions-dev/:id?', {
        //   controller:'CollisionsController',
        //   controllerAs: 'viewModel',
        //   templateUrl:'app/collisions/collisions.html',
        // })
        // .when('/configs', {
        //   redirectTo:'/',
        // })
        // .when('/scripts', {
        //   controller:'ScriptsController',
        //   controllerAs: 'viewModel',
        //   templateUrl:'app/scripts/scripts.html',
        // })
        .otherwise({
          redirectTo:'/'
        });
  }
})();
