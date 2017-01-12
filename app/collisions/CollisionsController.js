(function() {
  "use strict";
  angular.module('saferide-panel')
      .controller('CollisionsController', [
        '$scope',
        '$location',
        '$mdDialog',
        'UserFactory',
        'CollisionFactory',
        'CollisionDevFactory',
        'DataTableService',
        'ErrorHandler',
        CollisionsController
      ]);

  function CollisionsController(
    $scope,
    $location,
    $mdDialog,
    UserFactory,
    CollisionFactory,
    CollisionDevFactory,
    DataTableService,
    ErrorHandler
  ) {
    const viewModel = this;
    viewModel.devMode = $location.path().match(/[^/]+/g)[0] === 'collisions-dev';

    DataTableService.setupDataTable(viewModel, viewModel.devMode ? CollisionDevFactory : CollisionFactory, parseData);
    // viewModel.data = [{
    //   id: 'loading...',
    //   routeId: 'loading...',
    //   user: {
    //     id: 'loading...',
    //     name: 'loading...',
    //     email: 'loading...',
    //     image: 'loaging...'
    //   },
    //   latitude: 0.000000,
    //   longitude: 0.000000,
    //   status: 'Pending',
    //   timestamp: false
    // }];
    viewModel.delete = deleteCollisions;

    init();

    function init() {
      viewModel.getData();
    }

    function parseData(collision, index) {
      const i = index;

      viewModel.data[i] = {
        id: collision.id,
        routeId: collision.routeId,
        user: {
          id: collision.userId,
          name: 'loading...',
          email: 'loading...',
          image: null,
        },
        latitude: collision.latitude,
        longitude: collision.longitude,
        status: collision.status,
        timestamp: collision.timestamp,
      };

      UserFactory.get(collision.userId).then((result) => {
        const user = result;

        if (viewModel.data[i] && viewModel.data[i].user.id === user.id) {
          viewModel.data[i].user.name = user.name;
          viewModel.data[i].user.email = user.email;
          viewModel.data[i].user.image = user.photoUrl;
        }
      });
    }

    function deleteCollisions(event) {
      const confirm = $mdDialog.confirm()
          .title(`Would you like to delete the ${viewModel.selected.length} selected collision(s)?`)
          .textContent(`This action can't be undone.`)
          .targetEvent(event)
          .ok('Delete')
          .cancel('Cancel');

      $mdDialog.show(confirm).then(() => {
        let updates = {};
        const extension = viewModel.devMode ? '-dev' : '';

        viewModel.selected.forEach((collision) => {
          updates[`/collisions${extension}/${collision.id}`] = null;
          updates[`/users/${collision.user.id}/collisions${extension}/${collision.id}`] = null;
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
