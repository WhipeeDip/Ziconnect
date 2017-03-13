/**
 * File name: newEventController.js
 * Authors: Elliot Yoon, David Lin
 * Description: Controls events.
 */

angular.module('controllers')
  .controller('newEventController', ['$scope', '$firebaseArray', '$location',
    function($scope, $firebaseArray, $location) {

      var eventRef = firebase.database().ref('eventList');
      $scope.newEvent = {};

      $scope.createEvent = function(uid) {
        
        var evTime = new Date($scope.eventTime);
        evTimeString = evTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
        console.log(evTime);
        var newEvent = {
          eventName: $scope.eventName,
          eventLocation: $scope.eventLocation,
          eventTime: evTimeString,
          eventDate: $scope.eventDate.toDateString(),
          eventDescription: $scope.eventDescription,
          eventPotluck: true
        };

        console.log(newEvent);

        // key for the new event
        var key = newEventRef = eventRef.push(newEvent).key;
        console.log('ID: ' + key);
        
        // adding the user as the admin in the eventGuests list
        var guestRef = firebase.database().ref('eventGuests');
        guestRef.child(key).child(uid).set(4);

        // creating a branch in database for the event's messages
        var commentRef = firebase.database().ref('eventMessages');
        commentRef.child(key).set('');

        // pushing the events into the list of events a user is in
        var uEventsRef = firebase.database().ref('eventsUserIsIn');
        uEventsRef.child(uid).child(key).set('');
        
        
        $location.path('/home');
      };

      $scope.editEvent = function() {
        var thisEventRef = firebase.database().ref('eventList/' +
          $scope.eventData.$id);

        var evTime = new Date($scope.eventData.eventTime);
        evTimeString = evTime.toLocaleTimeString([], {hour: '2-digit', minute:
          '2-digit'});
        console.log(evTime);
        var newEvent = {
            eventName: $scope.eventData.eventName,
            eventLocation: $scope.eventData.eventLocation,
            eventTime: evTimeString,
            eventDate: $scope.eventData.eventDate.toDateString(),
            eventDescription: $scope.eventData.eventDescription,
            eventPotluck: true
        };
        console.log(newEvent);

        //eventRef.push(newEvent);
        thisEventRef.update(newEvent);

        $location.path('/' + $scope.eventData.$id + '/info');
      };
    }
  ]);
