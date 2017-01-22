(function() {
  "use strict";
  angular.module('singu-viewer')
      .controller('AgendaController', [
        'AgendaService',
        'ApiService',
        AgendaController
      ]);

  function AgendaController(
    AgendaService,
    ApiService
  ) {
    const viewModel = this;

    AgendaService.configureAgenda(viewModel, ApiService.getAgenda);
    viewModel.agenda = true;

    init();

    function init() {
      viewModel.refresh();
    }
  }
})();
