(function() {
  "use strict";
  angular.module('saferide-panel')
      .factory('ScriptRunHistoryFactory', ['FirebaseDataService', ScriptRunHistoryFactory]);

  function ScriptRunHistoryFactory(FirebaseDataService) {
    let factory = this;
    return FirebaseDataService(factory, '/scriptRunHistory');
  }
})();
