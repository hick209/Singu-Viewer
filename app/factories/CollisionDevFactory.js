(function() {
  "use strict";
  angular.module('saferide-panel')
      .factory('CollisionDevFactory', ['FirebaseDataService', CollisionDevFactory]);

  function CollisionDevFactory(FirebaseDataService) {
    let factory = this;
    return FirebaseDataService(factory, '/collisions-dev');
  }
})();
