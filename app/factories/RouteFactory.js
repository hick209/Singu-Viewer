(function() {
  "use strict";
  angular.module('saferide-panel')
      .factory('RouteFactory', ['FirebaseDataService', RouteFactory]);

  function RouteFactory(FirebaseDataService) {
    let factory = this;
    return FirebaseDataService(factory, '/routes');
  }
})();
