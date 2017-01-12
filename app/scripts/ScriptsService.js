/* v0.5.0 */
(function() {
  "use strict";
  angular.module('saferide-panel').service('ScriptsService', [
    '$q',
    'ErrorHandler',
    ScriptsService
  ]);

  function ScriptsService(
    $q,
    ErrorHandler
  ) {
    // jobExecuter = {
    //   title: 'Running...',
    //   message: 'Loading...',
    // };

    const scripts = {
      'migration_v0.5.0': migration('0.5.0'),
      'migration_v0.5.1': migration('0.5.1'),
      'clean_routes': cleanUpRoutes,
      'delete-routes-dev': migration('no-op'),
      'update-script-run-history_v0.5.0': updateScriptRunHistory_0_5_0,
      'update-script-run-history_v0.5.1': updateScriptRunHistory_0_5_1,
      'wait_2': wait(2),
    };

    return scripts;

    function wait(minutes) {
      minutes = minutes || 1;
      return (jobExecuter) => {
        const defer = $q.defer();
        jobExecuter.message = `Wait ${minutes} minutes...`;
        setTimeout(() => {
          jobExecuter.message = `Congrats! You waited for 5 minutes!`;
          defer.resolve('Done!');
        }, minutes * 60 * 1000);

        return defer.promise;
      };
    }

    function migration(version) {
      switch (version) {
        case '0.5.0':
          return m_0_5_0;
        case '0.5.1':
          return m_0_5_1;

        default:
          return (jobExecuter) => {
            return $q.when().then(() => { jobExecuter.message = 'No-op!'; });
          };
      }
    }

    function cleanUpRoutes(jobExecuter) {
      let updates = {};

      const tasks = $q.when()
        .then(() => {
          jobExecuter.message = 'Removing routes without user...';

          return firebase.database().ref('routes').once('value').then(snapshot => {
            if (!snapshot.val()) return;
            const data = snapshot.val();
            const keys = Object.keys(data);

            keys.forEach(key => {
              const route = data[key];
              if (!route.userId) {
                updates[`/routes/${key}`] = null;
                updates[`/collisions/${route.collisionId}`] = null;
              }
            });
          });
        })
        .then(() => {
          jobExecuter.message = 'Removing routes without user...';

          return firebase.database().ref('routes-dev').once('value').then(snapshot => {
            if (!snapshot.val()) return;
            const data = snapshot.val();
            const keys = Object.keys(data);

            keys.forEach(key => {
              const route = data[key];
              if (!route.userId) {
                updates[`/routes-dev/${key}`] = null;
                updates[`/collisions-dev/${route.collisionId}`] = null;
              }
            });
          });
        });

        return applyUpdates(jobExecuter, tasks, updates);
    }

    function updateScriptRunHistory_0_5_0(jobExecuter) {
      let updates = {};

      const tasks = $q.when()
        .then(() => {
          jobExecuter.message = 'Updating script run history...';

          return firebase.database().ref('scriptRunHistory').once('value').then(snapshot => {
            if (!snapshot.val()) return;
            const data = snapshot.val();
            const keys = Object.keys(data);

            for (let timestamp of keys) {
              if (isNaN(parseInt(timestamp))) continue;

              const runInfo = data[timestamp];
              const newRef = firebase.database().ref('scriptRunHistory').push();

              runInfo.id = newRef.key;
              runInfo.start = parseInt(timestamp);
              runInfo.end = parseInt(timestamp) + (2 * 60 * 1000); // Adds 2 minutes

              updates[`/scriptRunHistory/${timestamp}`] = null;
              updates[`/scriptRunHistory/${runInfo.id}`] = runInfo;
            }
          });
        });

        return applyUpdates(jobExecuter, tasks, updates);
    }

    function updateScriptRunHistory_0_5_1(jobExecuter) {
      let updates = {};

      const tasks = $q.when()
        .then(() => {
          jobExecuter.message = 'Updating script run history...';

          return firebase.database().ref('scriptRunHistory').once('value').then(snapshot => {
            if (!snapshot.val()) return;
            const data = snapshot.val();
            const keys = Object.keys(data);

            for (let key of keys) {
              const runInfo = data[key];

              if (runInfo.start) {
                updates[`/scriptRunHistory/${key}/start`] = null;
                updates[`/scriptRunHistory/${key}/startTimestamp`] = parseInt(runInfo.start);
              }
              if (runInfo.end) {
                updates[`/scriptRunHistory/${key}/end`] = null;
                updates[`/scriptRunHistory/${key}/endTimestamp`] = parseInt(runInfo.end);
              }
            }
          });
        });

        return applyUpdates(jobExecuter, tasks, updates);
    }

    function m_0_5_0(jobExecuter) {
      let updates = {};

      const tasks = $q.when()
        .then(() => {
          // Link users to routes
          jobExecuter.message = 'Linking user to routes...';
          return linkUserToRoutes('routes');
        })
        .then(() => {
          // Link users to routes - dev
          jobExecuter.message = 'Linking user to dev routes...';
          return linkUserToRoutes('routes-dev');
        })
        .then(() => {
          // Link users to collisions
          jobExecuter.message = 'Linking user to collisions...';
          return linkUserToCollisions('collisions');
        })
        .then(() => {
          // Link users to collisions - dev
          jobExecuter.message = 'Linking user to dev collisions...';
          return linkUserToCollisions('collisions-dev');
        })
        .then(() => {
          // Add timestamp as an attribute of RouteSnapshot
          jobExecuter.message = 'Adding timestamp to routes snapshots...';
          return addTimestampToRoute('routes');
        })
        .then(() => {
          // Add timestamp as an attribute of RouteSnapshot - dev
          jobExecuter.message = 'Adding timestamp to dev routes snapshots...';
          return addTimestampToRoute('routes-dev');
        });

        return applyUpdates(jobExecuter, tasks, updates);

        function linkUserToRoutes(path) {
          return linkUserTo(path);
        }

        function linkUserToCollisions(path) {
          return linkUserTo(path);
        }

        function addTimestampToRoute(path) {
          return firebase.database().ref(path).once('value').then(snapshot => {
            if (!snapshot.val()) return;
          	const data = snapshot.val();
          	const keys = Object.keys(data);

            for (let key of keys) {
              const route = data[key];
              if (!route.snapshots) continue;

          		const snapshotsTimestamps = Object.keys(route.snapshots);
              for (let timestamp of snapshotsTimestamps) {
                updates[`/${path}/${key}/snapshots/${timestamp}/timestamp`] = timestamp;
              }
          	}
          });
        }

        function linkUserTo(path) {
          return firebase.database().ref(path).once('value').then(snapshot => {
            if (!snapshot.val()) return;
          	const data = snapshot.val();
          	const keys = Object.keys(data);

            for (let key of keys) {
              updates[`/users/${data[key].userId}/${path}/${key}`] = key;
            }
          });
        }
    }

    function m_0_5_1(jobExecuter) {
      let updates = {};

      const tasks = $q.when()
        .then(() => {
          // Add start and end timestamp to route
          jobExecuter.message = 'Adding start and end timestamp to routes...';
          return addStartAndEndTimestamps('routes');
        })
        .then(() => {
          // Add start and end timestamp to route - dev
          jobExecuter.message = 'Adding start and end timestamp to dev routes...';
          return addStartAndEndTimestamps('routes-dev');
        });

        return applyUpdates(jobExecuter, tasks, updates);

        function addStartAndEndTimestamps(path) {
          return firebase.database().ref(path).once('value').then(snapshot => {
            if (!snapshot.val()) return;
          	const data = snapshot.val();
          	const keys = Object.keys(data);

            for (let key of keys) {
              const route = data[key];
              if (!route.snapshots) continue;

              const snapshotsTimestamps = Object.keys(route.snapshots);
              if (!route.startTimestamp) {
                updates[`/${path}/${key}/startTimestamp`] = snapshotsTimestamps[0];
              }
              if (!route.endTimestamp && route.running !== true) {
                updates[`/${path}/${key}/endTimestamp`] = snapshotsTimestamps[snapshotsTimestamps.length - 1];
              }
          	}
          });
        }
    }

    function applyUpdates(jobExecuter, promise, updates) {
      let count = Object.keys(updates).length;

      // Apply the updates
      return promise
        .then(() => {
          jobExecuter.message = `Applying ${count} changes...`;
          return firebase.database().ref().update(updates);
        })
        .then(() => { jobExecuter.message = `Done! Applied ${count} changes!`; })
        .catch(error => {
          jobExecuter.title = 'Failed!';
          jobExecuter.message = error ? error.message : 'See javascript console for more details.';
          ErrorHandler.treatError(error);
        });
    }
  }

})();
