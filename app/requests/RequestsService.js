(function() {
  "use strict";
  angular.module('singu-viewer')
    .service('RequestsService', [
      '$http',
      RequestsService
    ]);

  function RequestsService(
    $http
  ) {
    return {
      get: getRequests,
    };

    function getRequests(token) {
      return $http.get(`/api/requests?token=${token}`);
    }
  }
})();
