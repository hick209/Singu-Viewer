(function() {
  "use strict";
  angular.module('singu-viewer')
      .controller('AgendaHistoryController', [
        '$scope',
        'AgendaService',
        'ApiService',
        AgendaHistoryController
      ]);

  function AgendaHistoryController(
    $scope,
    AgendaService,
    ApiService
  ) {
    const viewModel = this;

    AgendaService.configureAgenda($scope, viewModel, ApiService.getHistory);
    viewModel.agenda = true;

    init();

    function init() {
      viewModel.refresh();
    }
  }
})();
