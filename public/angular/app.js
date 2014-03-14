// create the module and name it e2eApp
var e2eApp = angular.module('e2eApp', ['ui.router', 'ui.bootstrap', 'ngAnimate', 'ngSanitize']);

    // enabled CORS by removing ajax header
e2eApp.config(function($httpProvider) {
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    })
    .config(function ($httpProvider, $locationProvider, $stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'pages/home.html',
                controller: 'mainController'
            })
            .state('home2', {
                url: '/home2',
                templateUrl: 'pages/home2.html',
                controller: 'mainController'
            })
            .state('about', {
                url: '/about',
                templateUrl: 'pages/about.html',
                controller: 'aboutController'
            })
            .state('contact', {
                url: '/contact',
                templateUrl: 'pages/contact.html',
                controller: 'contactController'
            })
            .state('profile', {
                url: '/profile',
                templateUrl: 'pages/profile.html',
                controller: 'profileController'
            })
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'pages/dashboard.html',
                controller: 'dashboardController'
            })
            .state('connector', {
                url: '/connector',
                templateUrl: 'pages/connector.html',
                controller: 'connectorController'
            })
            .state('connector.apis', {
                url: '/apis',
                templateUrl : 'pages/connector.html',
                controller  : 'connectorController'
            })
            .state('connector.apis.detail', {
                url: '/apis/:name',
                templateUrl : 'pages/api_detail.html',
                controller  : 'apiController'
            })
            .state('connector.devices', {
                url: '/devices',
                templateUrl: 'pages/connector/devices.html',
                controller: 'connectorController'
            })
            .state('connector.channels', {
                url: '/channels',
                templateUrl: 'pages/connector/channels.html',
                controller: 'ChannelController'
            })
            .state('connector.channels.detail', {
                url: '/:name',
                templateUrl: 'pages/connector/channels_detail.html',
                controller: 'ChannelController'
            })
            .state('connector.gateway', {
                url: '/gateway',
                templateUrl: 'pages/gateway.html',
                controller: 'gatewayController'
            })
            .state('connector.tools', {
                url: '/tools',
                templateUrl: 'pages/connector/tools.html',
                controller: 'ToolController'
            })
            .state('admin', {
                url: '/admin',
                templateUrl: 'pages/admin.html',
                controller: 'adminController'
            })
            .state('analyzer', {
                url: '/analyzer',
                templateUrl: 'pages/analyzer.html',
                controller: 'AnalyzerController'
            })
            .state('docs', {
                url: '/docs',
                templateUrl: 'pages/docs.html',
                controller: 'docsController'
            })
            .state('apieditor', {
                url: '/apieditor/:name',
                templateUrl: 'pages/api_editor.html',
                controller: 'apieditorController'
            })
            .state('apieditor.resources', {
                url: '/resources',
                templateUrl: 'pages/api_resources.html',
                controller: 'apiresourcesController'
            })
            .state('apieditor.resources.detail', {
                url: '/:apiname',
                templateUrl: 'pages/api_resource_details.html',
                controller: 'apiresourcesController'
            })
            .state('controller', {
                url: '/controller',
                templateUrl: 'pages/controller.html',
                controller: 'controllerController'
            })
            .state('designer', {
                url: '/designer',
                templateUrl: 'pages/designer.html',
                controller: 'designerController'
            })
            .state('community', {
                url: '/community',
                templateUrl : 'pages/community.html',
                controller  : 'communityController'
            })
            .state('community.posts', {
                url: '/community/posts/:slug',
                templateUrl : 'pages/community-post.html',
                controller  : 'communityPostController'
            })
            .state('services', {
                url: '/services',
                templateUrl: 'pages/services.html',
                controller: 'servicesController'
            })
            .state('pricing', {
                url: '/pricing',
                templateUrl: 'pages/pricing.html',
                controller: 'pricingController'
            })
            .state('faqs', {
                url: '/faqs',
                templateUrl: 'pages/faqs.html',
                controller: 'faqsController'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'pages/login.html',
                controller: 'loginController'
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'pages/signup.html',
                controller: 'signupController'
            })
            .state('forgot', {
                url: '/forgot',
                templateUrl: 'pages/forgot.html',
                controller: 'forgotController'
            });

        $locationProvider.html5Mode(true);

        // For any unmatched url, redirect to /
        $urlRouterProvider.otherwise("/");
    })
    // configure our routes
    .config(function($locationProvider, $sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'http://*:*@red.meshines.com:*/**',
            'http://*:*@designer.octoblu.com:*/**',
            'http://skynet.im/**',
            'http://54.203.249.138:8000/**',
            '**'
        ]);
    });
