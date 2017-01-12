(function() {
  "use strict";
  angular.module('singu-viewer').controller('RequestsController', [
    '$q',
    'RequestsService',
    'ErrorHandler',
    RequestsController
  ]);

  function RequestsController(
    $q,
    RequestsService,
    ErrorHandler
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
      const token = 'invalid-token';
      loadRequests(token);
    }

    function loadRequests(token) {
      viewModel.loading = true;
      RequestsService.get(token)
          .then(result => {
            if (response.status == 200) {
              const result = response.data;
              viewModel.sections = parseSections(result);
            }
            else {
              ErrorHandler.treatError(response.statusText);
            }
            viewModel.loading = false;
          })
          .catch(error => {
            ErrorHandler.treatError(error);
            viewModel.loading = false;
          });
    }

    function parseSections(result) {
      var sections = []; // TODO

      return sections;
    }
  }
})();
