(function() {
  "use strict";
  // Angular configurations
  angular.module('singu-viewer').config([
    '$locationProvider',
    '$routeProvider',
    '$httpProvider',
    '$mdThemingProvider',
    Initialize
  ]);

  function Initialize(
    $locationProvider,
    $routeProvider,
    $httpProvider,
    $mdThemingProvider
  ) {
    // Set the page color theme
    $mdThemingProvider.theme('default')
        .primaryPalette('deep-purple')
        .accentPalette('deep-orange');

    $locationProvider.html5Mode(true);

    // Enable CORS
    // $httpProvider.defaults.useXDomain = true;
    // $httpProvider.defaults.withCredentials = true;
    // delete $httpProvider.defaults.headers.common['X-Requested-With'];
    // $httpProvider.defaults.headers.common['Accept'] = 'application/json';
    // $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';
    // $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    // $httpProvider.defaults.headers.common['Access-Control-Allow-Methods'] = 'OPTIONS,GET,POST,PUT,DELETE';
    // $httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With';

    // Configure routes
    $routeProvider
        .when('/agenda', {
          controller: 'AgendaController',
          controllerAs: 'viewModel',
          templateUrl:'app/agenda/agenda.html',
        })
        .when('/history', {
          controller: 'AgendaHistoryController',
          controllerAs: 'viewModel',
          templateUrl:'app/agenda/agenda.html',
        })
        .when('/requests', {
          controller: 'RequestsController',
          controllerAs: 'viewModel',
          templateUrl:'app/agenda/agenda.html',
        })
        .otherwise({
          redirectTo:'/agenda'
        });
  }
})();
