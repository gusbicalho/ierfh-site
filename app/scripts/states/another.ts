///<reference path="../../../typings/project.d.ts" />

import fs = require('fs');
import stripBom = require('strip-bom');

export function RegisterWith(module: ng.IModule) {
  module.config(configStates);
}

function configStates($stateProvider: ng.ui.IStateProvider) {
  $stateProvider
    .state('another', {
      url: '/another',
      views: {
        '': {
          template: stripBom(fs.readFileSync(__dirname+'/another.html','utf-8')),
          controller: Controller,
          controllerAs: 'ctrl'
        },
        'navbar-right': {
          template: '<li><a href>Another link</a></li>'
        }
      },
    })
    ;
}

export class Controller {
  // @ngInject
  constructor() {}
}
