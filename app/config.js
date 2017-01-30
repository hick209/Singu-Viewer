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

    // Prepare the service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('ServiceWorker.js')
        .then(() => console.info("Registered service worker!"))
        .catch(error => console.error(error));
    }
  }
})();
