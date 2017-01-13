(function() {
  "use strict";
  angular.module('singu-viewer')
    .service('ApiService', [
      '$http',
      ApiService
    ]);

  function ApiService(
    $http
  ) {
    return {
      getAgenda: getAgenda,
      getRequests: getRequests,
    };

    function getAgenda(token) {
      return $http.get(`/api/agenda?token=${token}`);
    }

    function getRequests(token) {
      return $http.get(`/api/requests?token=${token}`);
    }
  }
})();
