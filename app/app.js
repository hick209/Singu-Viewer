(function() {
  "use strict";
  angular.module('singu-viewer', [
    'ngRoute',
    'ngCookies',
    'ngMessages',
    'ngMaterial',
    'ngMap',
    'md.data.table',
  ]);

  // Controllers
  angular.module('singu-viewer').controller('AppController', [
    '$scope',
    '$location',
    '$mdSidenav',
    'AuthService',
    'ErrorHandler',
    AppController
  ]);

  function AppController(
    $scope,
    $location,
    $mdSidenav,
    AuthService,
    ErrorHandler
  ) {
    const viewModel = this;

    // const apiCallGetUrl = 'https://api.singu.com.br/v2/artist/free-schedules';
    // const headers = {
    //   "Authorization": `Bearer ${user.token}`
    // };

    $scope.toolbar = {};
    $scope.tabs = {
      selectedIndex: $location.path().startsWith('/requests') ? 1 : 0,
    };

    init();

    function init() {
      AuthService($scope, () => { console.info(`Logged in as ${$scope.auth.user.name}`) });

      $scope.$watch('tabs.selectedIndex', (current, old) => {
        switch (current) {
          case 0:
            $location.url("/agenda");
            break;
          case 1:
            $location.url("/requests");
            break;
        }
      });
    }
  }
})();
