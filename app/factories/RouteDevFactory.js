(function() {
  "use strict";
  angular.module('saferide-panel')
      .factory('RouteDevFactory', ['FirebaseDataService', RouteDevFactory]);

  function RouteDevFactory(FirebaseDataService) {
    let factory = this;
    return FirebaseDataService(factory, '/routes-dev');
  }
})();
