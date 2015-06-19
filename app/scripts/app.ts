///<reference path="../../typings/project.d.ts" />

import _ = require('lodash');

export function RegisterWith(module: ng.IModule) {
  module.config(config)
        .run(basicSetup)
        .controller('AppController',AppController);
}

function config($urlRouterProvider: ng.ui.IUrlRouterProvider,
                $locationProvider: ng.ILocationProvider,
                $stateProvider: ng.ui.IStateProvider) {
  $urlRouterProvider.otherwise('/');
  $locationProvider.html5Mode({
    enabled:true,
    requireBase: false
  });
  $locationProvider.hashPrefix('!');
}

function basicSetup($log: ng.ILogService,
                    $rootScope: ng.IRootScopeService) {
  $rootScope.$on('$stateChangeError',function(event,toState,toParams,fromState,fromParams,error) {
    $log.log('$stateChangeError',event,toState,toParams,fromState,fromParams);
    $log.error(error.code, error);
  });
}

class AppController {
  // @ngInject
  constructor() {}
}
