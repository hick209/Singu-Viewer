(function() {
  "use strict";
  angular.module('singu-viewer', [
    'ngRoute',
    'ngCookies',
    'ngMessages',
    'ngMaterial',
    'ngMap',
    'angularMoment',
    'md.data.table',
  ]);

  // Controllers
  angular.module('singu-viewer')
      .controller('AppController', [
        '$scope',
        '$rootScope',
        '$location',
        '$mdSidenav',
        'AuthService',
        'ErrorHandler',
        AppController
      ]);

  function AppController(
    $scope,
    $rootScope,
    $location,
    $mdSidenav,
    AuthService,
    ErrorHandler
  ) {
    const viewModel = this;

    viewModel.toolbar = {
      refresh: refresh,
    };
    viewModel.tabs = {
      data: [
        { label: 'Minha Agenda', },
        { label: 'Novos Pedidos', },
        { label: 'Histórico', },
      ],
    };
    if ($location.path().startsWith('/history')) {
      viewModel.tabs.selectedIndex = 2;
    }
    else if ($location.path().startsWith('/requests')) {
      viewModel.tabs.selectedIndex = 1;
    }
    else {
      viewModel.tabs.selectedIndex = 0;
    }

    init();

    function init() {
      $rootScope.refresh = () => new Promise((resolve, reject) => resolve());

      $scope.auth = AuthService;

      $scope.$on('loading', (event, state) => {
        viewModel.loading = state;
      });

      $scope.$watch('viewModel.tabs.selectedIndex', (current, old) => {
        switch (current) {
          case 0:
            $location.url("/agenda");
            break;
          case 1:
            $location.url("/requests");
            break;
          case 2:
            $location.url("/history");
            break;
        }
      });
    }

    function refresh() {
      $rootScope.refresh();
    }
  }
})();
