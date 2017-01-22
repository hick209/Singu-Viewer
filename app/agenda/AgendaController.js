(function() {
  "use strict";
  angular.module('singu-viewer')
      .controller('AgendaController', [
        '$scope',
        'AgendaService',
        'ApiService',
        AgendaController
      ]);

  function AgendaController(
    $scope,
    AgendaService,
    ApiService
  ) {
    const viewModel = this;

    AgendaService.configureAgenda($scope, viewModel, ApiService.getAgenda);
    viewModel.agenda = true;

    init();

    function init() {
      viewModel.refresh();
    }
  }
})();
