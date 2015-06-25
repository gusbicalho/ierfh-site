///<reference path="../../typings/project.d.ts" />

import _ = require('lodash');
import WordpressModel = require('./services/wordpress-model');

export function RegisterWith(module: ng.IModule) {
  module.config(config)
        .run(basicSetup)
        .run(preLoad)
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

function preLoad(WordpressModel: WordpressModel.Service,
                 $q: ng.IQService) {
  $q.all([
    WordpressModel.categoriesAccessor().get(),
    WordpressModel.categoriesAccessor().getTerms()
      .then((terms) => $q.all(
        _.map(terms, (t) =>
                      WordpressModel.categoriesAccessor().getTerm(t.slug))
      )),
    WordpressModel.tagsAccessor().get(),
    WordpressModel.tagsAccessor().getTerms()
      .then((terms) => $q.all(
        _.map(terms, (t) => WordpressModel.tagsAccessor().getTerm(t.ID))
      )),
  ]).then(() => console.log("Preloaded."));
}

class AppController {
  // @ngInject
  constructor() {}
}
