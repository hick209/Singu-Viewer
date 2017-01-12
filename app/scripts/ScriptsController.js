(function() {
  "use strict";
  angular.module('saferide-panel').controller('ScriptsController', [
    '$mdDialog',
    '$mdToast',
    'UserFactory',
    'ScriptRunHistoryFactory',
    'ScriptsService',
    'DataTableService',
    ScriptsController
  ]);

  function ScriptsController(
    $mdDialog,
    $mdToast,
    UserFactory,
    ScriptRunHistoryFactory,
    ScriptsService,
    DataTableService
  ) {
    const viewModel = this;

    viewModel.scripts = [
      // {
      //   name: "Unique script name",
      //   description: "Script short description",
      //   script: "Script name",
      // },
    ];
    viewModel.run = runScript;

    DataTableService.setupDataTable(viewModel, ScriptRunHistoryFactory, parseData);
    viewModel.query.limit = 5;
    viewModel.query.limitOptions = [ 5, 10, 25 ];
    // viewModel.data = [
    //   {
    //     user: {
    //       id: "User id",
    //       name: "User name",
    //       image: "User image url",
    //     },
    //     script: {
    //       name: "Unique script name",
    //       description: "Script short description",
    //       script: "Script name",
    //     },
    //     success: true,
    //     timestamp: 123456789,
    //   },
    // ];

    init();

    function init() {
      viewModel.scripts = [
        {
          name: 'Tidy up Routes',
          description: 'Delete routes without a user',
          script: 'clean_routes',
          enabled: true,
        },
        {
          name: 'Migrate to v0.5.0',
          description: 'Adds links in the user to his routes and collisions and adds timestamp as a property (not only key) to the route snapshots',
          script: 'migration_v0.5.0',
          enabled: false,
        },
        {
          name: 'Migrate to v0.5.1',
          description: 'Adds start and end timestamp to routes',
          script: 'migration_v0.5.1',
          enabled: false,
        },
        {
          name: 'Update script run history to v0.5.0',
          description: 'Add id, start and end timestamps',
          script: 'update-script-run-history_v0.5.0',
          enabled: false,
        },
        {
          name: 'Update script run history to v0.5.1',
          description: 'Add duration and change label for start and end timestamps',
          script: 'update-script-run-history_v0.5.1',
          enabled: false,
        },
        {
          name: 'Just wait',
          description: 'Dummy 2 min wait',
          script: 'wait_2',
          enabled: true,
        },
      ];

      viewModel.getData();
    }

    function parseData(runInfo, index) {
      const i = index;

      viewModel.data[i] = {
        user: {
          id: runInfo.userId,
          name: 'loading...',
          image: 'loading...'
        },
        script: viewModel.scripts.find(it => it.script === runInfo.script),
        success: runInfo.success,
        duration: runInfo.endTimestamp - runInfo.startTimestamp,
        start: runInfo.startTimestamp,
        end: runInfo.endTimestamp,
      };

      UserFactory.get(runInfo.userId).then((result) => {
        const user = result;

        if (viewModel.data[i] && viewModel.data[i].user.id === user.id) {
          viewModel.data[i].user.name = user.name;
          viewModel.data[i].user.image = user.photoUrl;
        }
      });
    }

    function runScript($event, script) {
      const prompt = $mdDialog.prompt()
          .title(script.name)
          .textContent(script.description)
          .placeholder(`Enter '${script.name}' to run`)
          .targetEvent(event)
          .ariaLabel(script.description)
          .clickOutsideToClose(true)
          .cancel('Cancel')
          .ok('Run');

      $mdDialog.show(prompt).then(result => {
        if (result === script.name) {
          doRunScript(script);
        }
        else {
          $mdToast.show($mdToast.simple()
            .textContent('Enter the script name to run it')
            .capsule(true)
            .position('bottom center'));
        }
      });
    }

    function doRunScript(script) {
      $mdDialog.show({
        controller: ScriptRunDialogController,
        templateUrl: 'app/scripts/script-running.html',
        parent: angular.element(document.body),
        clickOutsideToClose: false,
        locals: {
          script: script,
        },
      });

      function ScriptRunDialogController($scope, $mdDialog, script) {
        $scope.script = script;

        $scope.title = `Running ${script.name}`;
        $scope.message = 'Loading...';

        $scope.done = false;
        $scope.closeDialog = $mdDialog.hide;
        const startTimestamp = Date.now();

        const done = (success) => {
          const endTimestamp = Date.now();
          const runInfoRef = firebase.database().ref(`scriptRunHistory`).push();
          runInfoRef.set({
            id: runInfoRef.key,
            userId: firebase.auth().currentUser.uid,
            script: script.script,
            success: success,
            startTimestamp: startTimestamp,
            endTimestamp: endTimestamp,
          });

          $scope.done = true;
        };

        ScriptsService[script.script]($scope)
          .then(() => done(true))
          .catch(() => done(false));
      }
    }
  }
})();
