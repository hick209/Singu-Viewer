(function() {
  "use strict";
  angular.module('singu-viewer')
      .service('ErrorHandler', ['$mdToast', ErrorHandler]);

  function ErrorHandler($mdToast) {
    const handler = this;

    handler.treatError = treatError;

    function treatError(error) {
      if (!error) {
        error = new Error();
        error.message = 'Invalid error!';
      }

      // Show toast
      let message;
      if (error.statusText) {
        message = error.statusText;
        console.debug(message);
      } else {
        message = error;
      }

      console.error(error);

      const toast = $mdToast.simple()
          .textContent(message)
          .hideDelay(10000)
          .position('bottom right')
          .action('OK')
          .highlightAction(true);

      $mdToast.show(toast);
    }
  }
})();
