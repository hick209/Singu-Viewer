(function() {
  "use strict";
  angular.module('singu-viewer')
      .controller('RequestsController', [
        '$q',
        'moment',
        'AuthService',
        'RequestsService',
        'ErrorHandler',
        RequestsController
      ]);

  function RequestsController(
    $q,
    moment,
    AuthService,
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
      loadRequests();
    }

    function loadRequests() {
      viewModel.loading = true;

      const token = AuthService.token;
      RequestsService.get(token)
          .then(response => {
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
      const days = {};
      for (const item of result) {
        const key = moment(item.date).startOf('day');
        const group = (days[key] || []);
        group.push(item);

        days[key] = group;
      }

      var sections = [];
      // TODO sort the array
      for (const key of Object.keys(days)) {
        const section = {
          date: key,
          items: parseItems(days[key]),
        };

        sections.push(section);
      }

      return sections;
    }

    function parseItems(items) {
      return [];
    }
  }
})();
