(function() {
  "use strict";
  angular.module('saferide-panel')
      .controller('RoutesController', [
        '$scope',
        '$location',
        '$mdDialog',
        'NgMap',
        'UserFactory',
        'RouteFactory',
        'RouteDevFactory',
        'DataTableService',
        'ErrorHandler',
        RoutesController
      ]);

  function RoutesController(
    $scope,
    $location,
    $mdDialog,
    NgMap,
    UserFactory,
    RouteFactory,
    RouteDevFactory,
    DataTableService,
    ErrorHandler
  ) {
    const viewModel = this;
    viewModel.devMode = $location.path().match(/[^/]+/g)[0] === 'routes-dev';

    const extension = viewModel.devMode ? '-dev' : '';
    viewModel.pathExtension = extension;

    DataTableService.setupDataTable(viewModel, viewModel.devMode ? RouteDevFactory : RouteFactory, parseData);
    // viewModel.data = [{
    //   id: 'loading...',
    //   user: {
    //     id: 'loading...',
    //     name: 'loading...',
    //     email: 'loading...',
    //     image: 'loaging...'
    //   },
    //   collisionId: "loading...",
    //   snapshotCount: 0,
    //   duration: 0,
    //   start: 0,
    //   end: null,
    //   running: false,
    // }];
    viewModel.delete = deleteRoutes;

    viewModel.initMap = initMap;
    viewModel.showSnapshotInfo = showSnapshotInfo;

    // For Google Maps
    $scope.googleMapsUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDDcZ9qkwiWVGaDynl19TY_RzpActNxUG4';

    init();

    function init() {
      viewModel.getData();

      const selectedRouteId = $location.path().match(/[^/]+/g)[1];
      if (selectedRouteId) {
        viewModel.route = {
          id: selectedRouteId
        };

        const factory = viewModel.devMode ? RouteDevFactory : RouteFactory;
        factory.get(selectedRouteId)
          .then(route => {
            const snapshotKeys = Object.keys(route.snapshots || {});
            let snapshots = [];

            for (let key of snapshotKeys) {
              const snapshot = route.snapshots[key];
              snapshots.push({
                latitude: snapshot.latitude,
                longitude: snapshot.longitude,
                acceleration: {
                  x: snapshot.accelerationX,
                  y: snapshot.accelerationY,
                  z: snapshot.accelerationZ,
                },
                velocity: {
                  x: snapshot.velocityX,
                  y: snapshot.velocityY,
                  z: snapshot.velocityZ,
                },
                speed: snapshot.speed,
                timestamp: snapshot.timestamp,
              });
            }

            viewModel.route = {
              id: selectedRouteId,
              user: {
                id: route.userId,
                // name: user.name,
                // email: user.email,
                // image: user.photoUrl,
              },
              collisionId: route.collisionId,
              snapshots: snapshots,
              start: route.startTimestamp,
              end: route.endTimestamp || null,
              running: route.running,
            };

            UserFactory.get(viewModel.route.user.id).then(user => {
              if (viewModel.route && viewModel.route.user.id === user.id) {
                viewModel.route.user.name = user.name;
                viewModel.route.user.email = user.email;
                viewModel.route.user.image = user.photoUrl;
              }
            })
            .catch(error => {
              ErrorHandler.treatError(error);
            });
          })
          .catch(error => {
            $location.path(`/routes${extension}`);
            ErrorHandler.treatError(error);
          });
      }
      else {
        viewModel.route = null;

        $location.path(`/routes${extension}`);
      }
    }

    function parseData(route, index) {
      const i = index;

      viewModel.data[i] = {
        id: route.id,
        user: {
          id: route.userId,
          name: 'loading...',
          email: 'loading...',
          image: 'loading...'
        },
        collisionId: route.collisionId || null,
        snapshotCount: 0,
        duration: 0,
        start: route.startTimestamp,
        end: route.endTimestamp || null,
        running: route.running,
      };

      if (route.endTimestamp && route.startTimestamp) {
        viewModel.data[i].duration = route.duration = route.endTimestamp - route.startTimestamp;
      }

      if (route.snapshots) {
        const snapshotTimestamps = Object.keys(route.snapshots);

        // Snapshot count
        viewModel.data[i].snapshotCount = snapshotTimestamps.length;
      }

      UserFactory.get(route.userId).then((result) => {
        const user = result;

        if (viewModel.data[i] && viewModel.data[i].user.id === user.id) {
          viewModel.data[i].user.name = user.name;
          viewModel.data[i].user.email = user.email;
          viewModel.data[i].user.image = user.photoUrl;
        }
      });
    }

    function deleteRoutes(event) {
      const confirm = $mdDialog.confirm()
          .title(`Would you like to delete the ${viewModel.selected.length} selected route(s) and linked collisions?`)
          .textContent(`This action can't be undone.`)
          .targetEvent(event)
          .ok('Delete')
          .cancel('Cancel');

      $mdDialog.show(confirm).then(() => {
        let updates = {};
        viewModel.selected.forEach((route) => {
          updates[`/routes${extension}/${route.id}`] = null;
          updates[`/users/${route.user.id}/routes${extension}/${route.id}`] = null;
          updates[`/collisions${extension}/${route.collisionId}`] = null;
          updates[`/users/${route.user.id}/collisions${extension}/${route.collisionId}`] = null;
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

    function initMap() {
      NgMap.getMap().then(map => {
        viewModel.route.map = map;
      })
      .catch(error => ErrorHandler.treatError(error));
    }

    function showSnapshotInfo(event, snapshot) {
      if (!viewModel.route ||
          !viewModel.route.map ||
          !snapshot) return;

      viewModel.route.snapshot = snapshot;
      viewModel.route.map.showInfoWindow('snapshotInfo', `snapshot-${snapshot.timestamp}`);
    }
  }
})();
