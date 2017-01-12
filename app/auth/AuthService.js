(function() {
  "use strict";
  angular.module('singu-viewer')
      .service('AuthService', [
        '$http',
        'ErrorHandler',
        AuthService
      ]);

  function AuthService($http, ErrorHandler) {
    return setup;

    function setup(scope, refreshAction) {
      scope.auth = {
        user: {
          _id: null,
          name: 'Singu Viewer',
          email: null,
          token: null
        },
        working: false,
        signedIn: false,
        login: login,
        logout: logout,
      };

      function login(email, password) {
        const loginPostUrl = '/api/login';
        const payload = { 'email': email, 'password': password };

        scope.auth.working = true;
        $http.post(loginPostUrl, payload)
            .then((response) => {
              if (response.status == 200) {
                const result = response.data;
                scope.auth.user = result.user;
                scope.auth.token = result.token;

                scope.auth.signedIn = true;
              }
              else {
                ErrorHandler.treatError(response.statusText);
              }

              scope.auth.working = false;
              refreshAction();
            })
            .catch((error) => {
              ErrorHandler.treatError(error);
              scope.auth.working = false;
            });

        // const response = {
        //   "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ODZmZDUzYmQ0ZmUzMDY4NjM4NmQzODkiLCJlbWFpbCI6InJvc3RlZmFubnlAZ21haWwuY29tIiwiaWF0IjoxNDg0MTgyOTY5LCJleHAiOjE1MzYwMjI5NjksImF1ZCI6ImFydGlzdHMifQ.2Pgk2f8-FHI6bjFwvHzyqUKcyAH2CiMSjSQv0Ou-CwM",
        //   "user":{
        //     "_id":"586fd53bd4fe30686386d389",
        //     "email":"rostefanny@gmail.com",
        //     "name":"Roberta Oliveira",
        //     "phone":{
        //       "countryCode":"+55",
        //       "areaCode":"11",
        //       "number":"958684387"
        //     },
        //     "address":{
        //       "place":"Rua José Getúlio",
        //       "streetNumber":"195",
        //       "complement":"64",
        //       "neighbor":"958684387",
        //       "city":"São Paulo",
        //       "uf":"SP",
        //       "zipCode":"01509001"
        //     },
        //     "cpf":{
        //       "documentNumber":"38774199846"
        //     },
        //     "rg":{
        //       "documentNumber":"466229100"
        //     },
        //     "birthdate":"1990-04-21T00:00:00.000Z",
        //     "gender":"F",
        //     "activated":true,
        //     "active":true,
        //     "enabledCities":[
        //       "56b106cb2a3c15e79c87bf4e"
        //     ],
        //     "enabledServices":[
        //       "c100s1001",
        //       "c100s1000"
        //     ],
        //     "leadId":"5863dda536cf3af478f9aa28",
        //     "createdDate":"2017-01-06T17:34:51.314Z",
        //     "lastLogin":"2017-01-11T19:55:45.079Z",
        //     "moipCredentials":{
        //       "moipAccountId":"MPA-4W4HPKGB2RQF",
        //       "scope":"create_orders|view_orders|create_payments|view_payments",
        //       "access_token":"apaloh8f921eerzt1f6j3czda2ssi90",
        //       "accessToken":"apaloh8f921eerzt1f6j3czda2ssi90"
        //     }
        //   }
        // }
      }

      function logout() {
        // TODO
        // workingPromise(firebase.auth().signOut());

        scope.auth.signedIn = false;
      }

      function workingPromise(promise) {
        scope.auth.working = true;
        promise.then((result) => {
          scope.auth.working = false;
        }).catch((error) => {
          ErrorHandler.treatError(error);
          scope.auth.working = false;
        });
      }
    }
  }
})();
