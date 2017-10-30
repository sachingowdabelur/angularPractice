'use strict';

/**
 * adminapp
 */

angular.module('adminapp', [
  'ui.router',
  'ngMaterial',
  'ngResource',
  'products',
  'navbar',
  'login'
])

.factory('httpInterceptors',[ '$q', '$rootScope', '$location',function($q, $rootScope, $location) {
return {
    'request': function(config) {
       if( $rootScope.session && config.method === 'GET' && config.url.indexOf('.html') === -1 ){
	  var paramDelimiter = config.url.indexOf('?') === -1 ? '?' : '&';
	  config.url = config.url + paramDelimiter + '_timeStamp'+ new Date().getTime();
	  }	  
      return config;
    },

   'requestError': function(rejection) {
      // do something on error
      if (canRecover(rejection)) {
        return responseOrNewPromise
      }
      return $q.reject(rejection);
    },

    'response': function(response) {
       if($rootScope.session){
	 
		 if($rootScope.session.location != location.path() ){
			$rootScope.session.errormsg = '';
		 }
		 rootScope.session.location = location.path();
       }
      return response;
    },

   'responseError': function(response) {
     var httpStatusCode = response.status !== undefined ? response.status : 400;
     if($rootScope.session){
	 
		 if($rootScope.session.location != $location.path() ){
			$rootScope.session.errormsg = '';
		 }
		 $rootScope.session.location = $location.path();
		switch (httpStatusCode) {
		case 403: $rootScope.session.authenticated = false;
				  $location.path('/login');
				  break;
		case 500: $rootScope.session.errormsg = "An unexpected error as occured";
			  break;	
		}
	 }	
    return $q.reject(rejection);
    }
  };
}])



/**
 * Application wide constants
 */

.constant('apiURL', window.CONFIG.host.concat(window.CONFIG.uri.replace(/\/$/, '')))
.constant('apiHOST', window.CONFIG.host)
.constant('dreamfactoryApiKey', window.CONFIG.dfApiKey)

/**
 * Config
 */

.config([
  '$urlRouterProvider', '$locationProvider', '$httpProvider', '$compileProvider', '$stateProvider',
  function ($urlRouterProvider, $locationProvider, $httpProvider, $compileProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/');

    // Config
    $locationProvider.html5Mode(false);
    $httpProvider.useApplyAsync(true);
    $compileProvider.debugInfoEnabled(false);

    $stateProvider.state('loginUser', {
      url: '/',
      templateUrl: '/apps/adminapp/account/login.html'
    });

    $stateProvider.state('home', {
      url: '/product',
      templateUrl: '/apps/adminapp/product/products.html'
    });
      
    $httpProvider.interceptors.push('httpInterceptors');
  }
])


.run([ '$http',
  function ($http) {
    var dfApiKey = window.CONFIG.df_api_key;
    if (!dfApiKey) throw 'Cannot proceed without dreamfactory api key';
    $http.defaults.headers.common['X-DreamFactory-Api-Key'] = dfApiKey;
  }
])

/**
 * Application controller
 */

.controller('AppCtrl', [
  '$scope',
  function ($scope) {
  
  }
]);

/**
 * Bootstrap
 */

angular.element(document).ready(function() {
  angular.bootstrap(document, ['adminapp'], { strictDi: true });
});
