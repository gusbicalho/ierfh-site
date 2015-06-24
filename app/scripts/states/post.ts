///<reference path="../../../typings/project.d.ts" />

import fs = require('fs');
import stripBom = require('strip-bom');
import WordpressModel = require('../services/wordpress-model');

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
              private WordpressModel: WordpressModel.Service) {
      WordpressModel.getPost(postName)
        .then((post) => this.post = post);
  }
  post: WordpressModel.Post;
  detailsCollapsed: boolean = true;
}
