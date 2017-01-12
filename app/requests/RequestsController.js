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

    viewModel.sections = [];

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

      const sections = [];
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

    function parseItems(data) {
      const items = [];
      for (const item of data) {
        console.log(item);

        items.push({
          service: item.services[0].name['pt-BR'],
          date: item.date,
          code: item.shortCode,
          address: {
            place: `${item.address.place}, ${item.address.streetNumber}`,
            reference: item.address.referencePoint,
            lat: item.lat,
            lng: item.lng,
          },
          client: {
            name: item.user.name,
            email: item.user.email,
            phone: item.user.phone,
          },
        });
      }

      return items;
    }
  }
})();