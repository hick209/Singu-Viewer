(function() {
  "use strict";
  angular.module('singu-viewer')
      .controller('RequestsController', [
        '$scope',
        '$mdDialog',
        '$mdToast',
        'AgendaService',
        'ApiService',
        RequestsController
      ]);

  function RequestsController(
    $scope,
    $mdDialog,
    $mdToast,
    AgendaService,
    ApiService
  ) {
    const viewModel = this;

    AgendaService.configureAgenda($scope, viewModel, ApiService.getRequests)
    viewModel.requests = true;
    viewModel.acceptRequest = acceptRequest;

    init();

    function init() {
      viewModel.refresh();
    }

    function acceptRequest(event, item) {
      if (!item) return;

      const confirm = $mdDialog.confirm()
          .title(`Aceitar o pedido ${item.code}?`)
          .textContent(`${item.client.name} - ${item.service} às ${moment(item.date).format('H:mm')}`)
          .targetEvent(event)
          .ok('Aceitar')
          .cancel('Cancelar');

      $mdDialog.show(confirm).then(() => {
        $mdToast.show($mdToast.simple().textContent('Em breve!'));
      })
    }
  }
})();
