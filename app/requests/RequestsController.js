(function() {
  "use strict";
  angular.module('singu-viewer')
      .controller('RequestsController', [
        '$scope',
        '$rootScope',
        '$mdDialog',
        '$mdToast',
        'AgendaService',
        'ApiService',
        'AuthService',
        'ErrorHandler',
        RequestsController
      ]);

  function RequestsController(
    $scope,
    $rootScope,
    $mdDialog,
    $mdToast,
    AgendaService,
    ApiService,
    AuthService,
    ErrorHandler
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
      if (!item || !item.id || !AuthService.isSignedIn()) return;

      const confirm = $mdDialog.confirm()
          .title(`Aceitar o pedido ${item.code}?`)
          .textContent(`${item.client.name} - ${item.service} às ${moment(item.date).format('H:mm')}`)
          .targetEvent(event)
          .ok('Aceitar')
          .cancel('Cancelar');

      $mdDialog.show(confirm)
        .then(() => {
          if (!item || !item.id || !AuthService.isSignedIn()) return;

          $rootScope.$broadcast('loading', true);
          return ApiService.putAgenda(AuthService.token, item.id);
        })
        .then(() => {
          $rootScope.$broadcast('loading', false);
        })
        .then(viewModel.refresh)
        .catch(error => {
          ErrorHandler.treatError(error);
          $rootScope.$broadcast('loading', false);
        });
    }
  }
})();
