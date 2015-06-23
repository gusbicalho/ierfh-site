///<reference path="../../../typings/project.d.ts" />

import fs = require('fs');
import stripBom = require('strip-bom');

export function RegisterWith(module: ng.IModule) {
  module.config(configStates);
}

function configStates($stateProvider: ng.ui.IStateProvider) {
  $stateProvider
    .state('landing', {
      url: '/',
      resolve: {
        Posts: ($http: ng.IHttpService) => $http.get('wp-json/posts/').then((result: any) => result.data)
      },
      template: stripBom(fs.readFileSync(__dirname+'/landing.html','utf-8')),
      controller: LandingController,
      controllerAs: 'ctrl'
    })
    ;
}

export class LandingController {
  // @ngInject
  constructor(public Posts: any[]) {
  }
}
