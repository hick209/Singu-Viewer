(function() {
  "use strict";
  angular.module('singu-viewer')
      .controller('RequestsController', [
        '$scope',
        'AgendaService',
        'ApiService',
        RequestsController
      ]);

  function RequestsController(
    $scope,
    AgendaService,
    ApiService
  ) {
    const viewModel = this;

    AgendaService.configureAgenda($scope, viewModel, ApiService.getRequests)
    viewModel.requests = true;

    init();

    function init() {
      viewModel.refresh();
    }
  }
})();
