///<reference path="../../../typings/project.d.ts" />

import fs = require('fs');
import stripBom = require('strip-bom');

export function RegisterWith(module: ng.IModule) {
  module.config(configStates);
}

function configStates($stateProvider: ng.ui.IStateProvider) {
  $stateProvider
    .state('post', {
      url: '/post/:postName',
      resolve: {
        postName: ($stateParams: ng.ui.IStateParamsService) => $stateParams['postName']
      },
      template: stripBom(fs.readFileSync(__dirname+'/post.html','utf-8')),
      controller: Controller,
      controllerAs: 'ctrl'
    })
    ;
}

export class Controller {
  // @ngInject
  constructor(private postName: string,
              public $http: ng.IHttpService) {
      $http.get('wp-json/posts?filter[name]='+encodeURIComponent(postName))
        .then((result: any) => this.post = result.data[0])
  }
  post: any;
  detailsCollapsed: boolean = true;
}
