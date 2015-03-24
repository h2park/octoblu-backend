'use strict';

angular.module('octobluApp')
    .controller('ResourcesController', function($rootScope, $scope, $http) {

      $scope.resources = [
        {
          title: 'Getting started with Octoblu video',
          link: 'https://youtu.be/UAT1F8hF-nI?list=PLyh2CvBTlon4R_ibknRl9CCKfn_1eAted',
          icon: 'fa fa-play',
          summary: 'Octoblu quick start tutorial video is a great way to familiarize yourself with creating solutions with Octoblu.',
        },
        {
          title: 'Getting started with Octoblu Documentation',
          link: 'http://cdn.ws.citrix.com/wp-content/uploads/2015/01/Octoblu_Getting_Started.pdf?_ga=1.196412460.1064020618.1427145342',
          icon: 'fa fa-book',
          summary: 'Documentation for "Getting started with Octoblu".',
        },
        {
          title: 'Octoblu Developer Site',
          link: 'https://developer.octoblu.com',
          icon: 'fa fa-link',
          summary: 'Documentation for developers.',
        },
        {
          title: 'Octoblu Blog',
          link: 'http://blog.citrix.com/team/octoblu/',
          icon: 'fa fa-link',
          summary: 'Stay up-to-date with Octoblu.',
        },
        {
          title: 'Octoblu Developer YouTube Playlist',
          link: 'https://www.youtube.com/playlist?list=PLyh2CvBTlon4R_ibknRl9CCKfn_1eAted',
          icon: 'fa fa-play',
          summary: 'A variety of YouTube video tutorials on how to use Octoblu.',
        },
        {
          title: 'Hackster Tutorials',
          link: 'http://www.hackster.io/octoblu',
          icon: 'fa fa-book',
          summary: 'Step-by-step walkthroughs using Octoblu\'s platform with your devices.',
        },
        {
          title: 'Blu - iOS',
          link: 'https://itunes.apple.com/us/app/blu/id938900017?mt=8',
          icon: 'fa fa-link',
          summary: 'Blu for iOS provides a dead simple way for Octoblu users to trigger flows created in the Octoblu designer. With a simple click of a button, you can do just about anything.',
        },
        {
          title: 'Blu - Android',
          link: 'https://play.google.com/store/apps/details?id=com.octoblu.blu',
          icon: 'fa fa-link',
          summary: 'Blu for Android provides a dead simple way for Octoblu users to trigger flows created in the Octoblu designer. With a simple click of a button, you can do just about anything.',
        },
        {
          title: 'Gateblu',
          link: 'https://gateblu.octoblu.com/',
          icon: 'fa fa-link',
          summary: 'Gateblu allows you to connect smart devices, motors, servos, sensors, and additional protocols to Meshblu and Octoblu!',
        },
        {
          title: 'Contact via Chat',
          link: 'https://gitter.im/octoblu/chat',
          icon: 'fa fa-link',
          summary: 'Chat with the Octoblu team.',
        },
        {
          title: 'Status',
          link: 'http://status.octoblu.com/',
          icon: 'fa fa-link',
          summary: 'View the current status of the designer.',
        },
      ];

    });
