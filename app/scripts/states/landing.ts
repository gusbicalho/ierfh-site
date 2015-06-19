///<reference path="../../../typings/project.d.ts" />

export function RegisterWith(module: ng.IModule) {
  module.config(configStates);
}

function configStates($stateProvider: ng.ui.IStateProvider) {
  $stateProvider
    .state('landing', {
      url: '/',
      templateUrl: 'views/landing.html',
      controller: LandingController,
      controllerAs: 'ctrl'
    })
    ;
}

export class LandingController {
  // @ngInject
  constructor() {}
}
