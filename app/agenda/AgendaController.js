(function() {
  "use strict";
  angular.module('singu-viewer').controller('AgendaController', [
    '$q',
    AgendaController
  ]);

  function AgendaController(
    $q
  ) {
    const viewModel = this;

    viewModel.loading = false;
    viewModel.loadingMessage = '';

    viewModel.sections = [
      {
        date: new Date(),
        items: [
          {
            name: "item 1",
          },
          {
            name: "item 2",
          },
        ]
      },
    ];

    init();

    function init() {
      // Preload some data
      viewModel.loading = true;
      $q.when()
          // .then(loadUsers)
          // .then(loadRoutes)
          // .then(loadCollisions)
          // .then(loadDevs)
          .then(() => {
            viewModel.loading = false;
          });
    }

    function loadUsers() {
      return UserFactory.all().then((result) => viewModel.loadingMessage += ` ${result.count} users\n`);
    }

    function loadDevs() {
      return DevFactory.all().then((result) => viewModel.loadingMessage += ` ${result.count} devs\n`);
    }

    function loadRoutes() {
      return RouteFactory.all().then((result) => viewModel.loadingMessage += ` ${result.count} routes\n`);
    }

    function loadCollisions() {
      return CollisionFactory.all().then((result) => viewModel.loadingMessage += ` ${result.count} collisions\n`);
    }
  }
})();
