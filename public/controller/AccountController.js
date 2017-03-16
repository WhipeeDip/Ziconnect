/**
 * File name: AccountController.js
 * Authors: Elliot Yoon
 * Description: Controller for accounts.
 */

angular.module('controllers')
  .controller('AccountController', ['AccountServices', '$rootScope', '$scope', '$cookies', '$window', '$location', '$q', '$firebaseAuth', 
    function(AccountServices, $rootScope, $scope, $cookies, $window, $location, $q, $firebaseAuth) {

      // if auth state changes, check login status
      // NOTE: this is triggered everytime it loads 
      $firebaseAuth().$onAuthStateChanged(function(firebaseUser) {
        console.log('$onAuthStateChanged() triggered!', firebaseUser);
        console.log('Current Path:', $location.path());
        if(firebaseUser) { // someone logged in or is already logged in
          var user = AccountServices.buildUserObjectFromFirebase(firebaseUser);
          $rootScope.user = user;
          if($location.path() == '/login') {            
            AccountServices.loginWithUser(user).then(function() { // promise resolved
              $cookies.putObject('user', user);
              $window.location.href = '/home';
            }, function(reason) { // promise rejected
              console.log('Login failed:', reason);
              $rootScope.user = null;
            });
          }
        } else { // someone logged out or no one is already logged in
          if($location.path() != '/login') {
            $cookies.remove('user');
            $rootScope.user = null;
            $window.location.href = '/login';  
          }
        }
      });

      // called by login button
      $scope.login = function() {
        // we have to use gapi to login in order to use the gapi outside of firebase
        // such as gcalendar
        gapi.auth2.getAuthInstance().signIn().then(function(googleUser) {
          console.log('Attempting Google login through gapi:', googleUser);
          // grab the google credential then login to firebase 
          var credential = firebase.auth.GoogleAuthProvider.credential(googleUser.getAuthResponse().id_token);
          $firebaseAuth().$signInWithCredential(credential).then(function() {
            // auth listener takes over
          });
        });
      };

      // called by logout button
      $scope.logout = function() {
        AccountServices.logout().then(function() {
          console.log('Signout successful!');
        });
      };
    }
]);
