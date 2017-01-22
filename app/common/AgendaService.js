(function() {
  "use strict";
  angular.module('singu-viewer')
      .service('AgendaService', [
        '$window',
        'moment',
        'AuthService',
        'ApiService',
        'ErrorHandler',
        AgendaService
      ]);

  function AgendaService(
    $window,
    moment,
    AuthService,
    ApiService,
    ErrorHandler
  ) {
    const service = this;

    service.configureAgenda = configureAgenda;

    return service;

    function configureAgenda(controller, apiCall) {
      controller.loading = false;
      controller.sections = [];
      controller.refresh = loadRequests;
      controller.openAddressOnGoogleMaps = openAddressOnGoogleMaps;
      controller.addToGoogleCalendar = addToGoogleCalendar;

      return controller;

      function loadRequests() {
        controller.loading = true;

        const token = AuthService.token;
        return apiCall(token)
            .then(response => {
              if (response.status == 200) {
                const result = response.data;
                controller.sections = parseSections(result);
              }
              else {
                ErrorHandler.treatError(response.statusText);
              }
              controller.loading = false;
            })
            .catch(error => {
              ErrorHandler.treatError(error);
              controller.loading = false;
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

      function addToGoogleCalendar(item) {
        const eventTitle = `${item.code} ${item.client.name} - ${item.service}`;
        const dates = `${formatDateToGoogleCalendate(item.date)}/${formatDateToGoogleCalendate(moment(item.date).add(2, 'hour'))}`;
        const location = `${item.address.place}`;
        var details;
        if (item.address.complement && item.address.reference) details = `Complemento: ${item.address.complement} --- Referência: ${item.address.reference}`;
        else if (item.address.complement) details = `Complemento: ${item.address.complement}`;
        else if (item.address.reference) details = `Referência: ${item.address.reference}`;
        else details = '';

        const link = `https://calendar.google.com/calendar/gp#~calendar:view=e&bm=1&action=TEMPLATE&text=${eventTitle}&dates=${dates}&details=${details}&location=${location}&sf=true&output=xml`
        $window.open(link);
      }

      function formatDateToGoogleCalendate(date) {
        return moment(date).toISOString().replace(/-|:|\.\d\d\d/g,'');
      }

      function openAddressOnGoogleMaps(item) {
        $window.open(`https://www.google.com/maps/?q=${item.address.place}`);
      }
    }
  }
})();
