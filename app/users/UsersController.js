(function() {
  "use strict";
  angular
    .module('saferide-panel')
    .controller('UsersController', [
      '$scope',
      '$location',
      '$mdDialog',
      'UserFactory',
      'RouteFactory',
      'RouteDevFactory',
      'CollisionFactory',
      'CollisionDevFactory',
      'DataTableService',
      'ErrorHandler',
      UsersController
    ]);

  function UsersController(
    $scope,
    $location,
    $mdDialog,
    UserFactory,
    RouteFactory,
    RouteDevFactory,
    CollisionFactory,
    CollisionDevFactory,
    DataTableService,
    ErrorHandler
  ) {
    const viewModel = this;

    DataTableService.setupDataTable(viewModel, UserFactory, parseData);
    // viewModel.data = [{
    //   id: 'me',
    //   name: 'Nivaldo Bondança',
    //   email: 'hick209@gmail.com',
    //   image: null,
    // }];

    init();

    function init() {
      viewModel.getData();

      const selectedUserId = $location.path().match(/[^/]+/g)[1];
      if (selectedUserId) {
        viewModel.user = {
          id: selectedUserId
        };

        UserFactory.get(selectedUserId)
          .then(user => {
            viewModel.user = {
              id: selectedUserId,
              name: user.name,
              email: user.email,
              image: user.photoUrl,
              gender: user.gender,
              contacts: user.contacts,
              medicalInfo: Object.keys(user.medicalInfo || {}).map(section => new Object({
                section: section,
                values: user.medicalInfo[section].split('|'),
              })),
              routes: Object.keys(user.routes || {}),
              collisions: Object.keys(user.collisions || {}),
              'routes-dev': Object.keys(user['routes-dev'] || {}),
              'collisions-dev': Object.keys(user['collisions-dev'] || {}),
            };

            const userSubpath = $location.path().match(/[^/]+/g)[2];
            if (userSubpath === 'routes' || userSubpath === 'routes-dev') {
              viewModel.userRoutes = UserRoutesController(viewModel.user, userSubpath === 'routes-dev');
            }
            else {
              viewModel.userRoutes = null;
            }
            if (userSubpath === 'collisions' || userSubpath === 'collisions-dev') {
              viewModel.userCollisions = UserCollisionsController(viewModel.user, userSubpath === 'collisions-dev');
            }
            else {
              viewModel.userCollisions = null;
            }

            if (viewModel.userRoutes === null && viewModel.userCollisions === null) {
              $location.path(`/users/${selectedUserId}`);
            }
          })
          .catch(error => {
            $location.path('/users');
            ErrorHandler.treatError(error);
          });
      }
      else {
        viewModel.user = null;
        viewModel.userRoutes = null;
        viewModel.userCollisions = null;

        $location.path('/users');
      }
    }

    function parseData(user, index) {
      const i = index;

      viewModel.data[i] = {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.photoUrl,
      };
    }


    function UserRoutesController(user, devMode) {
      const routesViewModel = {
        user: user,
        devMode: !!devMode,
      };

      const extension = routesViewModel.devMode ? '-dev' : '';
      routesViewModel.pathExtension = extension;

      DataTableService.setupDataTable(routesViewModel, devMode ? RouteDevFactory : RouteFactory, parseRouteData);
      routesViewModel.query.filter = route => route.userId == user.id;

      routesViewModel.delete = deleteRoutes;

      routesViewModel.getData();

      return routesViewModel;

      function parseRouteData(route, index) {
        const i = index;

        routesViewModel.data[i] = {
          id: route.id,
          user: user,
          collisionId: route.collisionId || null,
          snapshotCount: 0,
          duration: 0,
          start: route.startTimestamp,
          end: route.endTimestamp || null,
          running: route.running,
        };

        if (route.endTimestamp && route.startTimestamp) {
          routesViewModel.data[i].duration = route.duration = route.endTimestamp - route.startTimestamp;
        }

        if (route.snapshots) {
          const snapshotTimestamps = Object.keys(route.snapshots);

          // Snapshot count
          routesViewModel.data[i].snapshotCount = snapshotTimestamps.length;
        }
      }

      function deleteRoutes(event) {
        const confirm = $mdDialog.confirm()
            .title(`Would you like to delete the ${routesViewModel.selected.length} selected route(s) and linked collisions?`)
            .textContent(`This action can't be undone.`)
            .targetEvent(event)
            .ok('Delete')
            .cancel('Cancel');

        $mdDialog.show(confirm).then(() => {
          let updates = {};
          routesViewModel.selected.forEach((route) => {
            updates[`/routes${extension}/${route.id}`] = null;
            updates[`/users/${route.user.id}/routes${extension}/${route.id}`] = null;
            updates[`/collisions${extension}/${route.collisionId}`] = null;
            updates[`/users/${route.user.id}/collisions${extension}/${route.collisionId}`] = null;
          });

          routesViewModel.promise = firebase.database().ref()
            .update(updates)
            .then(() => {
              routesViewModel.selected = [];
              routesViewModel.getData();
            })
            .catch((error) => {
              ErrorHandler.treatError(error);
            });
        });
      }
    }


    function UserCollisionsController(user, devMode) {
      const collisionsViewModel = {
        user: user,
        devMode: !!devMode,
      };

      DataTableService.setupDataTable(collisionsViewModel, devMode ? CollisionDevFactory : CollisionFactory, parseCollisionData);
      collisionsViewModel.query.filter = collision => collision.userId == user.id;

      collisionsViewModel.delete = deleteCollisions;

      collisionsViewModel.getData();

      return collisionsViewModel;

      function parseCollisionData(collision, index) {
        const i = index;

        collisionsViewModel.data[i] = {
          id: collision.id,
          routeId: collision.routeId,
          user: user,
          latitude: collision.latitude,
          longitude: collision.longitude,
          status: collision.status,
          timestamp: collision.timestamp,
        };
      }

      function deleteCollisions(event) {
        const confirm = $mdDialog.confirm()
            .title(`Would you like to delete the ${collisionsViewModel.selected.length} selected collision(s)?`)
            .textContent(`This action can't be undone.`)
            .targetEvent(event)
            .ok('Delete')
            .cancel('Cancel');

        $mdDialog.show(confirm).then(() => {
          let updates = {};
          const extension = collisionsViewModel.devMode ? '-dev' : '';

          collisionsViewModel.selected.forEach((collision) => {
            updates[`/collisions${extension}/${collision.id}`] = null;
            updates[`/users/${collision.user.id}/collisions${extension}/${collision.id}`] = null;
          });

          collisionsViewModel.promise = firebase.database().ref()
            .update(updates)
            .then(() => {
              collisionsViewModel.selected = [];
              collisionsViewModel.getData();
            })
            .catch((error) => {
              ErrorHandler.treatError(error);
            });
        });
      }
    }
  }
})();
