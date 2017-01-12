(function() {
  "use strict";
  angular.module('saferide-panel').controller('MainController', [
    '$q',
    'UserFactory',
    'DevFactory',
    'RouteFactory',
    'CollisionFactory',
    MainController
  ]);

  function MainController(
    $q,
    UserFactory,
    DevFactory,
    RouteFactory,
    CollisionFactory
  ) {
    const viewModel = this;

    viewModel.loading = false;
    viewModel.loadingMessage = '';

    init();

    function init() {
      // Preload some data
      viewModel.loading = true;
      $q.when()
          .then(loadUsers)
          .then(loadRoutes)
          .then(loadCollisions)
          .then(loadDevs)
          .then(() => {
            viewModel.loading = false;
          });
    }

    function loadUsers() {
      viewModel.loadingMessage += 'Loading users...     ';
      return UserFactory.all().then((result) => viewModel.loadingMessage += ` ${result.count} users\n`);
    }

    function loadDevs() {
      viewModel.loadingMessage += 'Loading devs...      ';
      return DevFactory.all().then((result) => viewModel.loadingMessage += ` ${result.count} devs\n`);
    }

    function loadRoutes() {
      viewModel.loadingMessage += 'Loading routes...    ';
      return RouteFactory.all().then((result) => viewModel.loadingMessage += ` ${result.count} routes\n`);
    }

    function loadCollisions() {
      viewModel.loadingMessage += 'Loading collisions...';
      return CollisionFactory.all().then((result) => viewModel.loadingMessage += ` ${result.count} collisions\n`);
    }
  }
})();
