(function() {
  "use strict";
  angular.module('saferide-panel')
      .service('FirebaseDataService', ['$q', FirebaseDataService]);

  function FirebaseDataService($q) {
    return setupFactory;

    function setupFactory(factory, path, parseItem) {
      parseItem = parseItem || ((item) => item);

      factory.data = [];
      let itemDict = {};

      let initiated = false;
      let loadingDefer = null;

      return {
        all: getData,
        get: getSingle,
      };

      function getData(query) {
        if (loadingDefer) {
          // Prevents double loading
          return loadingDefer.promise.then(() => {
            let defer = $q.defer();
            resolveToQuery(defer, query);
            return defer.promise;
          });
        }

        let defer = $q.defer();
        if (initiated) {
          resolveToQuery(defer, query);
        }
        else {
          loadingDefer = defer;
          firebase.database().ref(path).on('value', (snapshot) => {
            factory.data = [];
            itemDict = {};
            if (!snapshot.val()) {
              defer.reject(`No data`);
              return;
            }
            const firebaseData = snapshot.val();
            const ids = Object.keys(firebaseData);
            for (let i = 0; i < ids.length; i++) {
              const id = ids[i];
              const item = parseItem(firebaseData[id]);

              factory.data[i] = item;
              factory.data[i].id = id;
              itemDict[id] = item;
            }

            initiated = true;
            loadingDefer = null;

            resolveToQuery(defer, query);
          }, (error) => {
            defer.reject(error);
          });
        }

        return defer.promise;
      }

      function getSingle(id) {
        let defer = $q.defer();
        if (itemDict[id]) {
          defer.resolve(itemDict[id]);
        }
        else {
          firebase.database().ref(path).child(id).once('value', (snapshot) => {
            if (!snapshot.val()) {
              defer.reject(`No data`);
              return;
            }
            itemDict[id] = parseItem(snapshot.val());
            itemDict[id].id = id;

            defer.resolve(itemDict[id]);
          }, (error) => {
            defer.reject(error);
          });
        }

        return defer.promise;
      }

      function resolveToQuery(defer, query) {
        let result = {
          count: factory.data.length
        };
        if (query && query.limit) {
          const page = query.page || 1;
          const limit = query.limit;

          const filteredData = query.filter ? factory.data.filter(query.filter) : factory.data;

          result.data = filteredData.slice((page-1) * limit, page * limit);
          result.count = filteredData.length;
        }
        else {
          result.data = factory.data;
        }

        defer.resolve(result);
      }
    }
  }
})();
