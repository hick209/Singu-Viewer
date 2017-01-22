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
      selectedIndex: $location.path().startsWith('/requests') ? 1 : 0,
    };

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
        }
      });
    }

    function refresh() {
      $rootScope.refresh();
    }
  }

  angular.module('singu-viewer')
      .filter('amCalendarDate', [
        'moment',
        amCalendarDateFilter
      ]);

  function amCalendarDateFilter(moment) {
    return function(dt) {
      const md = moment(dt).startOf('day');
      var key = '';

      if (!dt || !md || (md + '').toLowerCase() === 'invalid date') return '';

      const today = moment().startOf('day');
      const diff = today.diff(md, 'days');

      if (!diff) {
        key = md.format(`[Hoje, dia] D [de] MMMM`);
      }
      else if (diff == -1) {
        key = md.format(`[Amanhã, dia] D [de] MMMM`);
      }
      // else if (diff == -2) {
      //   key = md.format(`[Depois de amanhã, dia] D`);
      // }
      else if (diff == -1) {
        key = md.format(`[Ontem, dia] D [de] MMMM`);
      }
      // else if (diff == -2) {
      //   key = md.format(`[Anteontem, dia] D`);
      // }
      else if (Math.abs(diff) <= 6) {
        if (diff < 0) {
          key = md.format('dddd, LL');
        }
        else {
          const dayIndex = md.day();
          if (dayIndex == 0 || dayIndex == 6) {
            // Sábado e domingo
            key = md.format(`[Último] dddd[, dia] D [de] MMMM`);
          }
          else {
            key = md.format(`[Última] dddd[, dia] D [de] MMMM`);
          }
        }
      }
      else {
        key = md.format(`dddd, LL`)
      }

      return key;
    }
  }
})();
