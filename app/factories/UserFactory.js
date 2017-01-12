(function() {
  "use strict";
  angular.module('saferide-panel')
      .factory('UserFactory', ['FirebaseDataService', UserFactory]);

  function UserFactory(FirebaseDataService) {
    let factory = this;
    return FirebaseDataService(factory, '/users');
  }
})();
