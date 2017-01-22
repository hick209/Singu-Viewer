(function() {
  "use strict";
  angular.module('singu-viewer')
      .controller('RequestsController', [
        'AgendaService',
        'ApiService',
        RequestsController
      ]);

  function RequestsController(
    AgendaService,
    ApiService
  ) {
    const viewModel = this;

    AgendaService.configureAgenda(viewModel, ApiService.getRequests)

    init();

    function init() {
      viewModel.refresh();
    }
  }
})();
