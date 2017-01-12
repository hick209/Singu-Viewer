(function() {
  "use strict";
  angular.module('saferide-panel')
      .controller('DevsController', [
        '$scope',
        '$mdDialog',
        'DevFactory',
        'UserFactory',
        'DataTableService',
        'ErrorHandler',
        DevsController
      ]);

  function DevsController(
    $scope,
    $mdDialog,
    DevFactory,
    UserFactory,
    DataTableService,
    ErrorHandler
  ) {
    const viewModel = this;

    DataTableService.setupDataTable(viewModel, DevFactory, parseData);
    // viewModel.data = [{
    //   uid: 'loading...',
    //   user: {
    //     id: 'loading...',
    //     name: 'loading...',
    //     email: 'loading...',
    //     image: 'loaging...'
    //   }
    // }];
    viewModel.delete = deleteDevs;

    init();

    function init() {
      viewModel.getData();
    }

    function parseData(dev, index) {
      const i = index;

      viewModel.data[i] = {
        uid: dev.id,
        user: {
          id: dev.id,
          name: 'loading...',
          email: 'loading...',
          image: null,
        },
      };

      UserFactory.get(dev.id).then((result) => {
        const user = result;

        if (viewModel.data[i] && viewModel.data[i].user.id === user.id) {
          viewModel.data[i].user.name = user.name;
          viewModel.data[i].user.email = user.email;
          viewModel.data[i].user.image = user.photoUrl;
        }
      });
    }

    function deleteDevs(event) {
      const devList = viewModel.selected.map((dev) => dev.name).join(', ');
      const confirm = $mdDialog.confirm()
          .title(`Would you like remove Dev privileges from those users? You can always add them again later.`)
          .textContent(devList)
          .targetEvent(event)
          .ok('Remove')
          .cancel('Cancel');

      $mdDialog.show(confirm).then(() => {
        let updates = {};
        viewModel.selected.forEach((dev) => {
          updates[`/dev/${dev.uid}`] = null;
        });

        viewModel.promise = firebase.database().ref()
          .update(updates)
          .then(() => {
            viewModel.selected = [];
            viewModel.getData();
          })
          .catch((error) => {
            ErrorHandler.treatError(error);
          });
      });
    }
  }
})();
