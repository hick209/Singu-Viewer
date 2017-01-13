(function() {
  "use strict";
  angular.module('singu-viewer')
      .controller('AgendaController', [
        '$q',
        '$window',
        'moment',
        'AuthService',
        'ApiService',
        'ErrorHandler',
        AgendaController
      ]);

  function AgendaController(
    $q,
    $window,
    moment,
    AuthService,
    ApiService,
    ErrorHandler
  ) {
    const viewModel = this;

    viewModel.loading = false;
    viewModel.loadingMessage = '';

    viewModel.sections = [];
    viewModel.refresh = loadRequests;
    viewModel.agenda = true;
    viewModel.openAddressOnGoogleMaps = openAddressOnGoogleMaps;
    viewModel.addToGoogleCalendar = addToGoogleCalendar;

    init();

    function init() {
      loadRequests();
    }

    function addToGoogleCalendar(item) {
      const eventTitle = `${item.code} ${item.client.name} - ${item.service}`;
      const dates = `${formatDateToGoogleCalendate(item.date)}/${formatDateToGoogleCalendate(moment(item.date).add(2, 'hour'))}`;
      const location = `${item.address.place}`;
      var details;
      if (item.address.complement && item.address.reference) details = `Complemento: ${item.address.complement} --- Referência: ${item.address.reference}`;
      else if (item.address.complement) details = `Complemento: ${item.address.complement}`;
      else if (item.address.reference) details = `Referência: ${item.address.reference}`;
      else details = '';

      const link = `https://www.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${dates}&details=${details}&location=${location}&sf=true&output=xml`
      $window.open(link);
    }

    function formatDateToGoogleCalendate(date) {
      return moment(date).zone('-00:00').format('YYYYMMDD[T]HHmm00[Z]')
    }

    function openAddressOnGoogleMaps(item) {
      $window.open(`https://www.google.com/maps/?q=${item.address.place}`);
    }

    function loadRequests() {
      viewModel.loading = true;

      const token = AuthService.token;
      ApiService.getAgenda(token)
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
        items.push({
          service: item.services[0].name['pt-BR'],
          date: item.date,
          code: item.shortCode,
          address: {
            place: `${item.address.place}, ${item.address.streetNumber}, ${item.address.neighbor}`,
            reference: item.address.referencePoint,
            complement: item.address.complement,
            lat: item.address.lat,
            lng: item.address.lng,
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
