(function() {
  "use strict";
  angular.module('saferide-panel')
      .factory('DevFactory', ['FirebaseDataService', DevFactory]);

  function DevFactory(FirebaseDataService) {
    let factory = this;
    return FirebaseDataService(factory, '/dev', (item) => { return {}; });
  }
})();
