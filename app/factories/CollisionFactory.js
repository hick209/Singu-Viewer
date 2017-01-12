(function() {
  "use strict";
  angular.module('saferide-panel')
      .factory('CollisionFactory', ['FirebaseDataService', CollisionFactory]);

  function CollisionFactory(FirebaseDataService) {
    let factory = this;
    return FirebaseDataService(factory, '/collisions');
  }
})();
