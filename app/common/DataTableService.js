(function() {
  "use strict";
  angular.module('saferide-panel')
      .service('DataTableService', ['ErrorHandler', DataTableService]);

  function DataTableService(ErrorHandler) {
    const service = this;

    service.setupDataTable = extendController;

    function extendController(viewModel, factory, parseAndSetData) {
      viewModel.data = [];
      viewModel.total = 0;
      viewModel.selected = [];
      viewModel.query = {
        page: 1,
        limit: 10,
        limitOptions: [ 10, 25, 50, 100 ],
        filter: null,
      };
      viewModel.getData = () => {
        viewModel.promise = factory.all(viewModel.query).then((result) => {
          viewModel.data = [];
          viewModel.total = result.count;

          for (let i = 0; i < result.data.length; i++) {
            parseAndSetData(result.data[i], i);
          }
        })
        .catch((error) => {
          ErrorHandler.treatError(error);
        });
      };
    }
  }
})();
