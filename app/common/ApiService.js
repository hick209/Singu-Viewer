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
      putAgenda: putAgenda,
      getAgenda: getAgenda,
      getHistory: getHistory,
      getRequests: getRequests,
    };

    function putAgenda(token, itemId) {
      return $http.put(`/api/agenda?token=${token}&id=${itemId}`);
    }

    function getAgenda(token) {
      return $http.get(`/api/agenda?token=${token}`);
    }

    function getHistory(token) {
      return $http.get(`/api/history?token=${token}`);
    }

    function getRequests(token) {
      return $http.get(`/api/requests?token=${token}`);
    }
  }
})();
