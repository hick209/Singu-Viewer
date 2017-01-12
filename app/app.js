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
      $scope.auth = AuthService;

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

  angular.module('singu-viewer')
      .filter('amCalendarDate', [
        'moment',
        amCalendarDateFilter
      ]);

  function amCalendarDateFilter(moment) {
    return function(dt) {
      const md = moment(dt);
      var key = '';

      if (!dt || !md || (md + '').toLowerCase() == 'invalid date') return '';

      const today = moment();
      const diff = today.diff(md, 'days');

      const days = 'Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado'.split('_');
      today.day(diff);
      const dayIndex = today.day();

      if (!diff) key = 'Hoje';
      else if (diff == -1) key = 'Amanhã';
      else if (diff == 1) key = 'Ontem';
      else if (Math.abs(diff) <= 6) {
        if (diff < 0) {
          if (dayIndex == 0 || dayIndex == 6) {
            // Sábado e domingo
            key = `Próximo ${days[dayIndex]}`;
          }
          else {
            key = `Próxima ${days[dayIndex]}`;
          }
        }
        else {
          if (dayIndex == 0 || dayIndex == 6) {
            // Sábado e domingo
            key = `Último ${days[dayIndex]}`;
          }
          else {
            key = `Última ${days[dayIndex]}`;
          }
        }
      }
      else {
        key = md.format(`[${days[dayIndex]}], D [de] MMM [de] YYYY`)
      }

      return key;
    }
  }
})();
